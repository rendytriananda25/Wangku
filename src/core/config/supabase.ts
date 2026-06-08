import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

/**
 * Supabase Client
 * Diinisialisasi dengan URL dan Anon Key dari file .env
 * 
 * Pastikan tabel berikut sudah dibuat di Supabase Dashboard:
 * - menus (id uuid PK, name text, category text, price numeric, image_url text, created_at timestamptz, updated_at timestamptz)
 * - transactions (id uuid PK, total_amount numeric, payment_method text, status text, created_at timestamptz)
 * - transaction_items (id uuid PK, transaction_id uuid FK, menu_id uuid FK, quantity int, subtotal numeric, created_at timestamptz)
 */

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️ SUPABASE_URL atau SUPABASE_ANON_KEY belum diset di .env!');
}

export const supabase = createClient(
    SUPABASE_URL || '',
    SUPABASE_ANON_KEY || '',
);
