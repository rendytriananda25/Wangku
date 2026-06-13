import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { IMenuRepository } from '../../repositories/IMenuRepository';

export interface AnalyticsData {
    totalSales: number;
    growthPercentage: number;
    transactionCount: number;
    averageBasketSize: number;
    chartData: number[]; // Dinamis berdasarkan filter
    chartLabels: string[]; // Label dinamis
    topMenus: any[]; 
}

export class GetAnalyticsDataUseCase {
    constructor(
        private txRepo: ITransactionRepository,
        private menuRepo: IMenuRepository
    ) {}

    async execute(filter: 'Hari' | 'Minggu' | 'Bulan' = 'Minggu'): Promise<AnalyticsData> {
        const txs = await this.txRepo.getAll();
        const menus = await this.menuRepo.getAll();

        const now = new Date();
        let thisPeriodTotal = 0;
        let lastPeriodTotal = 0;
        
        let chartData: number[] = [];
        let chartLabels: string[] = [];

        if (filter === 'Hari') {
            chartData = new Array(7).fill(0);
            chartLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
            
            // Hari ini adalah hari ke berapa di minggu ini (0: Minggu, 6: Sabtu)
            const currentDay = now.getDay();
            // Geser ke standar (0: Senin, 6: Minggu)
            const dayOffset = currentDay === 0 ? 6 : currentDay - 1;
            
            // Batas awal minggu (Senin 00:00)
            const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset);
            const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset - 7);

            txs.forEach(tx => {
                const txDate = new Date(tx.createdAt);
                if (txDate >= startOfWeek) {
                    thisPeriodTotal += tx.totalAmount;
                    const dayIdx = txDate.getDay() === 0 ? 6 : txDate.getDay() - 1;
                    chartData[dayIdx] += tx.totalAmount;
                } else if (txDate >= startOfLastWeek && txDate < startOfWeek) {
                    lastPeriodTotal += tx.totalAmount;
                }
            });

        } else if (filter === 'Minggu') {
            chartData = [0, 0, 0, 0];
            chartLabels = ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'];

            txs.forEach(tx => {
                const txDate = new Date(tx.createdAt);
                if (txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()) {
                    thisPeriodTotal += tx.totalAmount;
                    const date = txDate.getDate();
                    if (date <= 7) chartData[0] += tx.totalAmount;
                    else if (date <= 14) chartData[1] += tx.totalAmount;
                    else if (date <= 21) chartData[2] += tx.totalAmount;
                    else chartData[3] += tx.totalAmount;
                } else if (txDate.getMonth() === (now.getMonth() - 1 === -1 ? 11 : now.getMonth() - 1)) {
                    lastPeriodTotal += tx.totalAmount;
                }
            });
            
        } else if (filter === 'Bulan') {
            chartData = new Array(12).fill(0);
            chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

            txs.forEach(tx => {
                const txDate = new Date(tx.createdAt);
                if (txDate.getFullYear() === now.getFullYear()) {
                    thisPeriodTotal += tx.totalAmount;
                    chartData[txDate.getMonth()] += tx.totalAmount;
                } else if (txDate.getFullYear() === now.getFullYear() - 1) {
                    lastPeriodTotal += tx.totalAmount;
                }
            });
        }

        let transactionCount = 0;
        let lastPeriodTransactionCount = 0;
        
        txs.forEach(tx => {
            const txDate = new Date(tx.createdAt);
            if (filter === 'Hari') {
                const currentDay = now.getDay();
                const dayOffset = currentDay === 0 ? 6 : currentDay - 1;
                const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset);
                if (txDate >= startOfWeek) transactionCount++;
            } else if (filter === 'Minggu') {
                if (txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()) transactionCount++;
            } else if (filter === 'Bulan') {
                if (txDate.getFullYear() === now.getFullYear()) transactionCount++;
            }
        });
        
        const averageBasketSize = transactionCount > 0 ? thisPeriodTotal / transactionCount : 0;

        let growthPercentage = 0;
        if (thisPeriodTotal === 0 && lastPeriodTotal === 0) {
            growthPercentage = 0;
        } else if (lastPeriodTotal === 0) {
            growthPercentage = thisPeriodTotal > 0 ? 100 : 0;
        } else {
            growthPercentage = ((thisPeriodTotal - lastPeriodTotal) / lastPeriodTotal) * 100;
        }

        // TODO: Saat TransactionItems sdh ada di Repository, ganti logika ini dengan query join yang nyata
        const topMenus = menus.slice(0, 3).map((menu, idx) => {
            const salesCount = 1045 - (idx * 250);
            const revenue = menu.price * salesCount;
            const percentage = 61 - (idx * 15);
            return { ...menu, salesCount, revenue, percentage };
        });

        return {
            totalSales: thisPeriodTotal,
            growthPercentage,
            transactionCount,
            averageBasketSize,
            chartData,
            chartLabels,
            topMenus
        };
    }
}
