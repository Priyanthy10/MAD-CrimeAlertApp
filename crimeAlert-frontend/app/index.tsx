import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { CrimeReportCard } from '../src/components/CrimeReportCard';
import { Search, Bell, Settings, Plus, User, MapPin } from 'lucide-react-native';
import Map, { MapMarker } from '../src/components/MapComponent';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    const crimeReports = [
        { id: '1', type: 'Theft', riskLevel: 'MEDIUM', time: '2 hours ago', location: 'Matara' },
        { id: '2', type: 'Assault', riskLevel: 'HIGH', time: '5 hours ago', location: 'Matara' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.brandTitle}>InSafe</Text>
                    <Text style={styles.brandSubtitle}>Stay Safe, Stay Informed</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/login')}>
                    <User size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color={Colors.primary} />
                    <TextInput
                        placeholder="Search location for crime reports..."
                        style={styles.searchInput}
                        placeholderTextColor={Colors.secondary}
                    />
                </View>
            </View>

            <View style={styles.mapContainer}>
                <Map
                    style={styles.map}
                    initialRegion={{
                        latitude: 5.95,
                        longitude: 80.53,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <MapMarker
                        coordinate={{ latitude: 5.95, longitude: 80.53 }}
                        title="You are here"
                    >
                        <View style={styles.userMarker}>
                            <View style={styles.userMarkerDot} />
                        </View>
                    </MapMarker>
                </Map>
                <View style={styles.mapOverlay}>
                    <View style={styles.locationTag}>
                        <View style={styles.dot} />
                        <Text style={styles.locationTagText}>Matara</Text>
                    </View>
                </View>
            </View>

            <View style={styles.reportsHeader}>
                <View style={styles.reportsTitleContainer}>
                    <Bell size={18} color={Colors.danger} />
                    <Text style={styles.reportsTitle}>Crime Reports</Text>
                </View>
                <TouchableOpacity style={styles.reportBtn}>
                    <Plus size={16} color={Colors.white} />
                    <Text style={styles.reportBtnText}>Report</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.reportsSubtitle}>Recent incidents in Matara</Text>

            <ScrollView style={styles.reportsList} contentContainerStyle={styles.listContent}>
                {crimeReports.map((report) => (
                    <CrimeReportCard
                        key={report.id}
                        type={report.type}
                        riskLevel={report.riskLevel as any}
                        time={report.time}
                    />
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-zone')}>
                    <Plus size={24} color={Colors.primary} />
                    <Text style={styles.navText}>Add Zone</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={() => router.push('/alerts')}>
                    <Bell size={24} color={Colors.danger} />
                    <Text style={[styles.navText, { color: Colors.danger }]}>Alerts</Text>
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
});
