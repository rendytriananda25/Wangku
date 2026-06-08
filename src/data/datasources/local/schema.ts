import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
    version: 2,
    tables: [
        tableSchema({
            name: 'menus',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'category', type: 'string' },
                { name: 'price', type: 'number' },
                { name: 'image_url', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'transactions',
            columns: [
                { name: 'total_amount', type: 'number' },
                { name: 'payment_method', type: 'string' }, // 'CASH' | 'QRIS'
                { name: 'status', type: 'string' },         // 'COMPLETED' | 'REFUNDED'
                { name: 'created_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'transaction_items',
            columns: [
                { name: 'transaction_id', type: 'string', isIndexed: true },
                { name: 'menu_id', type: 'string', isIndexed: true },
                { name: 'quantity', type: 'number' },
                { name: 'subtotal', type: 'number' },
                { name: 'created_at', type: 'number' },
            ]
        }),
    ]
})