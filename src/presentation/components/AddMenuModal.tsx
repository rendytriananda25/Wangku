import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert,
    KeyboardAvoidingView, Platform, Image, ScrollView, Switch
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMenuStore } from '../store/useMenuStore';
import { X, ImagePlus, ArrowLeft, ChevronDown, Save } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';

interface AddMenuModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddMenuModal({ visible, onClose }: AddMenuModalProps) {
    const { addMenu } = useMenuStore();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Makanan');
    const [price, setPrice] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [description, setDescription] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const insets = useSafeAreaInsets();

    const handlePickImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 800,
                height: 800,
                cropping: true,
                compressImageQuality: 0.7,
            });
            setImageUri(image.path);
        } catch (error) {
            console.log('Pick image cancelled or error:', error);
        }
    };

    const handleSelectCategory = () => {
        Alert.alert('Pilih Kategori', '', [
            { text: 'Makanan', onPress: () => setCategory('Makanan') },
            { text: 'Minuman', onPress: () => setCategory('Minuman') },
            { text: 'Snack', onPress: () => setCategory('Snack') },
            { text: 'Batal', style: 'cancel' }
        ]);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert('Oops', 'Nama menu harus diisi!');
            return;
        }
        if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
            Alert.alert('Oops', 'Harga harus berupa angka yang valid!');
            return;
        }

        setIsSubmitting(true);
        try {
            await addMenu(name.trim(), category, Number(price), imageUri || undefined);
            Alert.alert('Berhasil ✅', `Menu "${name}" berhasil ditambahkan!`);
            setName('');
            setCategory('Makanan');
            setPrice('');
            setCostPrice('');
            setDescription('');
            setImageUri(null);
            onClose();
        } catch (error) {
            Alert.alert('Gagal', 'Gagal menambahkan menu. Coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    {/* TopAppBar */}
                    <View style={styles.appBar}>
                        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                            <ArrowLeft size={24} color="#3c4a42" />
                        </TouchableOpacity>
                        <Text style={styles.appBarTitle}>Tambah Menu Baru</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Image Upload */}
                        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage} activeOpacity={0.8}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <View style={styles.uploadIconCircle}>
                                        <ImagePlus size={24} color="#3c4a42" />
                                    </View>
                                    <Text style={styles.uploadText}>Unggah Foto Produk</Text>
                                    <Text style={styles.uploadSubText}>PNG, JPG hingga 5MB</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Form Card */}
                        <View style={styles.card}>
                            {/* Nama Menu */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nama Menu</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contoh: Kopi Kenangan"
                                    placeholderTextColor="#6c7a71"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            {/* Kategori */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Kategori</Text>
                                <TouchableOpacity style={styles.selectBtn} onPress={handleSelectCategory}>
                                    <Text style={[styles.selectBtnText, !category && { color: '#6c7a71' }]}>
                                        {category || 'Pilih Kategori'}
                                    </Text>
                                    <ChevronDown size={20} color="#3c4a42" />
                                </TouchableOpacity>
                            </View>

                            {/* Pricing Grid */}
                            <View style={styles.gridRow}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Harga Jual</Text>
                                    <View style={styles.inputWithPrefix}>
                                        <Text style={styles.prefixText}>Rp</Text>
                                        <TextInput
                                            style={styles.inputPrefixField}
                                            placeholder="0"
                                            placeholderTextColor="#6c7a71"
                                            keyboardType="numeric"
                                            value={price}
                                            onChangeText={setPrice}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Harga Modal</Text>
                                    <View style={styles.inputWithPrefix}>
                                        <Text style={styles.prefixText}>Rp</Text>
                                        <TextInput
                                            style={styles.inputPrefixField}
                                            placeholder="0"
                                            placeholderTextColor="#6c7a71"
                                            keyboardType="numeric"
                                            value={costPrice}
                                            onChangeText={setCostPrice}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Deskripsi */}
                            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
                                <Text style={styles.label}>Deskripsi</Text>
                                <TextInput
                                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                    placeholder="Tambahkan deskripsi singkat"
                                    placeholderTextColor="#6c7a71"
                                    multiline
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>
                        </View>

                        {/* Toggle Tersedia */}
                        <View style={styles.toggleCard}>
                            <View style={styles.toggleTextContainer}>
                                <Text style={styles.toggleTitle}>Tersedia di Kasir</Text>
                                <Text style={styles.toggleSub}>Tampilkan menu ini di layar utama POS</Text>
                            </View>
                            <Switch 
                                value={isAvailable} 
                                onValueChange={setIsAvailable}
                                trackColor={{ false: '#e1e3e4', true: '#10b981' }}
                                thumbColor="#ffffff"
                            />
                        </View>
                    </ScrollView>

                    {/* Bottom Action Bar */}
                    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom + 12, 16) }]}>
                        <TouchableOpacity 
                            style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
                            activeOpacity={0.8}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Save size={18} color="#ffffff" style={{ marginRight: 8 }} />
                            <Text style={styles.submitBtnText}>
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Menu'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    safeArea: { flex: 1 },
    appBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, height: 56, backgroundColor: '#f8f9fa',
        borderBottomWidth: 1, borderBottomColor: '#e1e3e4'
    },
    backBtn: { padding: 8, marginLeft: -8, borderRadius: 20 },
    appBarTitle: { fontSize: 18, fontWeight: '600', color: '#191c1d' },
    
    scrollContent: { padding: 16, paddingBottom: 100 },

    uploadBox: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#bbcabf',
        borderStyle: 'dashed',
        borderRadius: 16,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        overflow: 'hidden'
    },
    uploadPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    uploadIconCircle: {
        width: 56, height: 56, borderRadius: 28, backgroundColor: '#edeeef',
        alignItems: 'center', justifyContent: 'center', marginBottom: 12
    },
    uploadText: { fontSize: 14, fontWeight: '500', color: '#191c1d' },
    uploadSubText: { fontSize: 12, color: '#3c4a42', marginTop: 4 },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbcabf',
        marginBottom: 20,
    },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 12, color: '#3c4a42', marginBottom: 6, paddingHorizontal: 4 },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#bbcabf',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#191c1d',
    },
    selectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#bbcabf',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    selectBtnText: { fontSize: 14, color: '#191c1d' },
    
    gridRow: { flexDirection: 'row', gap: 16 },
    inputWithPrefix: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#bbcabf',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    prefixText: { fontSize: 14, color: '#3c4a42', marginRight: 8 },
    inputPrefixField: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#191c1d',
    },

    toggleCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bbcabf',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    toggleTextContainer: { flex: 1, paddingRight: 16 },
    toggleTitle: { fontSize: 14, fontWeight: '600', color: '#191c1d' },
    toggleSub: { fontSize: 12, color: '#3c4a42', marginTop: 2 },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#bbcabf',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    submitBtn: {
        backgroundColor: '#10b981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
    },
    submitBtnText: { fontSize: 14, fontWeight: '600', color: '#ffffff' }
});
