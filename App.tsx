import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Store, Clock, LineChart } from 'lucide-react-native';
import AdminScreen from './src/presentation/screens/admin/AdminScreen';
import HistoryScreen from './src/presentation/screens/history/HistoryScreen';
import AnalyticsScreen from './src/presentation/screens/analytics/AnalyticsScreen';
import SettingsScreen from './src/presentation/screens/settings/SettingsScreen';
import LoginScreen from './src/presentation/screens/auth/LoginScreen';
import RegisterScreen from './src/presentation/screens/auth/RegisterScreen';
import { Settings as SettingsIcon } from 'lucide-react-native';
import { useAuthStore } from './src/presentation/store/useAuthStore';
import { useSettingsStore } from './src/presentation/store/useSettingsStore';
import { supabase } from './src/core/config/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Menu' | 'Riwayat' | 'Statistik' | 'Pengaturan'>('Menu');
  const [isRegistering, setIsRegistering] = useState(false);
  const { session, setSession, isLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.user_metadata?.store_name && !useSettingsStore.getState().storeName) {
        useSettingsStore.getState().updateSettings({ storeName: session.user.user_metadata.store_name });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.user_metadata?.store_name && !useSettingsStore.getState().storeName) {
        useSettingsStore.getState().updateSettings({ storeName: session.user.user_metadata.store_name });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Komponen animasi halus tanpa library tambahan
  const TabScreen = ({ name, children }: { name: string, children: React.ReactNode }) => {
    const isVisible = activeTab === name;
    const opacity = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
    const translateY = useRef(new Animated.Value(isVisible ? 0 : 10)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: isVisible ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: isVisible ? 0 : 10,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }, [isVisible]);

    return (
      <Animated.View
        pointerEvents={isVisible ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFill,
          { opacity, transform: [{ translateY }], zIndex: isVisible ? 10 : 0 }
        ]}
      >
        {children}
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#EFF6FF' }} />
      </SafeAreaProvider>
    );
  }

  if (!session) {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        {isRegistering ? (
          <RegisterScreen onNavigateLogin={() => setIsRegistering(false)} />
        ) : (
          <LoginScreen onNavigateRegister={() => setIsRegistering(true)} />
        )}
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={{ flex: 1 }}>
        <TabScreen name="Menu"><AdminScreen /></TabScreen>
        <TabScreen name="Riwayat"><HistoryScreen /></TabScreen>
        <TabScreen name="Statistik"><AnalyticsScreen /></TabScreen>
        <TabScreen name="Pengaturan"><SettingsScreen /></TabScreen>
      </View>

      <View style={styles.floatingNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Menu')}>
          <Store color={activeTab === 'Menu' ? '#2563EB' : '#9CA3AF'} size={24} />
          <Text style={[styles.navText, activeTab === 'Menu' && styles.navTextActive]}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Riwayat')}>
          <Clock color={activeTab === 'Riwayat' ? '#2563EB' : '#9CA3AF'} size={24} />
          <Text style={[styles.navText, activeTab === 'Riwayat' && styles.navTextActive]}>Riwayat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Statistik')}>
          <LineChart color={activeTab === 'Statistik' ? '#2563EB' : '#9CA3AF'} size={24} />
          <Text style={[styles.navText, activeTab === 'Statistik' && styles.navTextActive]}>Statistik</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Pengaturan')}>
          <SettingsIcon color={activeTab === 'Pengaturan' ? '#2563EB' : '#9CA3AF'} size={24} />
          <Text style={[styles.navText, activeTab === 'Pengaturan' && styles.navTextActive]}>Setelan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  floatingNav: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 999,
    gap: 24, // reduced gap to fit 4 icons
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 4,
  },
  navTextActive: {
    color: '#2563EB',
  }
});