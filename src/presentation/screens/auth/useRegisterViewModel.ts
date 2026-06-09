import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../core/config/supabase';

interface UseRegisterViewModelProps {
    onSuccess: () => void;
}

export function useRegisterViewModel({ onSuccess }: UseRegisterViewModelProps) {
    const [storeName, setStoreName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !storeName) {
            Alert.alert('Error', 'Semua kolom harus diisi!');
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    store_name: storeName
                }
            }
        });

        if (error) {
            Alert.alert('Gagal Mendaftar', error.message);
        } else {
            // Karena konfirmasi email dimatikan, pengguna biasanya akan langsung otomatis login
            // Alert ini mungkin tertimpa oleh perpindahan layar otomatis, tapi jika tidak, arahkan ke login
            Alert.alert('Pendaftaran Berhasil!', 'Akun Anda telah dibuat. Silakan login (atau Anda akan masuk otomatis).');
            onSuccess();
        }
        setIsLoading(false);
    };

    return {
        storeName,
        setStoreName,
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        handleRegister
    };
}
