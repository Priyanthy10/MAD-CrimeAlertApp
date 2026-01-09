import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { Plus, Bell, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function YourZonesScreen() {
    const router = useRouter();

    const zones = [
        { id: '1', name: 'Home', radius: '500m', alerts: '2 new alerts', active: true },
        { id: '2', name: 'Office', radius: '500m', radius2: '200m', active: true },
        { id: '3', name: 'Office', radius: '20km', radius2: '200m', active: true },
        { id: '4', name: 'Park', radius: '200m', active: true },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Zones</Text>
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {zones.map((zone) => (
                    <View key={zone.id} style={styles.zoneCard}>
                        <View style={styles.mapThumb}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=200&h=200' }}
                                style={styles.mapImage}
                            />
                            <View style={styles.markerOverlay}>
                                <View style={styles.miniMarker} />
                            </View>
                        </View>

                        <View style={styles.zoneInfo}>
                            <Text style={styles.zoneName}>{zone.name}</Text>
                            <Text style={styles.zoneDetail}>Radius: {zone.radius}</Text>
                            {zone.radius2 && <Text style={styles.zoneDetail}>Radius: {zone.radius2}</Text>}
                            {zone.alerts && <Text style={styles.alertText}>{zone.alerts}</Text>}
                        </View>

                        <Switch
                            value={zone.active}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            ios_backgroundColor={Colors.border}
                        />
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-zone')}>
                    <Plus size={24} color={Colors.primary} />
                    <Text style={styles.navText}>Add Zone</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/alerts')}>
                    <Bell size={24} color={Colors.secondary} />
                    <Text style={styles.navText}>Alerts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
                    <Settings size={24} color={Colors.secondary} />
                    <Text style={styles.navText}>Settings</Text>
                </TouchableOpacity>
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
    title: {
        ...Typography.h1,
        fontSize: 28,
    },
    list: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    listContent: {
        paddingBottom: 100,
    },
    zoneCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    mapThumb: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: Colors.primaryLight,
        overflow: 'hidden',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    markerOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniMarker: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.danger,
        borderWidth: 1,
        borderColor: Colors.white,
    },
    zoneInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    zoneName: {
        ...Typography.h2,
        fontSize: 18,
        marginBottom: 4,
    },
    zoneDetail: {
        ...Typography.small,
        color: Colors.secondary,
    },
    alertText: {
        ...Typography.small,
        color: Colors.primary,
        marginTop: 2,
        fontWeight: '600',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingBottom: 10,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        color: Colors.secondary,
    },
});
