import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Store, Clock, LineChart } from 'lucide-react-native';
import AdminScreen from './src/presentation/screens/admin/AdminScreen';
import HistoryScreen from './src/presentation/screens/history/HistoryScreen';
import AnalyticsScreen from './src/presentation/screens/analytics/AnalyticsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Menu' | 'Riwayat' | 'Statistik'>('Menu');

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'Menu' && <AdminScreen />}
        {activeTab === 'Riwayat' && <HistoryScreen />}
        {activeTab === 'Statistik' && <AnalyticsScreen />}
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
    elevation: 10,
    gap: 32,
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