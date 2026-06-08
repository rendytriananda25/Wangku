import React from 'react';
import {
    View, Text, TouchableOpacity, Modal, StyleSheet, FlatList,
} from 'react-native';
import { CartItem } from '../store/useWangkuAdminStore';
import { X, Banknote, QrCode } from 'lucide-react-native';

interface PaymentModalProps {
    visible: boolean;
    cart: CartItem[];
    totalPrice: number;
    onSelectCash: () => void;
    onSelectQRIS: () => void;
    onClose: () => void;
}

export default function PaymentModal({
    visible, cart, totalPrice, onSelectCash, onSelectQRIS, onClose,
}: PaymentModalProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Pembayaran</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Ringkasan Pesanan */}
                    <View style={styles.orderSummary}>
                        <Text style={styles.summaryTitle}>Ringkasan Pesanan</Text>
                        <FlatList
                            data={cart}
                            keyExtractor={(item) => item.menuId}
                            style={{ maxHeight: 200 }}
                            renderItem={({ item }) => (
                                <View style={styles.orderItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemQty}>x{item.qty}</Text>
                                    </View>
                                    <Text style={styles.itemSubtotal}>
                                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                    </Text>
                                </View>
                            )}
                        />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </Text>
                        </View>
                    </View>

                    {/* Pilihan Pembayaran */}
                    <Text style={styles.paymentTitle}>Pilih Metode Pembayaran</Text>

                    <View style={styles.paymentOptions}>
                        <TouchableOpacity
                            style={styles.cashBtn}
                            activeOpacity={0.8}
                            onPress={onSelectCash}
                        >
                            <Banknote size={32} color="#16A34A" />
                            <Text style={styles.cashBtnText}>Cash</Text>
                            <Text style={styles.paymentDesc}>Bayar tunai</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.qrisBtn}
                            activeOpacity={0.8}
                            onPress={onSelectQRIS}
                        >
                            <QrCode size={32} color="#2563EB" />
                            <Text style={styles.qrisBtnText}>QRIS</Text>
                            <Text style={styles.paymentDesc}>Scan QR Code</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '700',
    },
    orderSummary: {
        backgroundColor: '#F8F9FB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 12,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    itemQty: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    itemSubtotal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: '#2563EB',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#2563EB',
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },
    paymentOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    cashBtn: {
        flex: 1,
        backgroundColor: '#F0FDF4',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#22C55E',
    },
    cashBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#16A34A',
        marginTop: 4,
    },
    qrisBtn: {
        flex: 1,
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2563EB',
    },
    qrisBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2563EB',
        marginTop: 4,
    },
    paymentIcon: {
        fontSize: 32,
    },
    paymentDesc: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
    },
});
