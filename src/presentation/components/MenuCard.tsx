import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { UtensilsCrossed, Plus, Minus, MoreVertical, Edit2, Trash2 } from 'lucide-react-native';

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
    onEdit?: (id: string, name: string) => void;
}

const MenuCard = ({ id, name, category, price, imageUrl, qty, onIncrease, onDecrease, onDelete, onEdit }: MenuCardProps) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleDelete = () => {
        setShowMenu(false);
        Alert.alert('Hapus Menu', `Yakin ingin menghapus ${name}?`, [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: () => onDelete(id, name) }
        ]);
    };

    const handleEdit = () => {
        setShowMenu(false);
        if (onEdit) {
            onEdit(id, name);
        } else {
            Alert.alert('Info', 'Fitur edit menu sedang dalam pengembangan.');
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.card, qty > 0 && styles.cardActive]}
            onPress={() => onIncrease(id, name, price)}
            activeOpacity={0.8}
        >
            {qty > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{qty}</Text>
                </View>
            )}

            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                    <UtensilsCrossed size={32} color="#9CA3AF" />
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name} numberOfLines={1}>{name}</Text>
                        <Text style={styles.price}>Rp {price.toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={{ zIndex: 99 }}>
                        <TouchableOpacity 
                            style={styles.moreBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => setShowMenu(!showMenu)}
                        >
                            <MoreVertical size={18} color="#6c7a71" />
                        </TouchableOpacity>

                        {showMenu && (
                            <View style={styles.dropdownMenu}>
                                <TouchableOpacity style={styles.dropdownItem} onPress={handleEdit}>
                                    <Edit2 size={14} color="#3c4a42" />
                                    <Text style={styles.dropdownText}>Edit</Text>
                                </TouchableOpacity>
                                <View style={styles.dropdownDivider} />
                                <TouchableOpacity style={styles.dropdownItem} onPress={handleDelete}>
                                    <Trash2 size={14} color="#ba1a1a" />
                                    <Text style={[styles.dropdownText, { color: '#ba1a1a' }]}>Hapus</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
                
                {qty === 0 ? (
                    <TouchableOpacity 
                        onPress={() => onIncrease(id, name, price)} 
                        style={styles.addBtn}
                    >
                        <Plus size={16} color="#006c49" />
                        <Text style={styles.addBtnText}>Tambah</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.actionRow}>
                        <TouchableOpacity onPress={() => onDecrease(id)} style={styles.iconBtnMinus}>
                            <Minus size={16} color="#3c4a42" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onIncrease(id, name, price)} style={styles.iconBtnPlus}>
                            <Plus size={16} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bbcabf',
        // Removed overflow: 'hidden' to allow dropdown to break out
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cardActive: {
        borderWidth: 2,
        borderColor: '#006c49',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#006c49',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    imageContainer: {
        height: 128,
        backgroundColor: '#edeeef',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderTopLeftRadius: 11,
        borderTopRightRadius: 11,
        zIndex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 12,
        flex: 1,
        justifyContent: 'space-between',
        zIndex: 2,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#191c1d',
    },
    price: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#006c49',
        marginTop: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    moreBtn: {
        padding: 4,
        marginRight: -4,
        marginTop: -4,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 24,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#bbcabf',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 100,
        zIndex: 999,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 8,
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: '#e1e3e4',
    },
    dropdownText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3c4a42',
    },
    addBtn: {
        marginTop: 12,
        width: '100%',
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#f3f4f5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    addBtnText: {
        color: '#006c49',
        fontSize: 12,
        fontWeight: '600',
    },
    actionRow: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconBtnMinus: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#f3f4f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBtnPlus: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: '#006c49',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default memo(MenuCard);