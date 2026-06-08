import { MenuEntity } from '../entities/MenuEntity';

/**
 * IMenuRepository — Kontrak abstrak untuk akses data Menu.
 * Layer Domain TIDAK TAHU apakah implementasinya pakai WatermelonDB, Supabase, atau API lain.
 */
export interface IMenuRepository {
    /** Ambil semua menu dari storage lokal */
    getAll(): Promise<MenuEntity[]>;

    /** Tambah menu baru (simpan lokal + sync cloud) */
    add(name: string, category: string, price: number, imageUrl?: string): Promise<MenuEntity>;

    /** Hapus menu (lokal + cloud) */
    delete(id: string): Promise<void>;

    /** Pull data dari cloud ke lokal */
    pullFromCloud(): Promise<void>;

    /** Push semua data lokal ke cloud */
    pushToCloud(): Promise<void>;
}
