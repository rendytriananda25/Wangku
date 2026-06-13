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

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Menu')}>
          <View style={[styles.iconContainer, activeTab === 'Menu' && styles.iconContainerActive]}>
            <Store color={activeTab === 'Menu' ? '#007353' : '#6c7a71'} size={24} />
          </View>
          <Text style={[styles.navText, activeTab === 'Menu' && styles.navTextActive]}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Riwayat')}>
          <View style={[styles.iconContainer, activeTab === 'Riwayat' && styles.iconContainerActive]}>
            <Clock color={activeTab === 'Riwayat' ? '#007353' : '#6c7a71'} size={24} />
          </View>
          <Text style={[styles.navText, activeTab === 'Riwayat' && styles.navTextActive]}>Riwayat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Statistik')}>
          <View style={[styles.iconContainer, activeTab === 'Statistik' && styles.iconContainerActive]}>
            <LineChart color={activeTab === 'Statistik' ? '#007353' : '#6c7a71'} size={24} />
          </View>
          <Text style={[styles.navText, activeTab === 'Statistik' && styles.navTextActive]}>Statistik</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Pengaturan')}>
          <View style={[styles.iconContainer, activeTab === 'Pengaturan' && styles.iconContainerActive]}>
            <SettingsIcon color={activeTab === 'Pengaturan' ? '#007353' : '#6c7a71'} size={24} />
          </View>
          <Text style={[styles.navText, activeTab === 'Pengaturan' && styles.navTextActive]}>Setelan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e3e4',
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 24, // extra padding for bottom safe area
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  iconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: '#97f5cc',
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c7a71',
  },
  navTextActive: {
    color: '#007353',
    fontWeight: '700',
  }
});