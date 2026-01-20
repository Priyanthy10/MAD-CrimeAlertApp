import * as Notifications from 'expo-notifications';
import { Alert } from './alertService';

// Configure notifications behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Calculate distance between two points in meters (Haversine formula)
 */
export function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Trigger a local notification
 */
export async function sendCrimeAlertNotification(alert: Alert) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: `⚠️ CRIME ALERT: ${alert.severity} RISK`,
            body: alert.message,
            data: { alertId: alert.id },
        },
        trigger: null, // deliver immediately
    });
}

/**
 * Check proximity to all alerts and notify if within radius
 */
const ALERT_RADIUS_METERS = 500;
const notifiedAlerts = new Set<string>();

export function checkProximity(
    userLat: number,
    userLon: number,
    alerts: Alert[]
) {
    alerts.forEach((alert) => {
        const distance = getDistance(
            userLat,
            userLon,
            alert.latitude,
            alert.longitude
        );

        if (distance <= ALERT_RADIUS_METERS) {
            if (alert.id && !notifiedAlerts.has(alert.id)) {
                sendCrimeAlertNotification(alert);
                notifiedAlerts.add(alert.id);
            }
        } else {
            // Optional: Remove from notified set if they leave the area
            // notifiedAlerts.delete(alert.id); 
        }
    });
}
