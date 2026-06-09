import { useState } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useSettingsStore } from '../../store/useSettingsStore';

export function useSettingsViewModel() {
    const { 
        storeName, storeAddress, storePhone, receiptFooter, logoUrl, 
        isTaxEnabled, taxPercentage, securityPin, qrisImageUri, updateSettings 
    } = useSettingsStore();

    const [form, setForm] = useState({
        storeName,
        storeAddress,
        storePhone,
        receiptFooter,
        logoUrl,
        isTaxEnabled,
        taxPercentage: taxPercentage.toString(),
        securityPin,
        qrisImageUri,
    });

    const updateForm = (key: keyof typeof form, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handlePickQris = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 800,
                height: 800,
                cropping: true,
                compressImageQuality: 0.8,
            });
            updateForm('qrisImageUri', image.path);
        } catch (error) {
            console.log('Pick image cancelled or error:', error);
        }
    };

    const handleSave = () => {
        updateSettings({
            ...form,
            taxPercentage: parseFloat(form.taxPercentage) || 0
        });
        Alert.alert('Tersimpan', 'Pengaturan toko berhasil diperbarui!');
    };

    const initials = form.storeName ? form.storeName.substring(0, 2).toUpperCase() : 'W';

    return {
        form,
        updateForm,
        handleSave,
        handlePickQris,
        initials
    };
}
