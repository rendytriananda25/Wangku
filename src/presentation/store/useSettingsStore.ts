import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    receiptFooter: string;
    logoUrl: string | null;
    isTaxEnabled: boolean;
    taxPercentage: number;
    securityPin: string | null;
    qrisImageUri: string | null;
    updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            storeName: '',
            storeAddress: '',
            storePhone: '',
            receiptFooter: 'Terima kasih atas kunjungan Anda!',
            logoUrl: null,
            isTaxEnabled: false,
            taxPercentage: 10,
            securityPin: null,
            qrisImageUri: null,
            updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
        }),
        {
            name: 'wangku-settings-v2',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
