import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { ShieldCheck, Mail, Lock, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.brandTitle}>InSafe</Text>
                    <Text style={styles.brandSubtitle}>Stay Safe, Stay Informed</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <View style={styles.shieldBg}>
                            <ShieldCheck size={60} color={Colors.primary} strokeWidth={1.5} />
                        </View>
                    </View>

                    <Text style={styles.pageTitle}>Create Account</Text>

                    <View style={styles.form}>
                        <Input
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            icon={<User size={20} color={Colors.secondary} />}
                        />
                        <Input
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            icon={<Mail size={20} color={Colors.secondary} />}
                            keyboardType="email-address"
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            icon={<Lock size={20} color={Colors.secondary} />}
                            secureTextEntry
                        />

                        <Button
                            title="Sign Up"
                            onPress={() => router.replace('/')}
                            style={styles.signUpBtn}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.hasAccountText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={styles.loginText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: Spacing.xl,
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
        marginVertical: Spacing.md,
    },
    shieldBg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    pageTitle: {
        ...Typography.h2,
        fontSize: 24,
        marginBottom: Spacing.lg,
    },
    form: {
        width: '100%',
    },
    signUpBtn: {
        marginTop: Spacing.md,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
    hasAccountText: {
        ...Typography.small,
    },
    loginText: {
        ...Typography.small,
        color: Colors.primary,
        fontWeight: '700',
    },
});
