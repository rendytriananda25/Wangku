import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { Store, UserCircle, ChevronDown, Banknote, Receipt, ShoppingBasket, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { data, isLoading, filter, loadAnalytics } = useAnalyticsStore();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        loadAnalytics();
    }, []);

    if (isLoading || !data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#006c49" size="large" />
            </View>
        );
    }

    // Hitung max sales untuk progres bar (agar proporsional)
    const maxSales = data.topMenus.length > 0 ? Math.max(...data.topMenus.map(m => m.salesCount)) : 1;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* TOP HEADER */}
            <View style={styles.appBar}>
                <View style={styles.appBarLeft}>
                    <Store size={24} color="#006c49" />
                    <Text style={styles.appBarTitle}>Wangku</Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <UserCircle size={24} color="#6c7a71" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header & Filter */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.pageTitle}>Analytics Overview</Text>
                        <Text style={styles.pageSubtitle}>
                            {filter === 'Hari' ? "Today's Performance" : filter === 'Minggu' ? "This Week's Performance" : "This Month's Performance"}
                        </Text>
                    </View>

                    <View style={{ zIndex: 50 }}>
                        <TouchableOpacity
                            style={styles.dropdownBtn}
                            onPress={() => setShowDropdown(!showDropdown)}
                        >
                            <Text style={styles.dropdownBtnText}>{filter}</Text>
                            <ChevronDown size={18} color="#191c1d" />
                        </TouchableOpacity>

                        {showDropdown && (
                            <View style={styles.dropdownMenu}>
                                {['Hari', 'Minggu', 'Bulan'].map((opt) => (
                                    <TouchableOpacity
                                        key={opt}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setShowDropdown(false);
                                            loadAnalytics(opt as any);
                                        }}
                                    >
                                        <Text style={[styles.dropdownItemText, filter === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Cards Grid */}
                <View style={styles.cardsGrid}>
                    {/* Card 1 */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Banknote size={20} color="#6c7a71" />
                            <Text style={styles.cardTitle}>Total Pendapatan</Text>
                        </View>
                        <Text style={styles.cardValuePrimary}>Rp {data.totalSales.toLocaleString('id-ID')}</Text>
                        <View style={styles.cardTrend}>
                            {data.growthPercentage >= 0 ? (
                                <>
                                    <TrendingUp size={14} color="#10b981" />
                                    <Text style={styles.trendTextUp}>+{data.growthPercentage.toFixed(1)}% vs last period</Text>
                                </>
                            ) : (
                                <>
                                    <TrendingDown size={14} color="#ba1a1a" />
                                    <Text style={styles.trendTextDown}>{data.growthPercentage.toFixed(1)}% vs last period</Text>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Card 2 */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Receipt size={20} color="#6c7a71" />
                            <Text style={styles.cardTitle}>Jumlah Transaksi</Text>
                        </View>
                        <Text style={styles.cardValue}>{data.transactionCount}</Text>
                        <View style={styles.cardTrend}>
                            <Minus size={14} color="#6c7a71" />
                            <Text style={styles.trendTextNeutral}>Stable</Text>
                        </View>
                    </View>

                    {/* Card 3 */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <ShoppingBasket size={20} color="#6c7a71" />
                            <Text style={styles.cardTitle}>Rata-rata Keranjang</Text>
                        </View>
                        <Text style={styles.cardValue}>Rp {Math.round(data.averageBasketSize).toLocaleString('id-ID')}</Text>
                        <View style={styles.cardTrend}>
                            <Minus size={14} color="#6c7a71" />
                            <Text style={styles.trendTextNeutral}>-</Text>
                        </View>
                    </View>
                </View>

                {/* Top Items Section */}
                <View style={styles.topItemsCard}>
                    <Text style={styles.topItemsTitle}>Top 5 Best-Selling Items</Text>
                    <View style={styles.topItemsList}>
                        {data.topMenus.map((item, idx) => {
                            // Calculate width for progress bar
                            const percentage = Math.max(5, (item.salesCount / maxSales) * 100);
                            return (
                                <View key={item.id} style={styles.topItemRow}>
                                    <View style={styles.topItemInfo}>
                                        <Text style={styles.topItemName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.topItemSales}>{item.salesCount} sold</Text>
                                    </View>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: `${percentage}%`, opacity: 1 - (idx * 0.1) }]} />
                                    </View>
                                </View>
                            );
                        })}
                        {data.topMenus.length === 0 && (
                            <Text style={{ color: '#6c7a71', textAlign: 'center', marginVertical: 16 }}>Belum ada data menu</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    appBar: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#bbcabf',
    },
    appBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    appBarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#006c49',
    },
    iconButton: {
        padding: 4,
        borderRadius: 20,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24,
        zIndex: 50,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#191c1d',
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#3c4a42',
        marginTop: 4,
    },
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    dropdownBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#191c1d',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        width: 120,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#3c4a42',
        fontWeight: '500',
    },
    dropdownItemTextActive: {
        color: '#006c49',
        fontWeight: 'bold',
    },
    cardsGrid: {
        gap: 16,
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e1e3e4',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 12,
        color: '#3c4a42',
    },
    cardValuePrimary: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#006c49',
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#191c1d',
    },
    cardTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    trendTextUp: {
        fontSize: 12,
        color: '#10b981',
    },
    trendTextDown: {
        fontSize: 12,
        color: '#ba1a1a',
    },
    trendTextNeutral: {
        fontSize: 12,
        color: '#6c7a71',
    },
    topItemsCard: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e1e3e4',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    topItemsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#191c1d',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e3e4',
        paddingBottom: 16,
        marginBottom: 16,
    },
    topItemsList: {
        gap: 16,
    },
    topItemRow: {
        flexDirection: 'column',
    },
    topItemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    topItemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#191c1d',
        flex: 1,
    },
    topItemSales: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3c4a42',
    },
    progressBarBg: {
        width: '100%',
        backgroundColor: '#f3f4f5',
        borderRadius: 4,
        height: 8,
    },
    progressBarFill: {
        backgroundColor: '#006c49',
        height: 8,
        borderRadius: 4,
    },
});
