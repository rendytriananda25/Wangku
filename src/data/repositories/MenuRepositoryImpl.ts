import { MenuEntity } from '../../domain/entities/MenuEntity';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { database } from '../datasources/local/database';
import Menu from '../datasources/local/models/Menu';
import { SupabaseMenuService } from '../datasources/remote/supabaseService';

const menuService = new SupabaseMenuService();

/**
 * MenuRepositoryImpl — Implementasi konkrit IMenuRepository.
 * Di sinilah WatermelonDB dan Supabase boleh dipakai.
 * Domain layer tidak tahu file ini ada.
 */
export class MenuRepositoryImpl implements IMenuRepository {

    /** Konversi model WatermelonDB → domain entity */
    private toEntity(model: Menu): MenuEntity {
        return {
            id: model.id,
            name: model.name,
            category: model.category,
            price: model.price,
            imageUrl: model.imageUrl,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }

    async getAll(): Promise<MenuEntity[]> {
        const models = await database.get<Menu>('menus').query().fetch();
        return models.map(m => this.toEntity(m));
    }

    async add(name: string, category: string, price: number, imageUrl?: string): Promise<MenuEntity> {
        // 1. Simpan ke WatermelonDB (lokal)
        const newMenu = await database.write(async () => {
            return await database.get<Menu>('menus').create(menu => {
                menu.name = name;
                menu.category = category;
                menu.price = price;
                if (imageUrl) menu.imageUrl = imageUrl;
            });
        });

        // 2. Sync ke Supabase (background, jangan block UI)
        this.syncToCloud(newMenu).catch(err => {
            console.warn('⚠️ Gagal sync menu ke cloud:', err.message);
        });

        return this.toEntity(newMenu);
    }

    async delete(id: string): Promise<void> {
        // 1. Hapus dari WatermelonDB (lokal)
        const existingMenu = await database.get<Menu>('menus').find(id);
        await database.write(async () => {
            await existingMenu.destroyPermanently();
        });

        // 2. Hapus dari Supabase (background)
        menuService.deleteMenu(id).catch(err => {
            console.warn('⚠️ Gagal hapus menu dari cloud:', err.message);
        });
    }

    async pullFromCloud(): Promise<void> {
        const cloudMenus = await menuService.fetchAllMenus();

        await database.write(async () => {
            for (const cloudMenu of cloudMenus) {
                let existingMenu: Menu | null = null;
                try {
                    existingMenu = await database.get<Menu>('menus').find(cloudMenu.id);
                } catch {
                    // belum ada di lokal
                }

                if (existingMenu) {
                    await existingMenu.update(m => {
                        m.name = cloudMenu.name;
                        m.category = cloudMenu.category || 'Food';
                        m.price = cloudMenu.price;
                        m.imageUrl = cloudMenu.image_url;
                    });
                } else {
                    await database.get<Menu>('menus').create(m => {
                        m._raw.id = cloudMenu.id;
                        m.name = cloudMenu.name;
                        m.category = cloudMenu.category || 'Food';
                        m.price = cloudMenu.price;
                        m.imageUrl = cloudMenu.image_url;
                    });
                }
            }
        });

        console.log(`✅ Pull ${cloudMenus.length} menu dari cloud selesai`);
    }

    async pushToCloud(): Promise<void> {
        const localMenus = await database.get<Menu>('menus').query().fetch();
        let count = 0;

        for (const menu of localMenus) {
            try {
                await this.syncToCloud(menu);
                count++;
            } catch (err: any) {
                console.warn(`⚠️ Gagal push "${menu.name}":`, err.message);
            }
        }

        console.log(`✅ Push ${count}/${localMenus.length} menu ke cloud`);
    }

    private async syncToCloud(menu: Menu): Promise<void> {
        await menuService.upsertMenu({
            id: menu.id,
            name: menu.name,
            category: menu.category,
            price: menu.price,
            image_url: menu.imageUrl || null,
            created_at: menu.createdAt.toISOString(),
            updated_at: menu.updatedAt.toISOString(),
        });
    }
}
