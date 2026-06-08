import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators'
import type Menu from './Menu'
import type Transaction from './Transaction'

export default class TransactionItem extends Model {
    static table = 'transaction_items'

    @relation('transactions', 'transaction_id') transaction!: Transaction
    @relation('menus', 'menu_id') menu!: Menu

    @field('quantity') quantity!: number
    @field('subtotal') subtotal!: number

    @readonly @date('created_at') createdAt!: Date
}