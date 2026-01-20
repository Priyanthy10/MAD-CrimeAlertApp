import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, Alert as RNAlert, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography } from '../../src/styles/theme';
import { CrimeReportCard } from '../../src/components/CrimeReportCard';
import { Search, Bell, Settings, Plus, User, MapPin, ShieldAlert } from 'lucide-react-native';
import Map, { MapMarker, MapHeatmap } from '../../src/components/MapComponent';
import { useRouter } from 'expo-router';
import { useCrimeAlerts } from '../../src/context/CrimeAlertContext';
import { useAuth } from '../../src/context/AuthContext';
import { reportAlert, AlertSeverity, confirmAlert } from '../../src/services/alertService';
import { getCoordsFromAddress, getAddressFromCoords } from '../../src/utils/geocoding';
import { getDistance } from '../../src/services/proximityService';

export default function HomeScreen() {
    const router = useRouter();
    const { alerts, userLocation, loading: alertsLoading } = useCrimeAlerts();
    const { user, profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [isSOSLoading, setIsSOSLoading] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 5.95,
        longitude: 80.53,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    // Filter alerts based on map center (e.g., within 5km)
    const filteredAlerts = alerts.filter(alert => {
        const distance = getDistance(
            mapRegion.latitude,
            mapRegion.longitude,
            alert.latitude,
            alert.longitude
        );
        return distance <= 5000; // 5km radius
    });

    const handleSOS = async () => {
        if (!userLocation) {
            RNAlert.alert('Error', 'Cannot trigger SOS without location access');
            return;
        }

        RNAlert.alert(
            "EMERGENCY SOS",
            "Are you in immediate danger? This will notify nearby users and your emergency contact.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "YES, SEND SOS",
                    style: "destructive",
                    onPress: async () => {
                        setIsSOSLoading(true);
                        try {
                            await reportAlert({
                                type: "SOS SIGNAL",
                                message: `Emergency SOS triggered by ${profile?.displayName || user?.email}. Immediate assistance required!`,
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                                severity: AlertSeverity.SOS
                            });

                            RNAlert.alert(
                                "SOS SENT",
                                `Your emergency contact (${profile?.emergencyContact || 'Not set'}) and nearby users have been notified.`
                            );
                        } catch (error: any) {
                            RNAlert.alert("Error", "Failed to trigger SOS");
                        } finally {
                            setIsSOSLoading(false);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        if (userLocation && !selectedArea) {
            setMapRegion(prev => ({
                ...prev,
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
            }));
        }
    }, [userLocation]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const coords = await getCoordsFromAddress(searchQuery);
            if (coords) {
                setMapRegion(prev => ({
                    ...prev,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }));
                setSelectedArea(searchQuery);
            } else {
                RNAlert.alert('Error', 'Location not found');
            }
        } catch (error) {
            RNAlert.alert('Error', 'Failed to search location');
        } finally {
            setSearching(false);
        }
    };

    const handleMapPress = async (e: any) => {
        const coords = e.nativeEvent.coordinate;
        setMapRegion(prev => ({
            ...prev,
            latitude: coords.latitude,
            longitude: coords.longitude,
        }));

        const address = await getAddressFromCoords(coords.latitude, coords.longitude);
        if (address) {
            setSelectedArea(address.split(',')[0]);
        }
    };

    const handleConfirmAlert = async (alertId: string) => {
        if (!user) {
            RNAlert.alert("Authentication", "Please log in to confirm reports.");
            return;
        }
        try {
            await confirmAlert(alertId, user.uid);
            // Alert will update automatically via subscribeToAlerts
            RNAlert.alert("Success", "Report confirmed! Thank you for helping the community.");
        } catch (error: any) {
            RNAlert.alert("Info", error.message);
        }
    };

    const handleReport = () => {
        router.push('/report-crime');
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return "Just now";
        // Simple formatter for Firestore timestamps
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.brandTitle}>InSafe</Text>
                    <Text style={styles.brandSubtitle}>Stay Safe, Stay Informed</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/settings')}>
                    <User size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color={Colors.primary} />
                    <TextInput
                        placeholder="Search location for crime reports..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        placeholderTextColor={Colors.secondary}
                    />
                    {searching ? (
                        <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                        <TouchableOpacity onPress={handleSearch}>
                            <Search size={20} color={Colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.mapContainer}>
                <Map
                    style={styles.map}
                    region={mapRegion}
                    onPress={handleMapPress}
                >
                    {showHeatmap ? (
                        <MapHeatmap
                            points={alerts.map(a => ({
                                latitude: a.latitude,
                                longitude: a.longitude,
                                weight: a.severity === 'SOS' ? 5 : a.severity === 'HIGH' ? 3 : a.severity === 'MEDIUM' ? 2 : 1
                            }))}
                            radius={40}
                            opacity={0.6}
                        />
                    ) : (
                        alerts.map((alert) => {
                            const isVerified = alert.confirmedBy && alert.confirmedBy.length >= 5;
                            return (
                                <MapMarker
                                    key={alert.id}
                                    coordinate={{ latitude: alert.latitude, longitude: alert.longitude }}
                                    title={`${alert.type}${isVerified ? ' (Verified)' : ''}`}
                                    description={alert.message}
                                >
                                    <View style={[
                                        styles.dot,
                                        {
                                            backgroundColor: alert.severity === 'SOS' ? '#FF0000' : alert.severity === 'HIGH' ? Colors.danger : Colors.warning,
                                            width: (alert.severity === 'SOS' || isVerified) ? 18 : 12,
                                            height: (alert.severity === 'SOS' || isVerified) ? 18 : 12,
                                            borderRadius: 9,
                                            borderWidth: isVerified ? 2 : 0,
                                            borderColor: Colors.white,
                                            shadowColor: isVerified ? Colors.success : '#000',
                                            shadowOpacity: isVerified ? 0.8 : 0.2,
                                            elevation: isVerified ? 10 : 2
                                        }
                                    ]} />
                                </MapMarker>
                            );
                        })
                    )}

                    {userLocation && (
                        <MapMarker
                            coordinate={userLocation}
                            title="You are here"
                        >
                            <View style={styles.userMarker}>
                                <View style={styles.userMarkerDot} />
                            </View>
                        </MapMarker>
                    )}
                </Map>
                <View style={styles.mapOverlay}>
                    <View style={styles.locationTag}>
                        <View style={styles.dot} />
                        <Text style={styles.locationTagText} numberOfLines={1}>
                            {selectedArea || userLocation?.address?.split(',')[0] || 'Live Crime Map'}
                        </Text>
                        {(selectedArea) && (
                            <TouchableOpacity
                                style={styles.saveZoneShortcut}
                                onPress={() => router.push({
                                    pathname: '/add-zone',
                                    params: {
                                        lat: mapRegion.latitude,
                                        lon: mapRegion.longitude,
                                        name: selectedArea
                                    }
                                })}
                            >
                                <MapPin size={14} color={Colors.primary} />
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* SOS & Map Controls Overlay */}
                <View style={styles.mapControls}>
                    <TouchableOpacity
                        style={[styles.sosBtn, isSOSLoading && { opacity: 0.7 }]}
                        onPress={handleSOS}
                        disabled={isSOSLoading}
                    >
                        <ShieldAlert size={28} color={Colors.white} />
                        <Text style={styles.sosText}>SOS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.mapActionBtn, showHeatmap && styles.activeMapAction]}
                        onPress={() => setShowHeatmap(!showHeatmap)}
                    >
                        <MapPin size={20} color={showHeatmap ? Colors.white : Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.reportsHeader}>
                <View style={styles.reportsTitleContainer}>
                    <Bell size={18} color={Colors.danger} />
                    <Text style={styles.reportsTitle}>Real-time Alerts</Text>
                </View>
                <TouchableOpacity style={styles.reportBtn} onPress={handleReport}>
                    <Plus size={16} color={Colors.white} />
                    <Text style={styles.reportBtnText}>Report</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.reportsSubtitle}>
                {selectedArea ? `Incidents near ${selectedArea}` : 'Recent incidents near you'}
            </Text>

            <ScrollView style={styles.reportsList} contentContainerStyle={styles.listContent}>
                {filteredAlerts.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: Colors.secondary }}>No reports in this area.</Text>
                ) : (
                    filteredAlerts.map((alert) => (
                        <CrimeReportCard
                            key={alert.id}
                            type={alert.type}
                            riskLevel={alert.severity as any}
                            time={formatTime(alert.timestamp)}
                            location={alert.message}
                            confirmations={alert.confirmedBy?.length || 0}
                            isVerified={(alert.confirmedBy?.length || 0) >= 5}
                            onConfirm={() => alert.id && handleConfirmAlert(alert.id)}
                        />
                    ))
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        marginTop: 10,
    },
    brandTitle: {
        ...Typography.h1,
        color: Colors.text,
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
    searchContainer: {
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
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
    },
    mapContainer: {
        height: 250,
        marginHorizontal: Spacing.md,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapOverlay: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    locationTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginRight: 6,
    },
    locationTagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    userMarker: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(26, 155, 103, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userMarkerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    reportsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.md,
    },
    reportsTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reportsTitle: {
        ...Typography.h2,
        marginLeft: Spacing.sm,
    },
    reportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.danger,
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: 20,
    },
    reportBtnText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    reportsSubtitle: {
        ...Typography.small,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.sm,
    },
    reportsList: {
        flex: 1,
        paddingHorizontal: Spacing.md,
    },
    listContent: {
        paddingBottom: 80,
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
    activeNavItem: {
        // Styling for active state if needed
    },
    mapControls: {
        position: 'absolute',
        bottom: 20,
        right: 10,
        alignItems: 'center',
    },
    sosBtn: {
        backgroundColor: Colors.danger,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    sosText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '900',
        marginTop: -2,
    },
    mapActionBtn: {
        backgroundColor: Colors.white,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    activeMapAction: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    saveZoneShortcut: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    saveText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        marginLeft: 4,
    },
});
