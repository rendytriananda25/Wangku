import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../core/config/supabase';

export function useLoginViewModel() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email dan Password harus diisi!');
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Login Gagal', error.message);
        }
        
        setIsLoading(false);
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        handleLogin
    };
}
