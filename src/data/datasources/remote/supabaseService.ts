import { supabase } from '../../../core/config/supabase';


export class SupabaseMenuService {

    async fetchAllMenus() {
        const { data, error } = await supabase
            .from('menus')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Gagal fetch menus: ${error.message}`);
        return data || [];
    }

    async upsertMenu(menu: {
        id: string;
        name: string;
        category: string;
        price: number;
        image_url?: string | null;
        created_at: string;
        updated_at: string;
    }) {
        const { error } = await supabase
            .from('menus')
            .upsert(menu, { onConflict: 'id' });

        if (error) throw new Error(`Gagal upsert menu: ${error.message}`);
    }

    async deleteMenu(id: string) {
        const { error } = await supabase
            .from('menus')
            .delete()
            .eq('id', id);

        if (error) throw new Error(`Gagal hapus menu: ${error.message}`);
    }
}

export class SupabaseTransactionService {

    async pushTransaction(transaction: {
        id: string;
        total_amount: number;
        payment_method: string;
        status: string;
        created_at: string;
    }, items: Array<{
        id: string;
        transaction_id: string;
        menu_id: string;
        quantity: number;
        subtotal: number;
        created_at: string;
    }>) {
        const { error: txError } = await supabase
            .from('transactions')
            .upsert(transaction, { onConflict: 'id' });

        if (txError) throw new Error(`Gagal push transaksi: ${txError.message}`);
        if (items.length > 0) {
            const { error: itemError } = await supabase
                .from('transaction_items')
                .upsert(items, { onConflict: 'id' });

            if (itemError) throw new Error(`Gagal push item transaksi: ${itemError.message}`);
        }
    }
    async fetchAllTransactions() {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                transaction_items (
                    *,
                    menus (name, price)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Gagal fetch transaksi: ${error.message}`);
        return data || [];
    }
}
