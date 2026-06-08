import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { getTransactionHistoryUseCase } from '../../../core/di/container';
import { TransactionEntity } from '../../../domain/entities/TransactionEntity';

export default function HistoryScreen() {
    const [transactions, setTransactions] = useState<TransactionEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [page, setPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [paymentFilter, setPaymentFilter] = useState<'Semua' | 'CASH' | 'QRIS'>('Semua');
    const [timeFilter, setTimeFilter] = useState<'Semua Waktu' | 'Hari Ini' | 'Minggu Ini' | 'Bulan Ini'>('Semua Waktu');
    const itemsPerPage = 8;

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await getTransactionHistoryUseCase.execute();
            setTransactions(data);
        } catch (error: any) {
            console.error('Failed to load history', error);
            setErrorMsg(error.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        // Filter Pembayaran
        if (paymentFilter !== 'Semua' && tx.paymentMethod !== paymentFilter) return false;

        // Filter Waktu
        if (timeFilter !== 'Semua Waktu') {
            const txDate = new Date(tx.createdAt);
            const now = new Date();
            
            if (timeFilter === 'Hari Ini') {
                if (txDate.toDateString() !== now.toDateString()) return false;
            } else if (timeFilter === 'Minggu Ini') {
                const diffTime = Math.abs(now.getTime() - txDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 7) return false;
            } else if (timeFilter === 'Bulan Ini') {
                if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
            }
        }
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
    const paginatedData = filteredTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Reset halaman ke 1 jika filter berubah
    useEffect(() => {
        setPage(1);
    }, [paymentFilter, timeFilter]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(2)}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order History</Text>
            
            {loading && <ActivityIndicator size="large" color="#2563EB" style={{ marginBottom: 16 }} />}
            {errorMsg ? <Text style={{ color: 'red', marginBottom: 16 }}>Error: {errorMsg}</Text> : null}

            {/* Search & Filter */}
            <View style={[styles.actionRow, { zIndex: 50 }]}>
                <View style={styles.searchBox}>
                    <Search size={18} color="#9CA3AF" />
                    <TextInput 
                        placeholder="Search" 
                        placeholderTextColor="#9CA3AF"
                        style={styles.searchInput}
                    />
                </View>
                
                <View>
                    <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(!showFilter)}>
                        <SlidersHorizontal size={16} color="#374151" />
                        <Text style={styles.filterText}>Filter</Text>
                    </TouchableOpacity>

                    {showFilter && (
                        <View style={styles.filterMenu}>
                            <Text style={styles.filterTitle}>Metode Pembayaran</Text>
                            <View style={styles.filterOptions}>
                                {['Semua', 'CASH', 'QRIS'].map((opt) => (
                                    <TouchableOpacity key={opt} style={[styles.filterOptBtn, paymentFilter === opt && styles.filterOptBtnActive]} onPress={() => setPaymentFilter(opt as any)}>
                                        <Text style={[styles.filterOptText, paymentFilter === opt && styles.filterOptTextActive]}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.filterTitle, { marginTop: 16 }]}>Waktu Transaksi</Text>
                            <View style={styles.filterOptions}>
                                {['Semua Waktu', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'].map((opt) => (
                                    <TouchableOpacity key={opt} style={[styles.filterOptBtn, timeFilter === opt && styles.filterOptBtnActive]} onPress={() => setTimeFilter(opt as any)}>
                                        <Text style={[styles.filterOptText, timeFilter === opt && styles.filterOptTextActive]}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.headerText, { width: '35%' }]}>Order ID</Text>
                <Text style={[styles.headerText, { width: '35%' }]}>Order date</Text>
                <Text style={[styles.headerText, { width: '30%' }]}>Pembayaran</Text>
            </View>

            {/* Table Body */}
            <View style={{ flex: 1 }}>
                <FlatList
                    data={paginatedData}
                    keyExtractor={item => item?.id || Math.random().toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => {
                        if (!item) return null;
                        const isEven = index % 2 === 0;
                        const isCash = item.paymentMethod === 'CASH';
                        return (
                            <View style={[styles.tableRow, isEven && styles.tableRowEven]}>
                                <Text style={[styles.rowText, { width: '35%' }]}>{item.id ? item.id.slice(0, 6).toUpperCase() : '-'}</Text>
                                <Text style={[styles.rowText, { width: '35%' }]}>{item.createdAt ? formatDate(item.createdAt) : '-'}</Text>
                                <View style={[styles.statusWrapper, { width: '30%' }]}>
                                    <View style={[styles.statusDot, { backgroundColor: isCash ? '#10B981' : '#3B82F6' }]} />
                                    <Text style={styles.rowText}>{item.paymentMethod || '-'}</Text>
                                </View>
                            </View>
                        );
                    }}
                    ListEmptyComponent={<Text style={styles.empty}>Belum ada transaksi</Text>}
                />
            </View>

            {/* Pagination */}
            <View style={styles.pagination}>
                <TouchableOpacity 
                    style={styles.pageBtn} 
                    onPress={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    <ChevronLeft size={18} color={page === 1 ? "#D1D5DB" : "#111827"} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.pageBtn, styles.pageBtnActive]}>
                    <Text style={styles.pageTextActive}>{page}</Text>
                </TouchableOpacity>

                <Text style={styles.pageDots}>...</Text>

                <TouchableOpacity style={styles.pageBtn} onPress={() => setPage(totalPages)}>
                    <Text style={styles.pageText}>{totalPages}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.pageBtn} 
                    onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    <ChevronRight size={18} color={page === totalPages ? "#D1D5DB" : "#111827"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 100 },
    title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 24 },
    
    actionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
    searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 44 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#111827' },
    filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, height: 44, gap: 8 },
    filterText: { fontSize: 14, color: '#374151', fontWeight: '500' },
    
    filterMenu: { position: 'absolute', top: 52, right: 0, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10, width: 280 },
    filterTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8 },
    filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    filterOptBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
    filterOptBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
    filterOptText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
    filterOptTextActive: { color: '#1D4ED8', fontWeight: '700' },

    tableHeader: { flexDirection: 'row', backgroundColor: '#E5E7EB', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8, zIndex: 1 },
    headerText: { fontSize: 13, color: '#111827', fontWeight: '700' },
    
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12 },
    tableRowEven: { backgroundColor: '#F9FAFB' },
    rowText: { fontSize: 13, color: '#374151', fontWeight: '500' },
    statusWrapper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },

    pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 8 },
    pageBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
    pageBtnActive: { backgroundColor: '#111827', borderColor: '#111827' },
    pageText: { fontSize: 14, color: '#374151', fontWeight: '600' },
    pageTextActive: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
    pageDots: { fontSize: 14, color: '#6B7280', marginHorizontal: 4 },

    empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 }
});
