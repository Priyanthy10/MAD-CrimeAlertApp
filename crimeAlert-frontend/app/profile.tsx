import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { ChevronLeft, User, Mail, Camera, Save, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, profile, updateProfile, loading } = useAuth();
    const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
    const [email] = useState(user?.email || '');
    const [photoURL, setPhotoURL] = useState(profile?.photoURL || user?.photoURL || '');
    const [emergencyContact, setEmergencyContact] = useState(profile?.emergencyContact || '');

    const handleUpdateProfile = async () => {
        if (!displayName.trim()) {
            Alert.alert('Error', 'Display name cannot be empty');
            return;
        }

        try {
            await updateProfile(displayName, photoURL, emergencyContact);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setPhotoURL(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        {photoURL ? (
                            <Image source={{ uri: photoURL }} style={styles.avatar} />
                        ) : (
                            <User size={60} color={Colors.white} />
                        )}
                        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                            <Camera size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileEmail}>{email}</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="Enter your name"
                        value={displayName}
                        onChangeText={setDisplayName}
                        icon={<User size={20} color={Colors.secondary} />}
                    />

                    <Input
                        label="Email (Read Only)"
                        value={email}
                        onChangeText={() => { }}
                        icon={<Mail size={20} color={Colors.secondary} />}
                        style={styles.readOnlyInput}
                    />

                    <Input
                        label="Emergency Contact Number"
                        placeholder="Enter phone number"
                        value={emergencyContact}
                        onChangeText={setEmergencyContact}
                        icon={<Phone size={20} color={Colors.secondary} />}
                        keyboardType="phone-pad"
                    />

                    <Button
                        title={loading ? 'Saving...' : 'Save Changes'}
                        onPress={handleUpdateProfile}
                        style={styles.saveBtn}
                        disabled={loading}
                        icon={!loading && <Save size={20} color={Colors.white} />}
                    />
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
        padding: Spacing.lg,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
    },
    profileEmail: {
        ...Typography.small,
        color: Colors.secondary,
        marginTop: Spacing.md,
    },
    form: {
        marginTop: Spacing.lg,
    },
    readOnlyInput: {
        opacity: 0.7,
    },
    saveBtn: {
        marginTop: Spacing.xl,
    },
});
