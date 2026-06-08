import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, SafeAreaView,
    ActivityIndicator, StyleSheet, StatusBar, TextInput, Alert,
} from 'react-native';
import { useWangkuAdminStore } from '../../store/useWangkuAdminStore';
import { useMenuStore } from '../../store/useMenuStore';
import MenuCard from '../../components/MenuCard';
import PaymentModal from '../../components/PaymentModal';
import ReceiptModal from '../../components/ReceiptModal';
import AddMenuModal from '../../components/AddMenuModal';
import { Search, Store, LayoutGrid, Utensils, Coffee, CakeSlice, Inbox } from 'lucide-react-native';

const categoryIcons: Record<string, (color: string) => React.ReactNode> = {
    'Semua': (c) => <LayoutGrid size={18} color={c} />,
    'Makanan': (c) => <Utensils size={18} color={c} />,
    'Minuman': (c) => <Coffee size={18} color={c} />,
    'Camilan': (c) => <CakeSlice size={18} color={c} />,
};

export default function AdminScreen() {
    const { cart, totalPrice, addToCart, decreaseQty, clearCart, checkout, isLoading: isCheckingOut } = useWangkuAdminStore();
    const { menus, isLoading, loadMenus, deleteMenu } = useMenuStore();

    const [activeCategory, setActiveCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [lastPaymentMethod, setLastPaymentMethod] = useState('CASH');
    const [receiptCart, setReceiptCart] = useState(cart);
    const [receiptTotal, setReceiptTotal] = useState(0);

    useEffect(() => {
        loadMenus();
    }, [loadMenus]);

    // Hanya tampilkan kategori yang punya menu, plus 'Semua'
    const existingCategories = Array.from(new Set(menus.map(m => m.category || 'Makanan')));
    // Urutkan supaya 'Makanan', 'Minuman', 'Camilan' konsisten jika ada
    const sortedCategories = ['Makanan', 'Minuman', 'Camilan'].filter(c => existingCategories.includes(c));
    // Jika ada kategori aneh (misal dari DB lama), tambahkan di belakang
    existingCategories.forEach(c => {
        if (!['Makanan', 'Minuman', 'Camilan'].includes(c)) sortedCategories.push(c);
    });

    const categories = ['Semua', ...sortedCategories];

    // Filter menu berdasarkan kategori aktif dan pencarian
    const filteredMenus = menus.filter(menu => {
        const matchCategory = activeCategory === 'Semua' || (menu.category || 'Makanan') === activeCategory;
        const matchSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    // Ambil quantity menu dari keranjang
    const getMenuQty = useCallback((id: string) => {
        return cart.find(c => c.menuId === id)?.qty || 0;
    }, [cart]);

    // Admin tap + pada menu
    const handleIncreaseMenu = useCallback((id: string, name: string, price: number) => {
        addToCart({ id, name, price, qty: 1 });
    }, [addToCart]);

    // Admin tap - pada menu
    const handleDecreaseMenu = useCallback((id: string) => {
        decreaseQty(id);
    }, [decreaseQty]);

    // Admin tap Hapus menu
    const handleDeleteMenu = useCallback(async (id: string, name: string) => {
        try {
            await deleteMenu(id);
        } catch (error) {
            Alert.alert('Error', 'Gagal menghapus menu');
        }
    }, [deleteMenu]);

    // Admin tekan "Bayar" → buka payment modal
    const handleOpenPayment = () => {
        if (cart.length === 0) {
            Alert.alert('Oops', 'Pilih menu terlebih dahulu!');
            return;
        }
        setShowPayment(true);
    };

    // Proses bayar Cash
    const handlePayCash = async () => {
        setLastPaymentMethod('CASH');
        setReceiptCart([...cart]);
        setReceiptTotal(totalPrice);
        setShowPayment(false);
        await checkout('CASH');
        setShowReceipt(true);
    };

    // Proses bayar QRIS
    const handlePayQRIS = async () => {
        setLastPaymentMethod('QRIS');
        setReceiptCart([...cart]);
        setReceiptTotal(totalPrice);
        setShowPayment(false);
        // TODO: Tampilkan QR Code dulu sebelum selesai
        await checkout('QRIS');
        setShowReceipt(true);
    };

    // Tutup struk, reset semua
    const handleCloseReceipt = () => {
        setShowReceipt(false);
    };

    // Hitung total item di keranjang
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoContainer}>
                        <Store size={22} color="#2563EB" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Wangku</Text>
                    </View>
                </View>

                {/* Tombol Tambah Menu */}
                <TouchableOpacity
                    style={styles.addMenuBtn}
                    activeOpacity={0.7}
                    onPress={() => setShowAddMenu(true)}
                >
                    <Text style={styles.addMenuBtnText}>+ Menu</Text>
                </TouchableOpacity>
            </View>

            {/* SEARCH BAR */}
            <View style={styles.searchWrapper}>
                <View style={styles.searchContainer}>
                    <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari menu..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* FILTER KATEGORI */}
            <View style={styles.categoryContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={({ item }) => {
                        const isActive = activeCategory === item;
                        return (
                            <TouchableOpacity
                                onPress={() => setActiveCategory(item)}
                                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                                activeOpacity={0.7}
                            >
                                <View style={styles.categoryIcon}>
                                    {categoryIcons[item] ? categoryIcons[item](isActive ? '#FFFFFF' : '#6B7280') : <LayoutGrid size={18} color={isActive ? '#FFFFFF' : '#6B7280'} />}
                                </View>
                                <View>
                                    <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                                        {item}
                                    </Text>
                                    {isActive && (
                                        <Text style={styles.categoryCount}>
                                            {item === 'Semua' ? menus.length : menus.filter(m => (m.category || 'Makanan') === item).length} Item
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <View style={styles.divider} />

            {/* GRID MENU */}
            <View style={styles.menuArea}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        numColumns={2}
                        key={'grid-2-cols'}
                        data={filteredMenus}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 120 }}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        renderItem={({ item }) => (
                            <MenuCard
                                id={item.id}
                                name={item.name}
                                category={item.category || 'Makanan'}
                                price={item.price}
                                imageUrl={item.imageUrl ?? undefined}
                                qty={getMenuQty(item.id)}
                                onIncrease={handleIncreaseMenu}
                                onDecrease={handleDecreaseMenu}
                                onDelete={handleDeleteMenu}
                            />
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Inbox size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
                                <Text style={styles.emptyText}>Menu masih kosong</Text>
                                <Text style={styles.emptySubtext}>Tekan "+ Menu" untuk menambahkan</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* FLOATING ORDER BAR */}
            {cart.length > 0 && (
                <View style={styles.floatingCart}>
                    <View style={styles.floatingCartInfo}>
                        <View style={styles.floatingCartBadge}>
                            <Text style={styles.floatingCartBadgeText}>{totalItems}</Text>
                        </View>
                        <View>
                            <Text style={styles.floatingCartLabel}>Pesanan</Text>
                            <Text style={styles.floatingCartTotal}>
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.floatingCartBtn}
                        onPress={handleOpenPayment}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.floatingCartBtnText}>Bayar →</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* MODALS */}
            <PaymentModal
                visible={showPayment}
                cart={cart}
                totalPrice={totalPrice}
                onSelectCash={handlePayCash}
                onSelectQRIS={handlePayQRIS}
                onClose={() => setShowPayment(false)}
            />

            <ReceiptModal
                visible={showReceipt}
                cart={receiptCart}
                totalPrice={receiptTotal}
                paymentMethod={lastPaymentMethod}
                onClose={handleCloseReceipt}
            />

            <AddMenuModal
                visible={showAddMenu}
                onClose={() => {
                    setShowAddMenu(false);
                    loadMenus(); // Refresh list setelah tambah menu
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    // === HEADER ===
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    logoIcon: { fontSize: 20 },
    headerTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
    headerSubtitle: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
    addMenuBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    addMenuBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    // === SEARCH ===
    searchWrapper: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 42,
    },
    searchIcon: { fontSize: 14, marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
    // === KATEGORI ===
    categoryContainer: {
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingBottom: 10,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 16,
        marginRight: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryPillActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
    categoryIcon: { marginRight: 8 },
    categoryText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
    categoryTextActive: { color: '#FFFFFF' },
    categoryCount: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 1 },
    divider: { height: 3, backgroundColor: '#2563EB', marginHorizontal: 16, borderRadius: 2 },
    // === MENU AREA ===
    menuArea: { flex: 1, paddingTop: 8 },
    // === EMPTY STATE ===
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, fontWeight: '700', color: '#6B7280', marginBottom: 4 },
    emptySubtext: { fontSize: 13, color: '#9CA3AF' },
    // === FLOATING CART ===
    floatingCart: {
        position: 'absolute',
        bottom: 96, // Disesuaikan agar tidak tertimpa navbar melayang
        left: 16,
        right: 16,
        backgroundColor: '#111827',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    floatingCartInfo: { flexDirection: 'row', alignItems: 'center' },
    floatingCartBadge: {
        backgroundColor: '#2563EB',
        borderRadius: 10,
        minWidth: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        marginRight: 12,
    },
    floatingCartBadgeText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
    floatingCartLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
    floatingCartTotal: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
    floatingCartBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
    },
    floatingCartBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
});