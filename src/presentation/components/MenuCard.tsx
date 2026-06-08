import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { UtensilsCrossed, MoreVertical } from 'lucide-react-native';

interface MenuCardProps {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl?: string;
    qty: number;
    onIncrease: (id: string, name: string, price: number) => void;
    onDecrease: (id: string) => void;
    onDelete: (id: string, name: string) => void;
}

const MenuCard = ({ id, name, category, price, imageUrl, qty, onIncrease, onDecrease, onDelete }: MenuCardProps) => {
    return (
        <View style={[styles.card, qty > 0 && styles.cardActive]}>
            {/* Header: Kategori & Tombol Hapus */}
            <View style={styles.topRow}>
                <Text style={styles.categoryLabel}>{category}</Text>
                <TouchableOpacity 
                    style={styles.deleteIcon}
                    onPress={() => {
                        Alert.alert('Hapus Menu', `Yakin ingin menghapus ${name}?`, [
                            { text: 'Batal', style: 'cancel' },
                            { text: 'Hapus', style: 'destructive', onPress: () => onDelete(id, name) }
                        ]);
                    }}
                >
                    <MoreVertical size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            {/* Gambar Menu */}
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <UtensilsCrossed size={32} color="#9CA3AF" />
                    </View>
                )}
            </View>

            {/* Nama Menu */}
            <Text style={styles.menuName} numberOfLines={2}>{name}</Text>

            {/* Area Bawah: Harga & Kontrol */}
            <View style={styles.bottomRow}>
                <Text style={styles.menuPrice}>Rp {price.toLocaleString('id-ID')}</Text>

                {qty > 0 ? (
                    <View style={styles.counterRow}>
                        <TouchableOpacity onPress={() => onDecrease(id)} style={styles.counterBtnMinus}>
                            <Text style={styles.counterBtnMinusText}>−</Text>
                        </TouchableOpacity>

                        <Text style={styles.counterValue}>{qty}</Text>

                        <TouchableOpacity onPress={() => onIncrease(id, name, price)} style={styles.counterBtnPlus}>
                            <Text style={styles.counterBtnPlusText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => onIncrease(id, name, price)} style={styles.addBtn}>
                        <Text style={styles.addBtnText}>+ Tambah</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        margin: 6,
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardActive: {
        borderColor: '#2563EB',
        backgroundColor: '#F8FAFC',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    deleteIcon: {
        padding: 4,
        marginRight: -4,
    },
    imageContainer: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    imagePlaceholder: {
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderIcon: {
        fontSize: 32,
    },
    menuName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
        lineHeight: 18,
        marginBottom: 8,
    },
    bottomRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    menuPrice: {
        fontSize: 15,
        fontWeight: '900',
        color: '#2563EB',
        marginBottom: 12,
    },
    addBtn: {
        backgroundColor: '#EFF6FF',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    addBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2563EB',
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 4,
    },
    counterBtnMinus: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterBtnMinusText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B5563',
    },
    counterValue: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111827',
    },
    counterBtnPlus: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterBtnPlusText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default memo(MenuCard);