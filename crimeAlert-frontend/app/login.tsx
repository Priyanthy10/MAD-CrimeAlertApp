import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { ShieldCheck, Mail, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

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
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        icon={<Lock size={20} color={Colors.secondary} />}
                        secureTextEntry
                    />

                    <Button
                        title="Sign In"
                        onPress={() => router.replace('/')}
                        style={styles.signInBtn}
                    />

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.noAccountText}>Don{"'"}t have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.socialContainer}>
                    <Button
                        title="Continue Google"
                        variant="social"
                        onPress={() => { }}
                        style={styles.socialBtn}
                        icon={<Image source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} style={styles.socialIcon} />}
                    />
                    <Button
                        title="Continue Apple"
                        variant="social"
                        onPress={() => { }}
                        style={styles.socialBtn}
                        icon={<Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/mac-os.png' }} style={styles.socialIcon} />}
                    />
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
        marginTop: Spacing.sm,
    },
    forgotText: {
        ...Typography.small,
        color: Colors.secondary,
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
