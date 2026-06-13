import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Switch, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsViewModel } from './useSettingsViewModel';
import { useAuthStore } from '../../store/useAuthStore';
import { Store, MapPin, Phone, Receipt, Printer, Lock, RefreshCw, Trash2, ShieldCheck, ChevronRight, QrCode, ArrowLeft, PersonStanding, User, Globe, Moon, Bell, HelpCircle, FileText, LogOut } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
    const { form, updateForm, handleSave, handlePickQris, initials } = useSettingsViewModel();
    const { signOut } = useAuthStore();

    const handleLogout = () => {
        Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari akun ini?', [
            { text: 'Batal', style: 'cancel' },
            { text: 'Keluar', style: 'destructive', onPress: signOut }
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* TopAppBar */}
            <View style={styles.appBar}>
                <View style={styles.appBarLeft}>
                    <TouchableOpacity style={styles.iconButton}>
                        <ArrowLeft size={24} color="#3c4a42" />
                    </TouchableOpacity>
                    <Text style={styles.appBarTitle}>Pengaturan</Text>
                </View>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Simpan</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* 1. Akun & Profil */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>AKUN & PROFIL</Text>
                    <View style={styles.card}>
                        <View style={styles.profileRow}>
                            <View style={styles.profileLeft}>
                                <View style={styles.avatarCircle}>
                                    <User size={32} color="#006c49" fill="#006c49" />
                                </View>
                                <View>
                                    <Text style={styles.profileName}>Andi Pratama</Text>
                                    <Text style={styles.profileRole}>Owner</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.profileBtn}>
                                <Text style={styles.profileBtnText}>Lihat Profil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 2. Konfigurasi Toko */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>KONFIGURASI TOKO</Text>
                    <View style={styles.card}>
                        {/* Nama Toko */}
                        <View style={[styles.listItem, styles.borderBottom]}>
                            <View style={styles.listLeft}>
                                <Store size={20} color="#006c49" />
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>Nama Toko</Text>
                                    <TextInput 
                                        style={styles.listInput}
                                        value={form.storeName}
                                        onChangeText={text => updateForm('storeName', text)}
                                        placeholder="Wangku Kopi"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </View>
                        
                        {/* Alamat Toko */}
                        <View style={[styles.listItem, styles.borderBottom]}>
                            <View style={styles.listLeft}>
                                <MapPin size={20} color="#006c49" />
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>Alamat Toko</Text>
                                    <TextInput 
                                        style={styles.listInput}
                                        value={form.storeAddress}
                                        onChangeText={text => updateForm('storeAddress', text)}
                                        placeholder="Jl. Sudirman No. 45..."
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </View>

                        {/* Nomor Telepon */}
                        <View style={styles.listItem}>
                            <View style={styles.listLeft}>
                                <Phone size={20} color="#006c49" />
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>Nomor Telepon</Text>
                                    <TextInput 
                                        style={styles.listInput}
                                        value={form.storePhone}
                                        onChangeText={text => updateForm('storePhone', text)}
                                        placeholder="0812xxxxxxxx"
                                        keyboardType="phone-pad"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </View>
                    </View>
                </View>

                {/* 3. Pembayaran & Struk */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>PEMBAYARAN & STRUK</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={[styles.listItem, styles.borderBottom]} onPress={handlePickQris}>
                            <View style={styles.listLeft}>
                                <QrCode size={20} color="#006c49" />
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>Metode Pembayaran (QRIS)</Text>
                                    <Text style={styles.listSubtitle}>
                                        {form.qrisImageUri ? 'QRIS telah diatur' : 'Tunai, QRIS (Ketuk untuk upload)'}
                                    </Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </TouchableOpacity>

                        <View style={[styles.listItem, styles.borderBottom]}>
                            <View style={styles.listLeft}>
                                <Receipt size={20} color="#006c49" />
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>Pesan Penutup Struk</Text>
                                    <TextInput 
                                        style={styles.listInput}
                                        value={form.receiptFooter}
                                        onChangeText={text => updateForm('receiptFooter', text)}
                                        placeholder="Terima kasih..."
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </View>

                        <TouchableOpacity style={styles.listItem}>
                            <View style={styles.listLeft}>
                                <Printer size={20} color="#006c49" />
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>Printer Bluetooth</Text>
                                    <Text style={styles.listSubtitle}>Belum terhubung</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 4. Aplikasi */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>APLIKASI</Text>
                    <View style={styles.card}>
                        <View style={[styles.listItem, styles.borderBottom]}>
                            <View style={styles.listLeft}>
                                <Globe size={20} color="#006c49" />
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>Bahasa</Text>
                                    <Text style={styles.listSubtitle}>Bahasa Indonesia</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </View>

                        <View style={[styles.listItem, styles.borderBottom]}>
                            <View style={styles.listLeft}>
                                <Moon size={20} color="#006c49" />
                                <Text style={styles.listTitle}>Mode Gelap</Text>
                            </View>
                            <Switch 
                                value={false} 
                                onValueChange={() => {}} 
                                trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                                thumbColor="#ffffff"
                            />
                        </View>

                        <View style={styles.listItem}>
                            <View style={styles.listLeft}>
                                <Bell size={20} color="#006c49" />
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>Notifikasi</Text>
                                    <Text style={styles.listSubtitle}>Suara, Popup</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </View>
                    </View>
                </View>

                {/* 5. Lainnya */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>LAINNYA</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={[styles.listItem, styles.borderBottom]}>
                            <View style={styles.listLeft}>
                                <HelpCircle size={20} color="#3c4a42" />
                                <Text style={styles.listTitle}>Pusat Bantuan</Text>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.listItem, styles.borderBottom]}>
                            <View style={styles.listLeft}>
                                <FileText size={20} color="#3c4a42" />
                                <Text style={styles.listTitle}>Syarat & Ketentuan</Text>
                            </View>
                            <ChevronRight size={20} color="#6c7a71" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.listItem} onPress={handleLogout}>
                            <View style={styles.listLeft}>
                                <LogOut size={20} color="#ba1a1a" />
                                <Text style={[styles.listTitle, { color: '#ba1a1a', fontWeight: 'bold' }]}>Keluar</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerInfo}>
                        <Text style={styles.footerText}>Versi 2.4.1 (Build 8942)</Text>
                        <Text style={styles.footerText}>© 2024 Wangku POS</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    appBar: {
        backgroundColor: '#f8f9fa', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e1e3e4', zIndex: 50
    },
    appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    appBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#006c49' },
    iconButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 22 },
    saveBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#10b981', borderRadius: 8 },
    saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
    
    scrollContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
    
    section: { marginBottom: 24 },
    sectionHeader: { fontSize: 14, fontWeight: '600', color: '#3c4a42', marginBottom: 12, paddingHorizontal: 4, letterSpacing: 0.5 },
    card: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e1e3e4', overflow: 'hidden' },
    
    profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    profileLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(16, 185, 129, 0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
    profileName: { fontSize: 18, fontWeight: '600', color: '#191c1d' },
    profileRole: { fontSize: 14, color: '#3c4a42', marginTop: 2 },
    profileBtn: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    profileBtnText: { color: '#006c49', fontSize: 14, fontWeight: '600' },

    listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: 'rgba(187, 202, 191, 0.5)' },
    listLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
    listContent: { flex: 1 },
    listTitle: { fontSize: 14, color: '#191c1d', fontWeight: '500' },
    listSubtitle: { fontSize: 12, color: '#3c4a42', marginTop: 2 },
    listInput: { fontSize: 12, color: '#3c4a42', marginTop: 0, padding: 0, margin: 0, height: 18 },
    
    footerInfo: { alignItems: 'center', marginTop: 24, marginBottom: 40 },
    footerText: { fontSize: 12, color: '#6c7a71', marginBottom: 4 }
});
