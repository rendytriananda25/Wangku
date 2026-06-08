import { create } from 'zustand';
import { MenuEntity } from '../../domain/entities/MenuEntity';
import { getAllMenusUseCase, addMenuUseCase, syncMenusUseCase, deleteMenuUseCase } from '../../core/di/container';

/**
 * useMenuStore — Zustand store untuk state menu.
 * HANYA memanggil Use Cases, TIDAK tahu WatermelonDB / Supabase.
 */
interface MenuState {
    menus: MenuEntity[];
    isLoading: boolean;
    isSyncing: boolean;
    loadMenus: () => Promise<void>;
    addMenu: (name: string, category: string, price: number, imageUrl?: string) => Promise<void>;
    deleteMenu: (id: string) => Promise<void>;
    syncFromCloud: () => Promise<void>;
    syncToCloud: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
    menus: [],
    isLoading: false,
    isSyncing: false,

    loadMenus: async () => {
        set({ isLoading: true });
        try {
            const menus = await getAllMenusUseCase.execute();
            set({ menus });
        } catch (error) {
            console.error('Gagal memuat menu:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addMenu: async (name, category, price, imageUrl) => {
        try {
            await addMenuUseCase.execute(name, category, price, imageUrl);
            await useMenuStore.getState().loadMenus();
        } catch (error) {
            console.error('Gagal menambah menu:', error);
            throw error; // Re-throw agar UI bisa menampilkan Alert
        }
    },

    deleteMenu: async (id) => {
        try {
            await deleteMenuUseCase.execute(id);
            await useMenuStore.getState().loadMenus();
        } catch (error) {
            console.error('Gagal menghapus menu:', error);
            throw error;
        }
    },

    syncFromCloud: async () => {
        set({ isSyncing: true });
        try {
            await syncMenusUseCase.pullFromCloud();
            await useMenuStore.getState().loadMenus();
        } catch (error) {
            console.error('Gagal sync dari cloud:', error);
        } finally {
            set({ isSyncing: false });
        }
    },

    syncToCloud: async () => {
        set({ isSyncing: true });
        try {
            await syncMenusUseCase.pushToCloud();
        } catch (error) {
            console.error('Gagal sync ke cloud:', error);
        } finally {
            set({ isSyncing: false });
        }
    },
}));