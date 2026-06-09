import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Switch, Dimensions, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsViewModel } from './useSettingsViewModel';
import { useAuthStore } from '../../store/useAuthStore';
import { Store, MapPin, Phone, FileText, Printer, Percent, Lock, RefreshCw, Trash2, ShieldCheck, ChevronRight, QrCode } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
    const { form, updateForm, handleSave, handlePickQris, initials } = useSettingsViewModel();
    const { signOut } = useAuthStore();
    const insets = useSafeAreaInsets();

    const handleLogout = () => {
        Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari akun ini?', [
            { text: 'Batal', style: 'cancel' },
            { text: 'Keluar', style: 'destructive', onPress: signOut }
        ]);
    };

    return (
        <View style={styles.container}>
            {/* VIBRANT HEADER BACKGROUND */}
            <View style={[styles.headerBackground, { paddingTop: insets.top + 20 }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Pengaturan</Text>
                    </View>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                </View>
            </View>

            {/* CONTENT */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* PROFIL TOKO */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <Store size={20} color="#2563EB" />
                        <Text style={styles.cardTitle}>Profil Toko</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nama Toko</Text>
                        <TextInput
                            style={styles.input}
                            value={form.storeName}
                            onChangeText={(text) => updateForm('storeName', text)}
                            placeholder="Wangku POS"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nomor Telepon</Text>
                        <TextInput
                            style={styles.input}
                            value={form.storePhone}
                            onChangeText={(text) => updateForm('storePhone', text)}
                            placeholder="0812xxxxxx"
                            keyboardType="phone-pad"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Alamat Lengkap</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            value={form.storeAddress}
                            onChangeText={(text) => updateForm('storeAddress', text)}
                            placeholder="Alamat jalan..."
                            multiline
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* STRUK & PRINTER */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <Printer size={20} color="#8B5CF6" />
                        <Text style={styles.cardTitle}>Perangkat & Struk</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Pesan Penutup Struk</Text>
                        <TextInput
                            style={styles.input}
                            value={form.receiptFooter}
                            onChangeText={(text) => updateForm('receiptFooter', text)}
                            placeholder="Terima kasih..."
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <TouchableOpacity style={styles.printerBtn} activeOpacity={0.8}>
                        <View style={styles.printerBtnLeft}>
                            <View style={styles.printerIconCircle}>
                                <Printer size={20} color="#FFFFFF" />
                            </View>
                            <View>
                                <Text style={styles.printerTitle}>Printer Bluetooth</Text>
                                <Text style={styles.printerSubtitle}>Klik untuk mencari printer</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#8B5CF6" />
                    </TouchableOpacity>
                </View>

                {/* PAJAK & BIAYA */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <Percent size={20} color="#F59E0B" />
                        <Text style={styles.cardTitle}>Pajak Restoran</Text>
                    </View>

                    <View style={styles.switchRow}>
                        <View>
                            <Text style={styles.switchTitle}>Aktifkan PB1 / PPN</Text>
                            <Text style={styles.switchSubtitle}>Tambahkan biaya ke pelanggan</Text>
                        </View>
                        <Switch
                            value={form.isTaxEnabled}
                            onValueChange={(val) => updateForm('isTaxEnabled', val)}
                            trackColor={{ false: '#E5E7EB', true: '#FDE68A' }}
                            thumbColor={form.isTaxEnabled ? '#F59E0B' : '#FFFFFF'}
                        />
                    </View>

                    {form.isTaxEnabled && (
                        <View style={styles.taxInputRow}>
                            <Text style={styles.taxInputLabel}>Tarif Pajak</Text>
                            <View style={styles.taxInputBox}>
                                <TextInput
                                    style={styles.taxInput}
                                    value={form.taxPercentage}
                                    onChangeText={(text) => updateForm('taxPercentage', text)}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.taxPercentIcon}>%</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* PEMBAYARAN & QRIS */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <QrCode size={20} color="#2563EB" />
                        <Text style={styles.cardTitle}>Pembayaran (QRIS)</Text>
                    </View>
                    
                    <Text style={styles.switchSubtitle}>Unggah foto QRIS Static dari Bank Anda (Misal: Livin' Merchant / BCA) untuk ditampilkan ke pelanggan saat mereka memilih metode pembayaran QRIS.</Text>
                    
                    <TouchableOpacity style={styles.qrisUploadBox} onPress={handlePickQris} activeOpacity={0.8}>
                        {form.qrisImageUri ? (
                            <Image source={{ uri: form.qrisImageUri }} style={styles.qrisImage} />
                        ) : (
                            <View style={styles.qrisPlaceholder}>
                                <QrCode size={32} color="#9CA3AF" />
                                <Text style={styles.qrisPlaceholderText}>Pilih Gambar QRIS</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* SISTEM & KEAMANAN */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <ShieldCheck size={20} color="#10B981" />
                        <Text style={styles.cardTitle}>Keamanan & Data</Text>
                    </View>

                    <TouchableOpacity style={styles.systemBtn} onPress={() => Alert.alert('Info', 'Fitur PIN akan segera hadir')} activeOpacity={0.7}>
                        <Lock size={18} color="#4B5563" />
                        <Text style={styles.systemBtnText}>Atur PIN Owner</Text>
                        <ChevronRight size={18} color="#D1D5DB" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.systemBtn} onPress={() => Alert.alert('Sync', 'Sistem disinkronkan!')} activeOpacity={0.7}>
                        <RefreshCw size={18} color="#2563EB" />
                        <Text style={[styles.systemBtnText, { color: '#2563EB' }]}>Force Sync Database</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.systemBtn} activeOpacity={0.8}>
                        <Trash2 size={20} color="#EF4444" />
                        <Text style={[styles.systemBtnText, { color: '#EF4444' }]}>Hapus Seluruh Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.systemBtn, { borderBottomWidth: 0 }]} activeOpacity={0.8} onPress={handleLogout}>
                        <Lock size={20} color="#EF4444" />
                        <Text style={[styles.systemBtnText, { color: '#EF4444' }]}>Keluar dari Akun (Logout)</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* FLOATING FOOTER */}
            <View style={styles.floatingFooter}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.9}>
                    <Text style={styles.saveBtnText}>Simpan Pengaturan</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },

    // HEADER (VIBRANT)
    headerBackground: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 20,
        paddingBottom: 60,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
    headerSubtitle: { fontSize: 14, color: '#DBEAFE', marginTop: 4, fontWeight: '500' },
    avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
    avatarText: { fontSize: 18, fontWeight: '900', color: '#2563EB' },

    scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 160 },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
    },
    cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: '#111827', textTransform: 'uppercase', letterSpacing: 0.5 },

    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginBottom: 8 },
    input: { backgroundColor: '#F1F5F9', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontWeight: '600', color: '#111827', borderWidth: 1, borderColor: '#E2E8F0' },

    printerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F3FF', borderRadius: 20, padding: 12, borderWidth: 1, borderColor: '#DDD6FE', marginTop: 8 },
    printerBtnLeft: { flexDirection: 'row', alignItems: 'center' },
    printerIconCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    printerTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
    printerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '500' },

    switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    switchTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
    switchSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },

    taxInputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, backgroundColor: '#FFFBEB', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#FDE68A' },
    taxInputLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
    taxInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#FCD34D' },
    taxInput: { fontSize: 16, fontWeight: '800', color: '#111827', width: 40, textAlign: 'center', padding: 0 },
    taxPercentIcon: { fontSize: 16, fontWeight: '800', color: '#111827', marginLeft: 4 },

    qrisUploadBox: { width: '100%', height: 200, backgroundColor: '#F1F5F9', borderRadius: 16, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', marginTop: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    qrisImage: { width: '100%', height: '100%', resizeMode: 'contain', backgroundColor: '#FFFFFF' },
    qrisPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    qrisPlaceholderText: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginTop: 8 },

    systemBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12 },
    systemBtnText: { fontSize: 15, fontWeight: '700', color: '#4B5563' },

    floatingFooter: { position: 'absolute', bottom: 100, left: 20, right: 20 },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', paddingVertical: 18, borderRadius: 24, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
    saveBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 }
});
