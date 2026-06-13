import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    ActivityIndicator, StatusBar, TextInput, Alert, useWindowDimensions, ScrollView, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWangkuAdminStore } from '../../store/useWangkuAdminStore';
import { useMenuStore } from '../../store/useMenuStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import MenuCard from '../../components/MenuCard';
import PaymentModal from '../../components/PaymentModal';
import ReceiptModal from '../../components/ReceiptModal';
import AddMenuModal from '../../components/AddMenuModal';
import { Search, Store, LayoutGrid, Utensils, Coffee, CakeSlice, Inbox, UserCircle, ArrowRight, Plus } from 'lucide-react-native';

const categoryIcons: Record<string, (color: string) => React.ReactNode> = {
    'Semua': (c) => <LayoutGrid size={18} color={c} />,
    'Makanan': (c) => <Utensils size={18} color={c} />,
    'Minuman': (c) => <Coffee size={18} color={c} />,
    'Camilan': (c) => <CakeSlice size={18} color={c} />,
    'Snack': (c) => <CakeSlice size={18} color={c} />,
};

export default function AdminScreen() {
    const { cart, totalPrice, addToCart, decreaseQty, checkout } = useWangkuAdminStore();
    const { menus, isLoading, loadMenus, deleteMenu, syncFromCloud } = useMenuStore();
    const { storeName } = useSettingsStore();

    const { width } = useWindowDimensions();
    const numColumns = width >= 768 ? 4 : 2;

    const [activeCategory, setActiveCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [lastPaymentMethod, setLastPaymentMethod] = useState('CASH');
    const [receiptCart, setReceiptCart] = useState(cart);
    const [receiptTotal, setReceiptTotal] = useState(0);

    useEffect(() => {
        loadMenus();
        syncFromCloud();
    }, []);

    const existingCategories = Array.from(new Set(menus.map(m => m.category || 'Makanan')));
    const sortedCategories = ['Makanan', 'Minuman', 'Camilan', 'Snack'].filter(c => existingCategories.includes(c));
    existingCategories.forEach(c => {
        if (!['Makanan', 'Minuman', 'Camilan', 'Snack'].includes(c)) sortedCategories.push(c);
    });

    const categories = ['Semua', ...sortedCategories];

    const filteredMenus = menus.filter(menu => {
        const matchCategory = activeCategory === 'Semua' || (menu.category || 'Makanan') === activeCategory;
        const matchSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const getMenuQty = useCallback((id: string) => {
        return cart.find(c => c.menuId === id)?.qty || 0;
    }, [cart]);

    const handleIncreaseMenu = useCallback((id: string, name: string, price: number) => {
        addToCart({ id, name, price, qty: 1 });
    }, [addToCart]);

    const handleDecreaseMenu = useCallback((id: string) => {
        decreaseQty(id);
    }, [decreaseQty]);

    const handleDeleteMenu = useCallback(async (id: string, name: string) => {
        try {
            await deleteMenu(id);
        } catch (error) {
            Alert.alert('Error', 'Gagal menghapus menu');
        }
    }, [deleteMenu]);

    const handleOpenPayment = () => {
        if (cart.length === 0) {
            Alert.alert('Oops', 'Pilih menu terlebih dahulu!');
            return;
        }
        setShowPayment(true);
    };

    const handlePayCash = async () => {
        setLastPaymentMethod('CASH');
        setReceiptCart([...cart]);
        setReceiptTotal(totalPrice);
        setShowPayment(false);
        await checkout('CASH');
        setShowReceipt(true);
    };

    const handlePayQRIS = async () => {
        setLastPaymentMethod('QRIS');
        setReceiptCart([...cart]);
        setReceiptTotal(totalPrice);
        setShowPayment(false);
        await checkout('QRIS');
        setShowReceipt(true);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            
            {/* TOP HEADER */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Store size={24} color="#006c49" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Wangku</Text>
                        <Text style={styles.headerSubtitle}>{storeName}</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setShowAddMenu(true)} style={styles.addMenuButton}>
                        <Plus size={16} color="#ffffff" />
                        <Text style={styles.addMenuText}>Menu</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* SEARCH & FILTER */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Search size={20} color="#6c7a71" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari menu..."
                        placeholderTextColor="#6c7a71"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryScrollContent}>
                    {categories.map((item) => {
                        const isActive = activeCategory === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setActiveCategory(item)}
                                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                            >
                                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* MENU GRID */}
            <View style={styles.gridContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#006c49" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        numColumns={numColumns}
                        key={`grid-${numColumns}`}
                        data={filteredMenus}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.gridContent}
                        columnWrapperStyle={styles.gridRow}
                        renderItem={({ item }) => (
                            <View style={styles.gridItem}>
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
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Inbox size={48} color="#bbcabf" style={{ marginBottom: 16 }} />
                                <Text style={styles.emptyTitle}>Menu masih kosong</Text>
                                <Text style={styles.emptySubtitle}>Tekan tombol "+ Menu" untuk menambahkan</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* FLOATING CART */}
            {cart.length > 0 && (
                <View style={styles.floatingCart}>
                    <View style={styles.cartCard}>
                        <View style={styles.cartInfo}>
                            <Text style={styles.cartItems}>{totalItems} Items</Text>
                            <Text style={styles.cartTotal}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
                        </View>
                        <TouchableOpacity onPress={handleOpenPayment} style={styles.checkoutButton} activeOpacity={0.9}>
                            <Text style={styles.checkoutText}>Lanjut ke Pembayaran</Text>
                            <ArrowRight size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
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
                onClose={() => setShowReceipt(false)}
            />

            <AddMenuModal
                visible={showAddMenu}
                onClose={() => {
                    setShowAddMenu(false);
                    loadMenus();
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#f8f9fa',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e7e8e9',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 4,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#006c49',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#3c4a42',
    },
    addMenuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#006c49',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    addMenuText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    searchSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        zIndex: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#bbcabf',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 14,
        color: '#191c1d',
    },
    categoryScroll: {
        flexGrow: 0,
    },
    categoryScrollContent: {
        gap: 8,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#bbcabf',
        marginRight: 8,
    },
    categoryPillActive: {
        backgroundColor: '#006c49',
        borderColor: '#006c49',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3c4a42',
    },
    categoryTextActive: {
        color: '#ffffff',
    },
    gridContainer: {
        flex: 1,
    },
    gridContent: {
        paddingHorizontal: 16,
        paddingBottom: 160, // extra padding to scroll past the floating cart and bottom navbar
    },
    gridRow: {
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 12,
    },
    gridItem: {
        flex: 1,
        maxWidth: '48%', // For 2 columns
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6c7a71',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#bbcabf',
    },
    floatingCart: {
        position: 'absolute',
        bottom: 100, // Lifted above the bottom navbar
        left: 16,
        right: 16,
        zIndex: 40,
    },
    cartCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbcabf',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    cartInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cartItems: {
        fontSize: 14,
        color: '#3c4a42',
    },
    cartTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#191c1d',
    },
    checkoutButton: {
        backgroundColor: '#006c49',
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    checkoutText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});