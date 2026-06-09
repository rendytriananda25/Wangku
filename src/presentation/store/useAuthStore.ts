import { create } from 'zustand';
import { supabase } from '../../core/config/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../../data/datasources/local/database';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session, isLoading: false }),
    signOut: async () => {
        try {
            await database.write(async () => {
                await database.unsafeResetDatabase();
            });
        } catch (e) {
            console.error('Failed to reset db', e);
        }
        await AsyncStorage.clear();
        await supabase.auth.signOut();
        set({ user: null, session: null });
    },
}));
