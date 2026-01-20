import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { getAlerts, Alert } from './alertService';
import { getUserZones, Zone } from './zoneService';
import { getDistance, sendCrimeAlertNotification } from './proximityService';
import { auth } from './firebaseConfig';

import { Alert as RNAlert } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const notifiedAlerts = new Set<string>();

/**
 * Define the background location task
 */
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: { data: any, error: any }) => {
    if (error) {
        console.error("Background Location Error:", error);
        return;
    }
    if (data) {
        const { locations } = data as any;
        const location = locations[0];
        if (!location) return;

        const { latitude, longitude } = location.coords;

        try {
            // Fetch latest alerts
            const alerts = await getAlerts();

            // 1. Check immediate proximity (500m) to user
            alerts.forEach((alert) => {
                const dist = getDistance(latitude, longitude, alert.latitude, alert.longitude);
                // Only notify if within 500m and not already notified in this session
                if (dist <= 500 && alert.id && !notifiedAlerts.has(alert.id)) {
                    sendCrimeAlertNotification(alert);
                    notifiedAlerts.add(alert.id);
                }
            });

            // 2. Check Saved Zones for critical incidents
            // Only if user is logged in
            if (auth.currentUser) {
                const zones = await getUserZones().catch(() => [] as Zone[]);
                zones.forEach(zone => {
                    const distToZone = getDistance(latitude, longitude, zone.latitude, zone.longitude);

                    // If user is inside one of their saved zones
                    if (distToZone <= zone.radius) {
                        const criticalAlerts = alerts.filter(a =>
                            a.severity === 'SOS' || a.severity === 'HIGH'
                        );

                        criticalAlerts.forEach(alert => {
                            const distToAlert = getDistance(zone.latitude, zone.longitude, alert.latitude, alert.longitude);
                            // If there's a serious crime in this specific zone
                            if (distToAlert <= zone.radius) {
                                if (alert.id && !notifiedAlerts.has(alert.id + '_zone_' + zone.id)) {
                                    Notifications.scheduleNotificationAsync({
                                        content: {
                                            title: `🛡️ Security Alert: ${zone.name}`,
                                            body: `Critical incident (${alert.type}) reported within your saved zone. Stay alert!`,
                                            sound: true,
                                            priority: Notifications.AndroidNotificationPriority.HIGH,
                                        },
                                        trigger: null,
                                    });
                                    notifiedAlerts.add(alert.id + '_zone_' + zone.id);
                                }
                            }
                        });
                    }
                });
            }
        } catch (err) {
            console.error("Background Task logic failed:", err);
        }
    }
});

/**
 * Permissions and initialization
 */
export const registerBackgroundLocation = async () => {
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        if (isRegistered) {
            return;
        }

        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            RNAlert.alert("Permission Required", "Foregound location permission is needed to monitor your safety.");
            return;
        }

        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            RNAlert.alert("Crucial Permission", "Background location (Allow All The Time) is required for real-time safety alerts even when the app is closed. Please enable it in Settings.");
            return;
        }

        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        if (notificationStatus !== 'granted') {
            RNAlert.alert("Notifications Hidden", "Enable notifications to receive immediate safety alerts in your area.");
            return;
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 60000,     // 1 minute
            distanceInterval: 100,    // 100 meters
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "InSafe Active Monitoring",
                notificationBody: "Monitoring surroundings for your safety.",
                notificationColor: "#1A9B67",
            },
        });

        console.log("✅ Background location monitoring started.");
    } catch (error) {
        console.error("Failed to start background tracking:", error);
    }
};

export const stopBackgroundLocation = async () => {
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        if (isRegistered) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            console.log("Background location monitoring stopped.");
        }
    } catch (error) {
        console.error("Failed to stop background tracking:", error);
    }
};
