import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform, ActivityIndicator, ImageBackground, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoginViewModel } from './useLoginViewModel';
import { Mail, Lock, Store, ArrowRight } from 'lucide-react-native';
import Svg, { Defs, Rect, LinearGradient, Stop } from 'react-native-svg';

interface LoginScreenProps {
    onNavigateRegister: () => void;
}

export default function LoginScreen({ onNavigateRegister }: LoginScreenProps) {
    const { email, setEmail, password, setPassword, isLoading, handleLogin } = useLoginViewModel();
    const insets = useSafeAreaInsets();

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Entry Animation
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true })
        ]).start();
    }, []);

    return (
        <ImageBackground 
            source={require('../../../assets/baground/bg1.png')} 
            style={styles.container}
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Gradient Overlay */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Svg height="100%" width="100%">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#000000" stopOpacity="0.15" />
                            <Stop offset="0.5" stopColor="#000000" stopOpacity="0.3" />
                            <Stop offset="0.8" stopColor="#000000" stopOpacity="0.85" />
                            <Stop offset="1" stopColor="#000000" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
                </Svg>
            </View>

            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={{ flex: 1, paddingTop: insets.top + 30, paddingHorizontal: 8 }}>
                        <Text style={styles.title}>Login Wangku</Text>
                        <Text style={styles.headerSubtitle}>Kelola transaksi warung UMKM dalam satu genggaman</Text>
                    </View>

                    <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email Anda"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Kata Sandi"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.loginBtn} 
                            onPress={handleLogin} 
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.loginBtnText}>Masuk Ke Kasir</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>Belum punya akun? </Text>
                            <TouchableOpacity onPress={onNavigateRegister}>
                                <Text style={styles.linkText}>Daftar Baru</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={{ marginTop: 16 }}>
                            <Text style={styles.linkText}>Lupa kata sandi?</Text>
                        </TouchableOpacity>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
    scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 40 },
    
    title: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 22, fontWeight: '500' },

    formCard: {
        padding: 24,
        paddingTop: 0,
    },

    inputGroup: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    input: {
        paddingVertical: 16,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500'
    },

    loginBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563EB', // Blue to match app theme
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 8,
        marginBottom: 24
    },
    loginBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

    footerRow: { flexDirection: 'row', alignItems: 'center' },
    footerText: { fontSize: 14, color: '#A1A1AA' },
    linkText: { fontSize: 14, fontWeight: '700', color: '#2563EB' }
});
