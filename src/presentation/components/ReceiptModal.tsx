import React from 'react';
import {
    View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, ScrollView,
} from 'react-native';
import { CartItem } from '../store/useWangkuAdminStore';
import { ReceiptText, Smile } from 'lucide-react-native';

interface ReceiptModalProps {
    visible: boolean;
    cart: CartItem[];
    totalPrice: number;
    paymentMethod: string;
    onClose: () => void;
}

export default function ReceiptModal({
    visible, cart, totalPrice, paymentMethod, onClose,
}: ReceiptModalProps) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
    });
    const receiptNo = `WK-${now.getTime().toString().slice(-8)}`;

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.receipt}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header Struk */}
                        <View style={styles.receiptHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <ReceiptText size={24} color="#111827" />
                                <Text style={styles.storeName}>WANGKU POS</Text>
                            </View>
                            <Text style={styles.storeSubtitle}>Kasir Pintar Masa Kini</Text>
                            <View style={styles.dashedLine} />
                            <Text style={styles.receiptNo}>No: {receiptNo}</Text>
                            <Text style={styles.receiptDate}>{dateStr} • {timeStr}</Text>
                        </View>

                        <View style={styles.dashedLine} />

                        {/* Items */}
                        <View style={styles.itemsSection}>
                            {cart.map((item) => (
                                <View key={item.menuId} style={styles.receiptItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemDetail}>
                                            {item.qty} x Rp {item.price.toLocaleString('id-ID')}
                                        </Text>
                                    </View>
                                    <Text style={styles.itemTotal}>
                                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.dashedLine} />

                        {/* Total */}
                        <View style={styles.totalSection}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>
                                    Rp {totalPrice.toLocaleString('id-ID')}
                                </Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <Text style={styles.paymentLabel}>Pembayaran</Text>
                                <View style={[
                                    styles.paymentBadge,
                                    paymentMethod === 'CASH' ? styles.cashBadge : styles.qrisBadge,
                                ]}>
                                    <Text style={[
                                        styles.paymentBadgeText,
                                        paymentMethod === 'CASH' ? styles.cashBadgeText : styles.qrisBadgeText,
                                    ]}>
                                        {paymentMethod === 'CASH' ? '💵 Cash' : '📱 QRIS'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.dashedLine} />

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={styles.thankYou}>Terima Kasih!</Text>
                                <Smile size={20} color="#111827" />
                            </View>
                            <Text style={styles.footerText}>Selamat menikmati hidangan Anda</Text>
                        </View>
                    </ScrollView>

                    {/* Tombol Selesai */}
                    <TouchableOpacity
                        style={styles.doneBtn}
                        activeOpacity={0.8}
                        onPress={onClose}
                    >
                        <Text style={styles.doneBtnText}>Selesai</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    receipt: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        width: '100%',
        maxHeight: '80%',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 16,
    },
    receiptHeader: {
        alignItems: 'center',
        paddingBottom: 16,
    },
    storeName: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
    },
    storeSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    receiptNo: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        marginTop: 8,
    },
    receiptDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    dashedLine: {
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderBottomColor: '#D1D5DB',
        marginVertical: 12,
    },
    itemsSection: {
        paddingVertical: 4,
    },
    receiptItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    itemDetail: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    totalSection: {
        paddingVertical: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#2563EB',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    paymentLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    paymentBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    cashBadge: {
        backgroundColor: '#F0FDF4',
    },
    qrisBadge: {
        backgroundColor: '#EFF6FF',
    },
    paymentBadgeText: {
        fontSize: 13,
        fontWeight: '700',
    },
    cashBadgeText: {
        color: '#16A34A',
    },
    qrisBadgeText: {
        color: '#2563EB',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    thankYou: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    footerText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    doneBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    doneBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});
