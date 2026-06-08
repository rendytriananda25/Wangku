import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { mySchema } from './schema'
import Menu from './models/Menu'
import Transaction from './models/Transaction'
import TransactionItem from './models/TransactionItem'

const adapter = new SQLiteAdapter({
    schema: mySchema,
    // (opsional) diset true jika antum butuh log SQL saat debugging di console
    jsi: true,
    onSetUpError: error => {
        console.error("Gagal setup database lokal:", error)
    }
})

export const database = new Database({
    adapter,
    modelClasses: [
        Menu,
        Transaction,
        TransactionItem,
    ],
})