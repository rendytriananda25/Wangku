import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Store, UserCircle, ReceiptText, CheckCircle2, XCircle } from 'lucide-react-native';
import { getTransactionHistoryUseCase } from '../../../core/di/container';
import { TransactionEntity } from '../../../domain/entities/TransactionEntity';

export default function HistoryScreen() {
    const [transactions, setTransactions] = useState<TransactionEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await getTransactionHistoryUseCase.execute();
            // Sort by newest first
            const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setTransactions(sorted);
        } catch (error: any) {
            console.error('Failed to load history', error);
        } finally {
            setLoading(false);
        }
    };

    const groupedData = useMemo(() => {
        let filtered = transactions;
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.id.toLowerCase().includes(query) ||
                t.totalAmount.toString().includes(query)
            );
        }

        const groups: { [key: string]: TransactionEntity[] } = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        filtered.forEach(tx => {
            const txDate = new Date(tx.createdAt);
            txDate.setHours(0, 0, 0, 0);
            const timeDiff = txDate.getTime() - today.getTime();
            let title = '';

            if (timeDiff === 0) {
                title = 'Hari Ini';
            } else if (timeDiff === -86400000) { // 1 day in ms
                title = 'Kemarin';
            } else {
                title = `${txDate.getDate()} ${txDate.toLocaleString('id-ID', { month: 'short' })} ${txDate.getFullYear()}`;
            }

            if (!groups[title]) groups[title] = [];
            groups[title].push(tx);
        });

        return Object.keys(groups).map(title => {
            const firstTx = groups[title][0];
            const d = new Date(firstTx.createdAt);
            const dateLabel = `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })} ${d.getFullYear()}`;

            return {
                title,
                dateLabel: title === 'Hari Ini' || title === 'Kemarin' ? dateLabel : '',
                data: groups[title]
            };
        });
    }, [transactions, searchQuery]);

    const formatTime = (date: Date) => {
        const d = new Date(date);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#006c49" size="large" />
            </View>
        );
    }

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

            {/* Main Content Area */}
            <View style={styles.mainContent}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Search size={20} color="#6c7a71" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search by ID or Amount..."
                            placeholderTextColor="#6c7a71"
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Section List */}
                <SectionList
                    sections={groupedData}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            {!!section.dateLabel && (
                                <Text style={styles.sectionDate}>{section.dateLabel}</Text>
                            )}
                        </View>
                    )}
                    renderItem={({ item, index, section }) => {
                        const isRefunded = item.status === 'REFUNDED';
                        const isFirst = index === 0;
                        const isLast = index === section.data.length - 1;

                        return (
                            <View style={[
                                styles.transactionRowContainer,
                                isFirst && styles.transactionRowContainerFirst,
                                isLast && styles.transactionRowContainerLast
                            ]}>
                                <TouchableOpacity
                                    style={[
                                        styles.transactionItem,
                                        isRefunded && styles.transactionItemRefunded,
                                        !isLast && styles.itemBorderBottom,
                                        isFirst && isRefunded && styles.transactionItemRefundedFirst,
                                        isLast && isRefunded && styles.transactionItemRefundedLast
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.itemLeft}>
                                        <View style={[styles.iconBox, isRefunded && styles.iconBoxRefunded]}>
                                            <ReceiptText size={20} color={isRefunded ? '#ba1a1a' : '#006c49'} />
                                        </View>
                                        <View style={styles.itemDetails}>
                                            <View style={styles.itemIdRow}>
                                                <Text style={[styles.txId, isRefunded && styles.textStrikeThrough]}>
                                                    #{item.id.slice(0, 8).toUpperCase()}
                                                </Text>
                                                <View style={[styles.methodBadge, item.paymentMethod === 'CASH' ? styles.methodBadgeCash : styles.methodBadgeQris]}>
                                                    <Text style={[styles.methodText, item.paymentMethod === 'CASH' ? styles.methodTextCash : styles.methodTextQris]}>
                                                        {item.paymentMethod}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.itemRight}>
                                        <Text style={[styles.amountText, isRefunded && styles.textStrikeThrough]}>
                                            Rp {item.totalAmount.toLocaleString('id-ID')}
                                        </Text>
                                        <View style={[styles.statusBadge, isRefunded && styles.statusBadgeRefunded]}>
                                            {isRefunded ? <XCircle size={12} color="#93000a" /> : <CheckCircle2 size={12} color="#00513a" />}
                                            <Text style={[styles.statusText, isRefunded && styles.statusTextRefunded]}>
                                                {item.status}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Tidak ada transaksi ditemukan.</Text>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    appBar: {
        backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#bbcabf', zIndex: 50
    },
    appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    appBarTitle: { fontSize: 20, fontWeight: 'bold', color: '#006c49' },
    iconButton: { padding: 4, borderRadius: 20 },
    mainContent: { flex: 1 },
    searchContainer: {
        paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, backgroundColor: '#f8f9fa', zIndex: 40
    },
    searchBox: { position: 'relative', justifyContent: 'center' },
    searchIcon: { position: 'absolute', left: 12, zIndex: 1 },
    searchInput: {
        backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#bbcabf', borderRadius: 12,
        paddingVertical: 12, paddingLeft: 40, paddingRight: 16, fontSize: 14, color: '#191c1d'
    },
    listContent: { paddingHorizontal: 16, paddingBottom: 40 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 16, paddingHorizontal: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#3c4a42' },
    sectionDate: { fontSize: 12, color: '#6c7a71' },

    transactionRowContainer: {
        backgroundColor: '#ffffff',
        borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#bbcabf',
    },
    transactionRowContainerFirst: {
        borderTopWidth: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden'
    },
    transactionRowContainerLast: {
        borderBottomWidth: 1, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden', marginBottom: 16
    },
    transactionItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16
    },
    transactionItemRefunded: { backgroundColor: 'rgba(255, 218, 214, 0.4)' },
    transactionItemRefundedFirst: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
    transactionItemRefundedLast: { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
    itemBorderBottom: { borderBottomWidth: 1, borderBottomColor: '#bbcabf' },
    itemLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
    iconBox: { backgroundColor: '#f3f4f5', padding: 8, borderRadius: 8 },
    iconBoxRefunded: { backgroundColor: '#ffdad6' },
    itemDetails: { justifyContent: 'center' },
    itemIdRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    txId: { fontSize: 14, fontWeight: '600', color: '#191c1d' },
    textStrikeThrough: { textDecorationLine: 'line-through', color: '#6c7a71' },
    methodBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    methodBadgeQris: { backgroundColor: '#DBEAFE' },
    methodBadgeCash: { backgroundColor: '#FEF3C7' },
    methodText: { fontSize: 10, fontWeight: 'bold' },
    methodTextQris: { color: '#1E40AF' },
    methodTextCash: { color: '#92400E' },
    timeText: { fontSize: 12, color: '#6c7a71' },
    itemRight: { alignItems: 'flex-end' },
    amountText: { fontSize: 14, fontWeight: '600', color: '#191c1d', marginBottom: 4 },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#c3ecd7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12
    },
    statusBadgeRefunded: { backgroundColor: '#ffdad6' },
    statusText: { fontSize: 10, fontWeight: 'bold', color: '#002115' },
    statusTextRefunded: { color: '#93000a' },
    emptyText: { textAlign: 'center', color: '#6c7a71', marginTop: 40 }
});
