import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Switch, ScrollView, Platform } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { Search, MapPin, ChevronLeft, User, X } from 'lucide-react-native';
import Map, { MapMarker, MapCircle } from '../src/components/MapComponent';
import { useRouter } from 'expo-router';

export default function AddZoneScreen() {
    const router = useRouter();
    const [radius, setRadius] = useState(500);
    const [phoneNameOnly, setPhoneNameOnly] = useState(true);
    const [highRiskAlerts, setHighRiskAlerts] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.brandTitle}>InSafe</Text>
                        <Text style={styles.brandSubtitle}>Stay Safe, Stay Informed</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn}>
                        <User size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchBar}>
                    <Search size={20} color={Colors.primary} />
                    <TextInput
                        placeholder="Matara"
                        style={styles.searchInput}
                        placeholderTextColor={Colors.text}
                    />
                    <X size={18} color={Colors.secondary} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.mapContainer}>
                    <Map
                        style={styles.map}
                        initialRegion={{
                            latitude: 5.95,
                            longitude: 80.53,
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.02,
                        }}
                    >
                        <MapMarker coordinate={{ latitude: 5.95, longitude: 80.53 }}>
                            <View style={styles.markerContainer}>
                                <View style={styles.markerDot} />
                                <View style={[styles.markerCallout, { bottom: 35 }]}>
                                    <Text style={styles.calloutText}>Set Zone Center</Text>
                                </View>
                            </View>
                        </MapMarker>
                        <MapCircle
                            center={{ latitude: 5.95, longitude: 80.53 }}
                            radius={radius}
                            fillColor="rgba(26, 155, 103, 0.2)"
                            strokeColor={Colors.primary}
                            strokeWidth={2}
                        />
                    </Map>
                    <View style={styles.locationTag}>
                        <View style={styles.dot} />
                        <Text style={styles.locationTagText}>Safe Area</Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Search address or landmark...</Text>
                        <View style={styles.switchRow}>
                            <View style={styles.switchInfo}>
                                <View style={styles.circleIcon} />
                                <Text style={styles.switchLabel}>Phone Name Only</Text>
                            </View>
                            <Switch
                                value={phoneNameOnly}
                                onValueChange={setPhoneNameOnly}
                                trackColor={{ false: Colors.border, true: Colors.primary }}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>High Risk Alerts</Text>
                            <Switch
                                value={highRiskAlerts}
                                onValueChange={setHighRiskAlerts}
                                trackColor={{ false: Colors.border, true: Colors.primary }}
                            />
                        </View>

                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTrack}>
                                <View style={[styles.sliderFill, { width: `${(radius / 2000) * 100}%` }]} />
                                <View style={[styles.sliderThumb, { left: `${(radius / 2000) * 100}%` }]} />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveBtn} onPress={() => router.push('/zones')}>
                        <Text style={styles.saveBtnText}>Save Zone</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
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

// Re-using layouts from Home for consistency where possible
import { Bell, Settings, Plus } from 'lucide-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: Spacing.md,
        backgroundColor: Colors.background,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
        marginTop: 10,
    },
    brandTitle: {
        ...Typography.h1,
    },
    brandSubtitle: {
        ...Typography.small,
    },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryLight,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingHorizontal: Spacing.md,
        height: 45,
    },
    searchInput: {
        flex: 1,
        marginLeft: Spacing.sm,
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    mapContainer: {
        height: 350,
        marginHorizontal: Spacing.md,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.lg,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    locationTag: {
        position: 'absolute',
        top: 15,
        left: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginRight: 8,
    },
    locationTagText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primary,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        borderWidth: 3,
        borderColor: Colors.white,
    },
    markerCallout: {
        position: 'absolute',
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        width: 120,
        alignItems: 'center',
    },
    calloutText: {
        fontSize: 12,
        fontWeight: '600',
    },
    controls: {
        paddingHorizontal: Spacing.xl,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionLabel: {
        ...Typography.caption,
        marginBottom: Spacing.sm,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: Spacing.xs,
    },
    switchInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.secondary,
        marginRight: Spacing.sm,
    },
    switchLabel: {
        ...Typography.body,
        color: Colors.secondary,
    },
    sliderContainer: {
        marginTop: Spacing.xl,
        paddingHorizontal: 10,
    },
    sliderTrack: {
        height: 6,
        backgroundColor: Colors.border,
        borderRadius: 3,
        position: 'relative',
        justifyContent: 'center',
    },
    sliderFill: {
        height: 6,
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    sliderThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        position: 'absolute',
        marginLeft: -12,
        borderWidth: 4,
        borderColor: Colors.white,
        elevation: 2,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    saveBtnText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
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
