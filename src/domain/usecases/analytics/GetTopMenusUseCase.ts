import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { IMenuRepository } from '../../repositories/IMenuRepository';

export interface TopMenuData {
    id: string;
    name: string;
    category: string;
    price: number;
    salesCount: number;
    revenue: number;
    percentage: number;
}

export class GetTopMenusUseCase {
    constructor(
        private txRepo: ITransactionRepository,
        private menuRepo: IMenuRepository
    ) {}

    async execute(): Promise<TopMenuData[]> {
        const items = await this.txRepo.getAllItems();
        const menus = await this.menuRepo.getAll();

        let totalRevenueAll = 0;
        const menuStats: Record<string, { count: number, revenue: number }> = {};

        // Hitung total sales dan revenue per menu
        items.forEach(item => {
            if (!menuStats[item.menuId]) {
                menuStats[item.menuId] = { count: 0, revenue: 0 };
            }
            menuStats[item.menuId].count += item.quantity;
            menuStats[item.menuId].revenue += item.subtotal;
            totalRevenueAll += item.subtotal;
        });

        // Gabungkan dengan data menu aslinya
        const topMenus: TopMenuData[] = menus.map(menu => {
            const stats = menuStats[menu.id] || { count: 0, revenue: 0 };
            const percentage = totalRevenueAll > 0 ? (stats.revenue / totalRevenueAll) * 100 : 0;
            return {
                id: menu.id,
                name: menu.name,
                category: menu.category,
                price: menu.price,
                salesCount: stats.count,
                revenue: stats.revenue,
                percentage: Math.round(percentage)
            };
        });

        // Urutkan dari yang paling laris, dan ambil top 3
        return topMenus
            .filter(m => m.salesCount > 0)
            .sort((a, b) => b.salesCount - a.salesCount)
            .slice(0, 3);
    }
}
