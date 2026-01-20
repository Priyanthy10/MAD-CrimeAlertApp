import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Switch, Image } from 'react-native';
import { Colors, Spacing, Typography } from '../../src/styles/theme';
import { ChevronLeft, User, Bell, MapPin, LogOut, Mail, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import * as Location from 'expo-location';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout, loading } = useAuth();
    const [locationPermission, setLocationPermission] = useState(false);

    useEffect(() => {
        checkLocationPermission();
    }, []);

    const checkLocationPermission = async () => {
        const { status } = await Location.getForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
    };

    const handleLocationToggle = async () => {
        if (!locationPermission) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationPermission(true);
                Alert.alert('Success', 'Location permission granted');
            } else {
                Alert.alert('Permission Denied', 'Please enable location permissions in your device settings.');
            }
        } else {
            Alert.alert(
                'Disable Location',
                'To disable location permissions, please go to your device settings.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                            Alert.alert('Success', 'Logged out successfully');
                            router.replace('/login');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to logout');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* User Profile Section */}
                {user ? (
                    <TouchableOpacity
                        style={styles.profileSection}
                        onPress={() => router.push('/profile')}
                    >
                        <View style={styles.avatarContainer}>
                            {user.photoURL ? (
                                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                            ) : (
                                <User size={40} color={Colors.white} />
                            )}
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user.displayName || 'Set your name'}</Text>
                            <Text style={styles.profileEmail}>{user.email}</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.secondary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.loginPrompt}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.loginPromptText}>Login to access all features</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => user ? router.push('/profile') : router.push('/login')}
                    >
                        <User size={20} color={Colors.primary} />
                        <Text style={styles.settingText}>Profile</Text>
                        <ChevronRight size={20} color={Colors.border} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => router.push('/notifications')}
                    >
                        <Bell size={20} color={Colors.primary} />
                        <Text style={styles.settingText}>Notifications</Text>
                        <ChevronRight size={20} color={Colors.border} />
                    </TouchableOpacity>

                    <View style={styles.settingItem}>
                        <MapPin size={20} color={Colors.primary} />
                        <Text style={styles.settingText}>Location Permissions</Text>
                        <Switch
                            value={locationPermission}
                            onValueChange={handleLocationToggle}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.white}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Version</Text>
                        <Text style={styles.settingValue}>1.0.0</Text>
                    </View>
                </View>

                {user && (
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={handleLogout}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.danger} />
                        ) : (
                            <>
                                <LogOut size={20} color={Colors.danger} />
                                <Text style={styles.logoutText}>Logout</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: 60,
        paddingBottom: Spacing.md,
    },
    backBtn: {
        padding: 8,
    },
    title: {
        ...Typography.h1,
        fontSize: 20,
    },
    content: {
        flex: 1,
        padding: Spacing.lg,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    profileInfo: {
        marginLeft: Spacing.md,
        flex: 1,
    },
    profileName: {
        ...Typography.h2,
        fontSize: 18,
        marginBottom: 4,
    },
    profileEmail: {
        ...Typography.small,
        color: Colors.secondary,
    },
    loginPrompt: {
        backgroundColor: Colors.primaryLight,
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.xl,
        alignItems: 'center',
    },
    loginPromptText: {
        ...Typography.body,
        color: Colors.primary,
        fontWeight: '600',
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.h2,
        fontSize: 16,
        marginBottom: Spacing.md,
        color: Colors.secondary,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.sm,
    },
    settingText: {
        ...Typography.body,
        marginLeft: Spacing.md,
        flex: 1,
    },
    settingValue: {
        ...Typography.body,
        color: Colors.secondary,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.danger,
        marginTop: Spacing.xl,
    },
    logoutText: {
        ...Typography.body,
        color: Colors.danger,
        fontWeight: '600',
        marginLeft: Spacing.sm,
    },
});
