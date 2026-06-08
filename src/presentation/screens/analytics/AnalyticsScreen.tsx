import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { getTopMenusUseCase } from '../../../core/di/container';
import { TopMenuData } from '../../../domain/usecases/analytics/GetTopMenusUseCase';
import { DollarSign, Utensils, Coffee, CakeSlice, ChevronDown } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { data, isLoading, filter, loadAnalytics } = useAnalyticsStore();
    const [topMenus, setTopMenus] = useState<TopMenuData[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const chartAnim = useRef(new Animated.Value(0)).current;

    const fetchData = async () => {
        await loadAnalytics();
        const realTopMenus = await getTopMenusUseCase.execute();
        setTopMenus(realTopMenus);
    };

    useEffect(() => {
        fetchData().then(() => {
            Animated.timing(chartAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        });
    }, []);

    if (isLoading || !data) return <View style={styles.center}><ActivityIndicator color="#6366F1" /></View>;

    // Cari nilai tertinggi untuk persentase bar chart
    const maxSales = Math.max(...data.chartData);
    const peakSales = maxSales === 0 ? 1 : maxSales; // Hindari pembagian 0

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.card}>
                
                {/* Header & Dropdown */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View>
                            <Text style={styles.title}>Total Penjualan</Text>
                            <Text style={styles.subtitle}>
                                {filter === 'Hari' ? 'Minggu Ini' : filter === 'Minggu' ? 'Bulan Ini' : 'Tahun Ini'}
                            </Text>
                        </View>
                    </View>

                    <View style={{ zIndex: 50 }}>
                        <TouchableOpacity 
                            style={styles.dropdownBtn} 
                            onPress={() => setShowDropdown(!showDropdown)}
                        >
                            <Text style={styles.dropdownBtnText}>{filter}</Text>
                            <ChevronDown size={14} color="#6B7280" />
                        </TouchableOpacity>

                        {showDropdown && (
                            <View style={styles.dropdownMenu}>
                                {['Hari', 'Minggu', 'Bulan'].map((opt) => (
                                    <TouchableOpacity 
                                        key={opt}
                                        style={styles.dropdownItem}
                                        onPress={async () => {
                                            setShowDropdown(false);
                                            chartAnim.setValue(0);
                                            await loadAnalytics(opt as any);
                                            const realTopMenus = await getTopMenusUseCase.execute();
                                            setTopMenus(realTopMenus);
                                            Animated.timing(chartAnim, { toValue: 1, duration: 1000, useNativeDriver: false }).start();
                                        }}
                                    >
                                        <Text style={[styles.dropdownItemText, filter === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Amount */}
                <View style={styles.amountRow}>
                    <Text style={styles.amount}>Rp {data.totalSales.toLocaleString('id-ID')}</Text>
                    <View style={[styles.badge, { backgroundColor: data.growthPercentage >= 0 ? '#D1FAE5' : '#FEE2E2' }]}>
                        <Text style={[styles.badgeText, { color: data.growthPercentage >= 0 ? '#059669' : '#DC2626' }]}>
                            {data.growthPercentage >= 0 ? '+' : ''}{data.growthPercentage.toFixed(1)}%
                        </Text>
                    </View>
                </View>

                {/* Bar Chart Realtime */}
                <View style={styles.chartContainer}>
                    <View style={styles.barsArea}>
                        {data.chartData.map((val, idx) => {
                            const isPeak = val === maxSales && maxSales > 0;
                            const heightPercent = (val / peakSales) * 100;
                            const animatedHeight = chartAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', `${heightPercent}%`]
                            });
                            
                            return (
                                <View key={idx} style={styles.barWrapper}>
                                    <Animated.View style={[styles.bar, { height: animatedHeight, backgroundColor: isPeak ? '#2563EB' : '#DBEAFE', maxWidth: filter === 'Bulan' ? 20 : 40 }]} />
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.chartLabels}>
                        {data.chartLabels.map((lbl, idx) => (
                            <Text key={idx} style={[styles.chartLabel, { fontSize: filter === 'Bulan' ? 8 : 10 }]}>{lbl}</Text>
                        ))}
                    </View>
                </View>

                {/* Top Menus */}
                <Text style={styles.sectionTitle}>Top Menu Terlaris</Text>
                <View style={styles.topMenusList}>
                    {data.topMenus.map((item, idx) => (
                        <View key={item.id} style={styles.menuItem}>
                            <View style={[styles.menuIconBox, { backgroundColor: idx === 0 ? '#D1FAE5' : idx === 1 ? '#FEF3C7' : '#E0E7FF' }]}>
                                {item.category === 'Minuman' ? <Coffee size={20} color={idx === 0 ? '#059669' : idx === 1 ? '#D97706' : '#4F46E5'} /> : 
                                 item.category === 'Camilan' ? <CakeSlice size={20} color={idx === 0 ? '#059669' : idx === 1 ? '#D97706' : '#4F46E5'} /> : 
                                 <Utensils size={20} color={idx === 0 ? '#059669' : idx === 1 ? '#D97706' : '#4F46E5'} />}
                            </View>
                            <View style={styles.menuInfo}>
                                <Text style={styles.menuName}>{item.name}</Text>
                                <Text style={styles.menuSales}>{item.salesCount} porsi</Text>
                            </View>
                            <View style={styles.menuStats}>
                                <Text style={styles.menuRevenue}>Rp {item.revenue.toLocaleString('id-ID')}</Text>
                                <Text style={styles.menuPercentage}>{item.percentage}%</Text>
                            </View>
                        </View>
                    ))}
                    {data.topMenus.length === 0 && (
                        <Text style={styles.emptyText}>Belum ada data menu</Text>
                    )}
                </View>
                
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#F8F9FB', padding: 16, paddingTop: 40 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, zIndex: 50 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    title: { fontSize: 16, color: '#111827', fontWeight: '700' },
    subtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    dropdownBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
    dropdownBtnText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
    dropdownMenu: { position: 'absolute', top: 32, right: 0, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, width: 100 },
    dropdownItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    dropdownItemText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
    dropdownItemTextActive: { color: '#2563EB', fontWeight: '700' },
    amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, zIndex: 1 },
    amount: { fontSize: 32, fontWeight: '800', color: '#111827' },
    badge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 12, fontWeight: '800' },
    chartContainer: { height: 200, marginBottom: 40, position: 'relative' },
    barsArea: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 8 },
    barWrapper: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
    bar: { width: '100%', borderRadius: 4, maxWidth: 16 },
    chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    chartLabel: { color: '#6B7280', fontSize: 10, fontWeight: '600' },
    sectionTitle: { fontSize: 18, color: '#111827', fontWeight: '700', marginBottom: 20 },
    topMenusList: { gap: 20 },
    menuItem: { flexDirection: 'row', alignItems: 'center' },
    menuIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    menuInfo: { flex: 1 },
    menuName: { color: '#111827', fontSize: 15, fontWeight: '700', marginBottom: 4 },
    menuSales: { color: '#6B7280', fontSize: 12 },
    menuStats: { alignItems: 'flex-end' },
    menuRevenue: { color: '#111827', fontSize: 14, fontWeight: '800', marginBottom: 4 },
    menuPercentage: { color: '#6B7280', fontSize: 12, fontWeight: '600' },
    emptyText: { color: '#6B7280', fontSize: 14, textAlign: 'center' }
});
