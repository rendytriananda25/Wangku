import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartItem } from '../store/useWangkuAdminStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { X, ArrowLeft, MoreVertical, Banknote, QrCode as QrCodeIcon, ArrowRight, Delete } from 'lucide-react-native';

interface PaymentModalProps {
    visible: boolean;
    cart: CartItem[];
    totalPrice: number;
    onSelectCash: () => void;
    onSelectQRIS: () => void;
    onClose: () => void;
}

export default function PaymentModal({ visible, cart, totalPrice, onSelectCash, onSelectQRIS, onClose }: PaymentModalProps) {
    const [method, setMethod] = useState<'cash' | 'qris'>('cash');
    const [cashReceived, setCashReceived] = useState<string>('');
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const { qrisImageUri } = useSettingsStore();

    useEffect(() => {
        if (visible) {
            setMethod('cash');
            const initialVal = totalPrice.toString();
            setCashReceived(initialVal);
            const formattedLen = parseInt(initialVal, 10).toLocaleString('id-ID').length;
            setSelection({ start: formattedLen, end: formattedLen });
        }
    }, [visible, totalPrice]);

    const formattedCash = cashReceived ? parseInt(cashReceived, 10).toLocaleString('id-ID') : '';

    const handleNumpad = (val: string) => {
        const currentFormatted = formattedCash;
        let newFormatted = '';
        let newSelectionStart = selection.start;

        if (val === 'backspace') {
            if (currentFormatted.length === 0) return;
            if (selection.start === 0 && selection.end === 0) return;

            if (selection.start !== selection.end) {
                newFormatted = currentFormatted.substring(0, selection.start) + currentFormatted.substring(selection.end);
            } else {
                let deletePos = selection.start - 1;
                if (currentFormatted.charAt(deletePos) === '.') {
                    deletePos--;
                    newSelectionStart--;
                }
                newFormatted = currentFormatted.substring(0, deletePos) + currentFormatted.substring(selection.start);
                newSelectionStart = deletePos;
            }
        } else if (val === '00') {
             newFormatted = currentFormatted.substring(0, selection.start) + '00' + currentFormatted.substring(selection.end);
             newSelectionStart += 2;
        } else {
             newFormatted = currentFormatted.substring(0, selection.start) + val + currentFormatted.substring(selection.end);
             newSelectionStart += 1;
        }

        const rawResult = newFormatted.replace(/\D/g, '');
        const newCashReceived = rawResult === '' ? '' : parseInt(rawResult, 10).toString();
        const nextFormatted = newCashReceived ? parseInt(newCashReceived, 10).toLocaleString('id-ID') : '';

        const dotsBeforeInNewFormatted = (newFormatted.substring(0, newSelectionStart).match(/\./g) || []).length;
        const rawCharsBeforeCursor = newSelectionStart - dotsBeforeInNewFormatted;
        
        let finalSelection = 0;
        let rawCount = 0;
        for (let i = 0; i < nextFormatted.length; i++) {
            if (rawCount === rawCharsBeforeCursor) {
                finalSelection = i;
                break;
            }
            if (nextFormatted[i] !== '.') {
                rawCount++;
            }
        }
        if (rawCount === rawCharsBeforeCursor && finalSelection === 0) {
            finalSelection = nextFormatted.length;
        }

        setCashReceived(newCashReceived);
        setSelection({ start: finalSelection, end: finalSelection });
    };

    const handleQuickAmount = (amount: number) => {
        setCashReceived(amount.toString());
        const formattedLen = amount.toLocaleString('id-ID').length;
        setSelection({ start: formattedLen, end: formattedLen });
    };

    const receivedAmount = parseInt(cashReceived) || 0;
    const kembalian = Math.max(0, receivedAmount - totalPrice);
    
    const handlePay = () => {
        if (method === 'cash') {
            if (receivedAmount < totalPrice) {
                Alert.alert('Uang Kurang', 'Nominal yang diterima kurang dari total tagihan.');
                return;
            }
            onSelectCash();
        } else {
            onSelectQRIS();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                        <ArrowLeft size={24} color="#3c4a42" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pembayaran</Text>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MoreVertical size={24} color="#3c4a42" />
                    </TouchableOpacity>
                </View>

                <View style={styles.mainContent}>
                    {/* Summary Card */}
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Tagihan</Text>
                            <Text style={styles.summaryValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
                        </View>

                        {/* Payment Methods */}
                        <View style={styles.methodsRow}>
                            <TouchableOpacity 
                                style={[styles.methodBtn, method === 'cash' && styles.methodBtnActive]}
                                onPress={() => setMethod('cash')}
                            >
                                <View style={[styles.methodIconBox, method === 'cash' ? { backgroundColor: '#ffedd5' } : { backgroundColor: '#f3f4f6' }]}>
                                    <Banknote size={28} color={method === 'cash' ? '#ea580c' : '#9ca3af'} />
                                </View>
                                <Text style={[styles.methodText, method === 'cash' ? { color: '#191c1d' } : { color: '#6c7a71' }]}>Tunai</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.methodBtn, method === 'qris' && styles.methodBtnActive]}
                                onPress={() => setMethod('qris')}
                            >
                                <View style={[styles.methodIconBox, method === 'qris' ? { backgroundColor: '#dbeafe' } : { backgroundColor: '#f3f4f6' }]}>
                                    <QrCodeIcon size={28} color={method === 'qris' ? '#2563eb' : '#9ca3af'} />
                                </View>
                                <Text style={[styles.methodText, method === 'qris' ? { color: '#191c1d' } : { color: '#6c7a71' }]}>QRIS</Text>
                            </TouchableOpacity>
                        </View>

                        {method === 'cash' ? (
                            <View style={styles.cashSection}>
                                <Text style={styles.inputLabel}>Nominal Diterima</Text>
                                <View style={styles.inputBox}>
                                    <Text style={styles.inputPrefix}>Rp</Text>
                                    <TextInput 
                                        style={styles.inputValue}
                                        value={formattedCash}
                                        showSoftInputOnFocus={false}
                                        selection={selection}
                                        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                                        autoFocus
                                    />
                                </View>

                                <View style={styles.quickAmounts}>
                                    <TouchableOpacity style={[styles.quickBtn, receivedAmount === totalPrice && styles.quickBtnActive]} onPress={() => handleQuickAmount(totalPrice)}>
                                        <Text style={[styles.quickBtnText, receivedAmount === totalPrice && styles.quickBtnTextActive]}>Uang Pas</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.quickBtn, receivedAmount === 50000 && styles.quickBtnActive]} onPress={() => handleQuickAmount(50000)}>
                                        <Text style={[styles.quickBtnText, receivedAmount === 50000 && styles.quickBtnTextActive]}>50.000</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.quickBtn, receivedAmount === 100000 && styles.quickBtnActive]} onPress={() => handleQuickAmount(100000)}>
                                        <Text style={[styles.quickBtnText, receivedAmount === 100000 && styles.quickBtnTextActive]}>100.000</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.numpad}>
                                    {['1','2','3','4','5','6','7','8','9','00','0','backspace'].map((key) => (
                                        <TouchableOpacity 
                                            key={key} 
                                            style={styles.numpadBtn}
                                            onPress={() => handleNumpad(key)}
                                        >
                                            {key === 'backspace' ? (
                                                <Delete size={24} color="#3c4a42" />
                                            ) : (
                                                <Text style={styles.numpadText}>{key}</Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <View style={styles.qrisSection}>
                                <Text style={styles.qrisInstruction}>Silakan minta pelanggan untuk scan kode QR di bawah ini dengan aplikasi M-Banking atau e-Wallet mereka.</Text>
                                <View style={styles.qrisImageBox}>
                                    {qrisImageUri ? (
                                        <Image source={{ uri: qrisImageUri }} style={styles.qrisImage} />
                                    ) : (
                                        <Text style={{color:'#6c7a71'}}>QRIS belum diatur di Pengaturan</Text>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>

                {/* Bottom Action Area */}
                <View style={styles.bottomArea}>
                        {method === 'cash' ? (
                            <View style={styles.changeRow}>
                                <Text style={styles.changeLabel}>Kembalian</Text>
                                <Text style={styles.changeValue}>Rp {kembalian.toLocaleString('id-ID')}</Text>
                            </View>
                        ) : null}
                        
                        <TouchableOpacity 
                            style={[styles.payBtn, (method === 'cash' && receivedAmount < totalPrice) && { opacity: 0.5 }]} 
                            activeOpacity={0.8}
                            onPress={handlePay}
                            disabled={method === 'cash' && receivedAmount < totalPrice}
                        >
                            <Text style={styles.payBtnText}>Bayar Sekarang</Text>
                            <ArrowRight size={20} color="#ffffff" />
                        </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 8,
        backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#bbcabf'
    },
    iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#006c49' },
    
    mainContent: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
    
    summaryCard: {
        backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 16,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#bbcabf', marginBottom: 16,
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width:0, height:1 }
    },
    summaryLabel: { fontSize: 12, color: '#3c4a42', marginBottom: 4 },
    summaryValue: { fontSize: 28, fontWeight: 'bold', color: '#006c49', letterSpacing: -0.5 },
    
    methodsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    methodBtn: {
        flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#bbcabf',
        borderRadius: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center',
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width:0, height:1 }
    },
    methodBtnActive: { borderWidth: 2, borderColor: '#006c49' },
    methodIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    methodText: { fontSize: 13, fontWeight: '600' },
    
    cashSection: { flex: 1, gap: 12 },
    inputLabel: { fontSize: 12, color: '#3c4a42', marginLeft: 4, marginBottom: -4 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff',
        borderWidth: 1, borderColor: '#bbcabf', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    },
    inputPrefix: { fontSize: 16, fontWeight: '600', color: '#3c4a42' },
    inputValue: { flex: 1, fontSize: 16, fontWeight: '600', color: '#191c1d', textAlign: 'right', padding: 0 },
    
    quickAmounts: { flexDirection: 'row', gap: 8 },
    quickBtn: {
        flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#bbcabf',
        borderRadius: 8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center'
    },
    quickBtnActive: { backgroundColor: '#97f5cc', borderColor: '#97f5cc' },
    quickBtnText: { fontSize: 13, fontWeight: '600', color: '#3c4a42' },
    quickBtnTextActive: { color: '#007353' },
    
    numpad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 4 },
    numpadBtn: {
        width: '32%', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#bbcabf',
        borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
        marginBottom: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width:0, height:1 }
    },
    numpadText: { fontSize: 18, fontWeight: '600', color: '#191c1d' },
    
    qrisSection: { alignItems: 'center', flex: 1, paddingTop: 16 },
    qrisInstruction: { fontSize: 13, color: '#3c4a42', textAlign: 'center', marginBottom: 24, paddingHorizontal: 16 },
    qrisImageBox: {
        width: 220, height: 220, backgroundColor: '#ffffff', borderRadius: 24,
        borderWidth: 1, borderColor: '#bbcabf', alignItems: 'center', justifyContent: 'center', padding: 16,
    },
    qrisImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    
    bottomArea: {
        backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#bbcabf',
        paddingHorizontal: 16, paddingVertical: 12, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width:0, height:-2 }
    },
    changeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 8 },
    changeLabel: { fontSize: 14, color: '#3c4a42' },
    changeValue: { fontSize: 18, fontWeight: '600', color: '#191c1d' },
    payBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#006c49', paddingVertical: 14, borderRadius: 16, gap: 8
    },
    payBtnText: { fontSize: 16, fontWeight: '600', color: '#ffffff' }
});
