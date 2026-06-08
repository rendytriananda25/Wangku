import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, text, children } from '@nozbe/watermelondb/decorators'

export default class Transaction extends Model {
    static table = 'transactions'

    @field('total_amount') totalAmount!: number
    @text('payment_method') paymentMethod!: string
    @text('status') status!: string

    @readonly @date('created_at') createdAt!: Date

    // Relasi: 1 Transaksi punya banyak Item
    @children('transaction_items') items!: any
}