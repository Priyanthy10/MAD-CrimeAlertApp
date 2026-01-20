import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography } from '../../src/styles/theme';
import { Plus, Bell, Settings, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCrimeAlerts } from '../../src/context/CrimeAlertContext';

import { getUserZones, Zone } from '../../src/services/zoneService';
import { getDistance } from '../../src/services/proximityService';

export default function AlertsScreen() {
    const router = useRouter();
    const { alerts, loading: alertsLoading } = useCrimeAlerts();
    const [activeTab, setActiveTab] = useState('All');
    const [userZones, setUserZones] = useState<Zone[]>([]);
    const [loadingZones, setLoadingZones] = useState(false);

    React.useEffect(() => {
        if (activeTab === 'Saved Zones') {
            fetchUserZones();
        }
    }, [activeTab]);

    const fetchUserZones = async () => {
        setLoadingZones(true);
        try {
            const zones = await getUserZones();
            setUserZones(zones);
        } catch (error) {
            console.error("Error fetching zones for alerts:", error);
        } finally {
            setLoadingZones(false);
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        if (activeTab === 'All') return true;

        // Check if alert is within any saved zone radius
        return userZones.some(zone => {
            const distance = getDistance(zone.latitude, zone.longitude, alert.latitude, alert.longitude);
            return distance <= zone.radius;
        });
    });

    const formatTime = (timestamp: any) => {
        if (!timestamp) return "Just now";
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
                <Text style={styles.title}>Alerts &{"\n"}Notifications</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'All' && styles.activeTab]}
                    onPress={() => setActiveTab('All')}
                >
                    <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Saved Zones' && styles.activeTab]}
                    onPress={() => setActiveTab('Saved Zones')}
                >
                    <Text style={[styles.tabText, activeTab === 'Saved Zones' && styles.activeTabText]}>Saved Zones</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {(alertsLoading || (activeTab === 'Saved Zones' && loadingZones)) ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
                ) : filteredAlerts.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 50, color: Colors.secondary }}>
                        {activeTab === 'All' ? 'No active alerts at this time.' : 'No alerts in your saved zones.'}
                    </Text>
                ) : (
                    filteredAlerts.map((alert) => (
                        <View key={alert.id} style={styles.alertCard}>
                            <View style={[styles.indicator, { backgroundColor: alert.severity === 'HIGH' ? Colors.danger : Colors.warning }]} />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.riskBadge, { backgroundColor: alert.severity === 'HIGH' ? Colors.riskHigh : Colors.riskMedium }]}>
                                        <Text style={[styles.riskText, { color: alert.severity === 'HIGH' ? Colors.danger : Colors.warning }]}>{alert.severity} RISK</Text>
                                    </View>
                                </View>

                                <Text style={styles.alertType}>{alert.type}</Text>
                                <Text style={styles.alertType} numberOfLines={2}>{alert.message}</Text>
                                <Text style={styles.alertTime}>{formatTime(alert.timestamp)}</Text>
                            </View>
                            <ChevronRight size={20} color={Colors.border} style={styles.chevron} />
                        </View>
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
        paddingHorizontal: Spacing.xl,
        paddingTop: 60,
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h1,
        fontSize: 28,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: Spacing.xl,
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 4,
        borderWidth: 1,
        borderColor: Colors.primary,
        marginBottom: Spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    activeTabText: {
        color: Colors.white,
    },
    list: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    listContent: {
        paddingBottom: 100,
    },
    alertCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        flexDirection: 'row',
        marginBottom: Spacing.md,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    indicator: {
        width: 6,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    riskText: {
        fontSize: 10,
        fontWeight: '800',
    },
    alertType: {
        ...Typography.body,
        fontWeight: '700',
        marginBottom: 4,
    },
    alertTime: {
        ...Typography.small,
    },
    chevron: {
        alignSelf: 'center',
        marginRight: Spacing.sm,
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
