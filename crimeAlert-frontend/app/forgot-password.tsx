import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { Mail, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { forgotPassword } = useAuth();

    const handleReset = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email);
            Alert.alert(
                'Email Sent',
                'A password reset link has been sent to your email address.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Reset Password</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.instruction}>
                    Enter your email address below and we'll send you a link to reset your password.
                </Text>

                <Input
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    icon={<Mail size={20} color={Colors.secondary} />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Button
                    title={loading ? 'Sending...' : 'Send Reset Link'}
                    onPress={handleReset}
                    style={styles.resetBtn}
                    disabled={loading}
                />
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        marginRight: Spacing.md,
    },
    title: {
        ...Typography.h1,
        fontSize: 24,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
    },
    instruction: {
        ...Typography.body,
        color: Colors.secondary,
        marginBottom: Spacing.xl,
    },
    resetBtn: {
        marginTop: Spacing.lg,
    },
});
