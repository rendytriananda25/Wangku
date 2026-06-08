import { MenuEntity } from '../../entities/MenuEntity';
import { IMenuRepository } from '../../repositories/IMenuRepository';

/**
 * GetAllMenusUseCase — Mengambil semua data menu.
 * Tidak tahu database apa yang dipakai di belakang layar.
 */
export class GetAllMenusUseCase {
    constructor(private menuRepo: IMenuRepository) {}

    async execute(): Promise<MenuEntity[]> {
        return this.menuRepo.getAll();
    }
}

/**
 * AddMenuUseCase — Menambahkan menu baru.
 */
export class AddMenuUseCase {
    constructor(private menuRepo: IMenuRepository) {}

    async execute(name: string, category: string, price: number, imageUrl?: string): Promise<MenuEntity> {
        // Validasi bisnis di sini
        if (!name.trim()) throw new Error('Nama menu tidak boleh kosong');
        if (!category.trim()) throw new Error('Kategori menu tidak boleh kosong');
        if (price <= 0) throw new Error('Harga harus lebih dari 0');

        return this.menuRepo.add(name.trim(), category.trim(), price, imageUrl);
    }
}

/**
 * DeleteMenuUseCase — Menghapus menu.
 */
export class DeleteMenuUseCase {
    constructor(private menuRepo: IMenuRepository) {}

    async execute(id: string): Promise<void> {
        return this.menuRepo.delete(id);
    }
}

/**
 * SyncMenusUseCase — Sinkronisasi data menu antara lokal & cloud.
 */
export class SyncMenusUseCase {
    constructor(private menuRepo: IMenuRepository) {}

    async pullFromCloud(): Promise<void> {
        return this.menuRepo.pullFromCloud();
    }

    async pushToCloud(): Promise<void> {
        return this.menuRepo.pushToCloud();
    }
}
