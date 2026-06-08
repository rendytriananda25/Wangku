/**
 * MenuEntity — Pure domain model untuk Menu.
 * TIDAK BOLEH import apapun dari React Native, WatermelonDB, atau Supabase.
 */
export interface MenuEntity {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
