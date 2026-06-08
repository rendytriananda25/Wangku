import { TransactionEntity, CartItemEntity, TransactionItemEntity } from '../entities/TransactionEntity';

/**
 * ITransactionRepository — Kontrak abstrak untuk akses data Transaksi.
 */
export interface ITransactionRepository {
    /** Buat transaksi baru dari daftar item keranjang */
    create(
        totalAmount: number,
        paymentMethod: 'CASH' | 'QRIS',
        items: CartItemEntity[],
    ): Promise<TransactionEntity>;

    /** Ambil semua transaksi dari storage lokal */
    getAll(): Promise<TransactionEntity[]>;

    /** Ambil semua detail item transaksi untuk statistik */
    getAllItems(): Promise<TransactionItemEntity[]>;
}
