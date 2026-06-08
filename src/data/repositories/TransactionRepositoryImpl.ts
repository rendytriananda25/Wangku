import { TransactionEntity, CartItemEntity, TransactionItemEntity } from '../../domain/entities/TransactionEntity';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { database } from '../datasources/local/database';
import Transaction from '../datasources/local/models/Transaction';
import TransactionItem from '../datasources/local/models/TransactionItem';
import { SupabaseTransactionService } from '../datasources/remote/supabaseService';

const transactionService = new SupabaseTransactionService();

/**
 * TransactionRepositoryImpl — Implementasi konkrit ITransactionRepository.
 */
export class TransactionRepositoryImpl implements ITransactionRepository {

    private toEntity(model: Transaction): TransactionEntity {
        return {
            id: model.id,
            totalAmount: model.totalAmount,
            paymentMethod: model.paymentMethod as 'CASH' | 'QRIS',
            status: model.status as 'COMPLETED' | 'REFUNDED',
            createdAt: model.createdAt,
        };
    }

    private toItemEntity(model: TransactionItem): TransactionItemEntity {
        return {
            id: model.id,
            transactionId: (model as any)._raw.transaction_id,
            menuId: (model as any)._raw.menu_id,
            quantity: model.quantity,
            subtotal: model.subtotal,
            createdAt: model.createdAt,
        };
    }

    async create(
        totalAmount: number,
        paymentMethod: 'CASH' | 'QRIS',
        items: CartItemEntity[],
    ): Promise<TransactionEntity> {
        // 1. Simpan ke WatermelonDB (lokal)
        const newTx = await database.write(async () => {
            const tx = await database.get<Transaction>('transactions').create(t => {
                t.totalAmount = totalAmount;
                t.paymentMethod = paymentMethod;
                t.status = 'COMPLETED';
            });

            for (const item of items) {
                await database.get<TransactionItem>('transaction_items').create(ti => {
                    (ti as any)._raw.transaction_id = tx.id;
                    (ti as any)._raw.menu_id = item.menuId;
                    ti.quantity = item.qty;
                    ti.subtotal = item.price * item.qty;
                });
            }

            return tx;
        });

        // 2. Sync ke Supabase (background)
        this.syncToCloud(newTx).catch(err => {
            console.warn('⚠️ Gagal sync transaksi ke cloud:', err.message);
        });

        return this.toEntity(newTx);
    }

    async getAll(): Promise<TransactionEntity[]> {
        const models = await database.get<Transaction>('transactions').query().fetch();
        return models.map(m => this.toEntity(m));
    }

    async getAllItems(): Promise<TransactionItemEntity[]> {
        const models = await database.get<TransactionItem>('transaction_items').query().fetch();
        return models.map(m => this.toItemEntity(m));
    }

    private async syncToCloud(tx: Transaction): Promise<void> {
        const allItems = await database.get<TransactionItem>('transaction_items').query().fetch();
        const txItems = allItems
            .filter(i => (i as any)._raw.transaction_id === tx.id)
            .map(i => ({
                id: i.id,
                transaction_id: tx.id,
                menu_id: (i as any)._raw.menu_id,
                quantity: i.quantity,
                subtotal: i.subtotal,
                created_at: i.createdAt.toISOString(),
            }));

        await transactionService.pushTransaction(
            {
                id: tx.id,
                total_amount: tx.totalAmount,
                payment_method: tx.paymentMethod,
                status: tx.status,
                created_at: tx.createdAt.toISOString(),
            },
            txItems,
        );

        console.log('✅ Transaksi synced ke cloud:', tx.id);
    }
}
