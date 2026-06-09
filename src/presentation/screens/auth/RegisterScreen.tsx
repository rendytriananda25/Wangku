import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform, ActivityIndicator, ImageBackground, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRegisterViewModel } from './useRegisterViewModel';
import { Mail, Lock, User, Store, ArrowRight, ArrowLeft } from 'lucide-react-native';
import Svg, { Defs, Rect, LinearGradient, Stop } from 'react-native-svg';

interface RegisterScreenProps {
    onNavigateLogin: () => void;
}

export default function RegisterScreen({ onNavigateLogin }: RegisterScreenProps) {
    const { 
        storeName, setStoreName, 
        email, setEmail, 
        password, setPassword, 
        isLoading, handleRegister 
    } = useRegisterViewModel({ onSuccess: onNavigateLogin });
    
    const insets = useSafeAreaInsets();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
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

            {/* Scrollable Input Fields and Header */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Compact Single-Row Header */}
                    <View style={[styles.headerRow, { paddingTop: insets.top + 20 }]}>
                        <TouchableOpacity style={styles.backBtn} onPress={onNavigateLogin}>
                            <ArrowLeft size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Daftar Wangku</Text>
                    </View>

                    {/* This spacer shrinks when keyboard opens, pushing inputs up naturally without overlapping */}
                    <View style={{ flex: 1 }} />

                    <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nama Warung / Toko"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                value={storeName}
                                onChangeText={setStoreName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email Aktif"
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
                                placeholder="Buat Kata Sandi"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <Text style={styles.termsText}>
                            Dengan mendaftar, saya menyetujui <Text style={styles.linkText}>Syarat Ketentuan</Text> dan <Text style={styles.linkText}>Kebijakan Privasi</Text>
                        </Text>

                    </Animated.View>
                </ScrollView>

                {/* Fixed Button at Bottom (moves with keyboard, never covered by it) */}
                <View style={[styles.bottomContainer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 16 : 24 }]}>
                    <TouchableOpacity 
                        style={styles.registerBtn} 
                        onPress={handleRegister} 
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.registerBtnText}>Daftar Sekarang</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
    scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 16 },
    
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingBottom: 24,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', marginRight: 4 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
    
    formCard: { 
        padding: 24, 
        paddingTop: 0
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
    
    termsText: {
        fontSize: 12,
        color: '#A1A1AA',
        lineHeight: 18,
        marginTop: 8,
        marginBottom: 20
    },
    linkText: {
        color: '#2563EB',
        fontWeight: '600'
    },
    
    registerBtn: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#2563EB', 
        borderRadius: 12, 
        paddingVertical: 16, 
    },
    registerBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    bottomContainer: {
        backgroundColor: '#000000',
        paddingHorizontal: 24,
        paddingTop: 12,
    },
});
