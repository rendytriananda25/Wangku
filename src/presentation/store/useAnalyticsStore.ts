import { create } from 'zustand';
import { getAnalyticsDataUseCase } from '../../core/di/container';
import { AnalyticsData } from '../../domain/usecases/analytics/GetAnalyticsDataUseCase';

interface AnalyticsState {
    data: AnalyticsData | null;
    isLoading: boolean;
    filter: 'Hari' | 'Minggu' | 'Bulan';
    loadAnalytics: (filter?: 'Hari' | 'Minggu' | 'Bulan') => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
    data: null,
    isLoading: true,
    filter: 'Minggu',
    loadAnalytics: async (newFilter) => {
        const filterToUse = newFilter || get().filter;
        set({ isLoading: true, filter: filterToUse });
        try {
            const data = await getAnalyticsDataUseCase.execute(filterToUse);
            set({ data });
        } catch (error) {
            console.error('Failed to load analytics', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));
