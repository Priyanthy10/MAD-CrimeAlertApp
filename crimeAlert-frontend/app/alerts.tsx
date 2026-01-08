import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { Plus, Bell, Settings, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AlertsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('All');

    const alerts = [
        {
            id: '1',
            type: 'Assault reported at City Park',
            risk: 'HIGH',
            time: '5 minutes ago',
            color: Colors.danger
        },
        {
            id: '2',
            type: 'Suspicious activity near Home zone',
            risk: 'MEDIUM',
            time: '3 hours ago',
            color: Colors.warning
        },
        {
            id: '3',
            type: 'Vandalism activity near Home zone',
            risk: 'MEDIUM',
            time: 'Yesterday ago',
            color: Colors.warning
        },
    ];

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
                {alerts.map((alert) => (
                    <View key={alert.id} style={styles.alertCard}>
                        <View style={[styles.indicator, { backgroundColor: alert.color }]} />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.riskBadge, { backgroundColor: alert.risk === 'HIGH' ? Colors.riskHigh : Colors.riskMedium }]}>
                                    <Text style={[styles.riskText, { color: alert.color }]}>{alert.risk} RISK</Text>
                                </View>
                                <View style={[styles.riskBadge, { backgroundColor: alert.risk === 'HIGH' ? Colors.riskHigh : Colors.riskMedium, opacity: 0.5 }]}>
                                    <Text style={[styles.riskText, { color: alert.color, fontSize: 8 }]}>HIGH RISK</Text>
                                </View>
                            </View>

                            <Text style={styles.alertType}>{alert.type}</Text>
                            <Text style={styles.alertTime}>{alert.time}</Text>
                        </View>
                        <ChevronRight size={20} color={Colors.border} style={styles.chevron} />
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
