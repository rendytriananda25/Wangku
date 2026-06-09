import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert,
    KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useMenuStore } from '../store/useMenuStore';
import { Utensils, Coffee, CakeSlice, X, ImagePlus } from 'lucide-react-native';
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
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePickImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 800,
                height: 800,
                cropping: true,
                compressImageQuality: 0.7, // Compress to save size (~200KB - 500KB)
            });
            setImageUri(image.path);
        } catch (error) {
            console.log('Pick image cancelled or error:', error);
        }
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
            setCategory('Food');
            setPrice('');
            setImageUri(null);
            onClose();
        } catch (error) {
            Alert.alert('Gagal', 'Gagal menambahkan menu. Coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Tambah Menu Baru</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Pilih Gambar */}
                        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage} activeOpacity={0.8}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <ImagePlus size={32} color="#9CA3AF" />
                                    <Text style={styles.imagePlaceholderText}>Tambah Foto Menu</Text>
                                    <Text style={styles.imageSubText}>(Akan dikompres otomatis ~300KB)</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.label}>Nama Menu</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contoh: Ayam Geprek"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.label}>Kategori</Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            {['Makanan', 'Minuman', 'Camilan'].map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.categoryBtn, category === cat && styles.categoryBtnActive]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        {cat === 'Makanan' ? <Utensils size={16} color={category === cat ? '#2563EB' : '#6B7280'} /> :
                                            cat === 'Minuman' ? <Coffee size={16} color={category === cat ? '#2563EB' : '#6B7280'} /> :
                                                <CakeSlice size={16} color={category === cat ? '#2563EB' : '#6B7280'} />}
                                        <Text style={[styles.categoryBtnText, category === cat && styles.categoryBtnTextActive]}>{cat}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Harga (Rp)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contoh: 15000"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.submitBtnText}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Menu'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 20,
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
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        padding: 14,
        fontSize: 15,
        color: '#111827',
        marginBottom: 16,
    },
    imagePicker: {
        width: '100%',
        height: 140,
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePlaceholderText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    imageSubText: {
        marginTop: 4,
        fontSize: 11,
        color: '#9CA3AF',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    categoryRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    categoryBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    categoryBtnActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },
    categoryBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
    },
    categoryBtnTextActive: {
        color: '#2563EB',
    },
    submitBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitBtnDisabled: {
        opacity: 0.6,
    },
    submitBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});
