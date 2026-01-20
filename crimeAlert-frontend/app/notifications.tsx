import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Switch } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { ChevronLeft, Bell, BellOff, Info, AlertTriangle, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useCrimeAlerts } from '../src/context/CrimeAlertContext';

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

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'alert' | 'info' | 'success';
    read: boolean;
}

export default function NotificationsScreen() {
    const router = useRouter();
    const { alerts, loading } = useCrimeAlerts();
    const [pushEnabled, setPushEnabled] = useState(true);

    // Map real alerts to notification items
    const notifications: NotificationItem[] = alerts.map(alert => ({
        id: alert.id || Math.random().toString(),
        title: `New ${alert.severity === 'SOS' ? 'SOS' : 'Crime'} Alert`,
        description: alert.message,
        time: formatTime(alert.timestamp),
        type: alert.severity === 'SOS' || alert.severity === 'HIGH' ? 'alert' : 'info',
        read: alert.isRead || false,
    }));

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertTriangle size={20} color={Colors.danger} />;
            case 'success': return <ShieldCheck size={20} color={Colors.success} />;
            default: return <Info size={20} color={Colors.primary} />;
        }
    };

    const renderItem = ({ item }: { item: NotificationItem }) => (
        <TouchableOpacity style={[styles.notificationItem, !item.read && styles.unreadItem]}>
            <View style={[styles.iconContainer, { backgroundColor: item.type === 'alert' ? '#FFEBEE' : item.type === 'success' ? '#E8F5E9' : '#E3F2FD' }]}>
                {getIcon(item.type)}
            </View>
            <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                    <Text style={[styles.notificationTitle, !item.read && styles.unreadText]}>{item.title}</Text>
                    <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
                <Text style={styles.notificationDesc} numberOfLines={2}>{item.description}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.settingsSection}>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Bell size={20} color={Colors.primary} />
                        <Text style={styles.settingLabel}>Push Notifications</Text>
                    </View>
                    <Switch
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                        trackColor={{ false: Colors.border, true: Colors.primary }}
                        thumbColor={Colors.white}
                    />
                </View>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={<Text style={styles.listTitle}>Recent</Text>}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <BellOff size={60} color={Colors.secondary} strokeWidth={1} />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
            />
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
    settingsSection: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: 12,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        ...Typography.body,
        marginLeft: Spacing.md,
        fontWeight: '500',
    },
    listContent: {
        padding: Spacing.lg,
    },
    listTitle: {
        ...Typography.h2,
        fontSize: 16,
        marginBottom: Spacing.md,
        color: Colors.secondary,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.sm,
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: '#F0F7FF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    notificationTitle: {
        ...Typography.body,
        fontWeight: '400',
    },
    unreadText: {
        fontWeight: '700',
    },
    notificationTime: {
        ...Typography.small,
        color: Colors.secondary,
        fontSize: 10,
    },
    notificationDesc: {
        ...Typography.small,
        color: Colors.secondary,
        lineHeight: 18,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginLeft: Spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.secondary,
        marginTop: Spacing.md,
    },
});
