import { TransactionEntity, CartItemEntity } from '../../entities/TransactionEntity';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';

/**
 * CreateTransactionUseCase — Membuat transaksi baru dari keranjang.
 */
export class CreateTransactionUseCase {
    constructor(private transactionRepo: ITransactionRepository) {}

    async execute(
        totalAmount: number,
        paymentMethod: 'CASH' | 'QRIS',
        items: CartItemEntity[],
    ): Promise<TransactionEntity> {
        // Validasi bisnis
        if (items.length === 0) throw new Error('Keranjang kosong, tidak bisa checkout');
        if (totalAmount <= 0) throw new Error('Total harus lebih dari 0');

        return this.transactionRepo.create(totalAmount, paymentMethod, items);
    }
}

/**
 * GetTransactionHistoryUseCase — Mengambil riwayat semua transaksi.
 */
export class GetTransactionHistoryUseCase {
    constructor(private transactionRepo: ITransactionRepository) {}

    async execute(): Promise<TransactionEntity[]> {
        return this.transactionRepo.getAll();
    }
}
