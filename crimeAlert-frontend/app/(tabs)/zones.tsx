import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert as RNAlert } from 'react-native';
import { Colors, Spacing, Typography } from '../../src/styles/theme';
import { Plus, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getUserZones, deleteZone, Zone } from '../../src/services/zoneService';
import { getAddressFromCoords } from '../../src/utils/geocoding';

interface ZoneWithAddress extends Zone {
    address?: string;
}

export default function YourZonesScreen() {
    const router = useRouter();
    const [zones, setZones] = useState<ZoneWithAddress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchZones();
    }, []);

    const fetchZones = async () => {
        setLoading(true);
        try {
            const fetchedZones = await getUserZones();
            const zonesWithAddress = await Promise.all(fetchedZones.map(async (zone) => {
                try {
                    const address = await getAddressFromCoords(zone.latitude, zone.longitude);
                    return { ...zone, address };
                } catch (e) {
                    return { ...zone, address: 'Address unavailable' };
                }
            }));
            setZones(zonesWithAddress);
        } catch (error: any) {
            if (error.message === 'User not authenticated') {
                RNAlert.alert("Authentication Required", "Please log in to view and manage your safe zones.");
            } else {
                RNAlert.alert("Error", "Failed to fetch zones. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteZone = async (zoneId: string) => {
        RNAlert.alert(
            "Delete Zone",
            "Are you sure you want to delete this safe zone?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteZone(zoneId);
                            setZones(prev => prev.filter(z => z.id !== zoneId));
                        } catch (error) {
                            console.error("Error deleting zone:", error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Zones</Text>
                <TouchableOpacity
                    style={styles.addZoneHeaderBtn}
                    onPress={() => router.push('/add-zone')}
                >
                    <Plus size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
                ) : zones.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>You haven't added any zones yet.</Text>
                        <TouchableOpacity
                            style={styles.emptyBtn}
                            onPress={() => router.push('/add-zone')}
                        >
                            <Text style={styles.emptyBtnText}>Create Your First Zone</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    zones.map((zone) => (
                        <View key={zone.id} style={styles.zoneCard}>
                            <View style={styles.mapThumb}>
                                <View style={styles.markerOverlay}>
                                    <View style={styles.miniMarker} />
                                </View>
                            </View>

                            <View style={styles.zoneInfo}>
                                <Text style={styles.zoneName}>{zone.name}</Text>
                                <Text style={styles.zoneDetail}>Radius: {zone.radius}m</Text>
                                <Text style={styles.zoneDetail} numberOfLines={1}>{zone.address || 'Loading address...'}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => zone.id && handleDeleteZone(zone.id)}
                            >
                                <Trash2 size={20} color={Colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Floating Add Button */}
            {!loading && zones.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push('/add-zone')}
                >
                    <Plus size={30} color={Colors.white} />
                </TouchableOpacity>
            )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: 60,
        paddingBottom: Spacing.md,
    },
    title: {
        ...Typography.h1,
        fontSize: 28,
    },
    addZoneHeaderBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: Spacing.lg,
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
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: Colors.primaryLight,
        overflow: 'hidden',
        position: 'relative',
    },
    markerOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniMarker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.danger,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    zoneInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    zoneName: {
        ...Typography.h2,
        fontSize: 16,
        color: Colors.text,
    },
    zoneDetail: {
        fontSize: 12,
        color: Colors.secondary,
        marginTop: 2,
    },
    deleteBtn: {
        padding: 10,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.secondary,
        marginBottom: Spacing.xl,
    },
    emptyBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: 25,
    },
    emptyBtnText: {
        color: Colors.white,
        fontWeight: '700',
    }
});
