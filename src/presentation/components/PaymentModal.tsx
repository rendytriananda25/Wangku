import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Image, Alert
} from 'react-native';
import { CartItem } from '../store/useWangkuAdminStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { X, Banknote, QrCode, ArrowLeft, CheckCircle2 } from 'lucide-react-native';

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
    const [showQrisView, setShowQrisView] = useState(false);
    const { qrisImageUri } = useSettingsStore();

    // Reset view if modal closed
    useEffect(() => {
        if (!visible) setShowQrisView(false);
    }, [visible]);

    const handlePressQris = () => {
        if (!qrisImageUri) {
            Alert.alert('QRIS Belum Diatur', 'Silakan unggah foto QRIS Anda di menu Setelan terlebih dahulu.');
            return;
        }
        setShowQrisView(true);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        {showQrisView ? (
                            <TouchableOpacity onPress={() => setShowQrisView(false)} style={styles.backBtn}>
                                <ArrowLeft size={20} color="#6B7280" />
                            </TouchableOpacity>
                        ) : <View style={{ width: 36 }} />}
                        
                        <Text style={styles.headerTitle}>{showQrisView ? 'Scan QRIS' : 'Pembayaran'}</Text>
                        
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {showQrisView ? (
                        <View style={styles.qrisContainer}>
                            <Text style={styles.qrisInstruction}>Silakan minta pelanggan untuk scan kode QR di bawah ini dengan aplikasi M-Banking atau e-Wallet mereka.</Text>
                            
                            <View style={styles.qrisImageBox}>
                                {qrisImageUri && <Image source={{ uri: qrisImageUri }} style={styles.qrisImage} />}
                            </View>

                            <Text style={styles.qrisAmountLabel}>Total Tagihan</Text>
                            <Text style={styles.qrisAmount}>Rp {totalPrice.toLocaleString('id-ID')}</Text>

                            <TouchableOpacity style={styles.confirmPaidBtn} activeOpacity={0.8} onPress={onSelectQRIS}>
                                <CheckCircle2 size={24} color="#FFFFFF" />
                                <Text style={styles.confirmPaidBtnText}>Konfirmasi Lunas</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
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
                                    onPress={handlePressQris}
                                >
                                    <QrCode size={32} color="#2563EB" />
                                    <Text style={styles.qrisBtnText}>QRIS</Text>
                                    <Text style={styles.paymentDesc}>Scan QR Code</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
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
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrisContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    qrisInstruction: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    qrisImageBox: {
        width: 280,
        height: 280,
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        padding: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    qrisImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    qrisAmountLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 4,
    },
    qrisAmount: {
        fontSize: 32,
        fontWeight: '900',
        color: '#2563EB',
        marginBottom: 32,
    },
    confirmPaidBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#16A34A',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 12,
        shadowColor: '#16A34A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    confirmPaidBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    }
});
