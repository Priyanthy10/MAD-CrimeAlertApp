import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { ShieldCheck, Mail, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            Alert.alert('Success', 'Logged in successfully!');
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.brandTitle}>InSafe</Text>
                <Text style={styles.brandSubtitle}>Stay Safe, Stay Informed</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.shieldBg}>
                        <ShieldCheck size={80} color={Colors.primary} strokeWidth={1.5} />
                    </View>
                </View>

                <View style={styles.form}>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        icon={<Mail size={20} color={Colors.secondary} />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        icon={<Lock size={20} color={Colors.secondary} />}
                        secureTextEntry
                    />

                    <Button
                        title={loading ? 'Signing In...' : 'Sign In'}
                        onPress={handleLogin}
                        style={styles.signInBtn}
                        disabled={loading}
                    />

                    <TouchableOpacity
                        style={styles.forgotBtn}
                        onPress={() => router.push('/forgot-password')}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.noAccountText}>Don{"'"}t have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: Spacing.xl,
        paddingTop: 60,
    },
    brandTitle: {
        ...Typography.h1,
        fontSize: 28,
    },
    brandSubtitle: {
        ...Typography.caption,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        marginVertical: Spacing.xl,
    },
    shieldBg: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    form: {
        width: '100%',
    },
    signInBtn: {
        marginTop: Spacing.md,
    },
    forgotBtn: {
        alignSelf: 'center',
        marginTop: Spacing.md,
        padding: Spacing.xs,
    },
    forgotText: {
        ...Typography.small,
        color: Colors.primary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.md,
    },
    noAccountText: {
        ...Typography.small,
    },
    signUpText: {
        ...Typography.small,
        color: Colors.primary,
        fontWeight: '700',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.xl,
        width: '100%',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        marginHorizontal: Spacing.md,
        ...Typography.small,
        color: Colors.secondary,
    },
    socialContainer: {
        width: '100%',
    },
    socialBtn: {
        marginBottom: Spacing.sm,
        height: 48,
    },
    socialIcon: {
        width: 20,
        height: 20,
    },
});
