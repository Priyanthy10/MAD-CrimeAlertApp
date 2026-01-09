// Alert Service
// Handles all alert-related API calls
//
// TODO: Implement the following functions:
//
// getAlerts(token)
//   - GET request to /api/alerts
//   - Return array of all alerts
//   - Include alert details (id, type, message, location, timestamp, severity)
//
// getAlertsByZone(token, zoneId)
//   - GET request to /api/alerts/zone/:id
//   - Return alerts specific to a zone
//   - Filter by zone boundaries
//
// reportAlert(token, alertData: {type, message, latitude, longitude, severity})
//   - POST request to /api/alerts
//   - Create new alert report
//   - Return created alert object
//
// getAlertById(token, alertId)
//   - GET request to /api/alerts/:id
//   - Return single alert details
//
// markAlertAsRead(token, alertId)
//   - PUT request to /api/alerts/:id/read
//   - Mark alert as viewed by user
// Alert Service
// Handles all alert-related API calls

import { AlertSeverity } from "../../app/alerts";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// 🔹 Alert type definition
export interface Alert {
  id: string;
  type: string;
  message: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  severity: AlertSeverity;
  isRead?: boolean;
}

// 🔹 Helper function for headers
const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/**
 * GET /api/alerts
 * Return array of all alerts
 */
export async function getAlerts(token: string): Promise<Alert[]> {
  const response = await fetch(`${API_BASE_URL}/alerts`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
}

/**
 * GET /api/alerts/zone/:id
 * Return alerts specific to a zone
 */
export async function getAlertsByZone(
  token: string,
  zoneId: string
): Promise<Alert[]> {
  const response = await fetch(`${API_BASE_URL}/alerts/zone/${zoneId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch zone alerts");
  }

  return response.json();
}

/**
 * POST /api/alerts
 * Create new alert report
 */
export async function reportAlert(
  token: string,
  alertData: {
    type: string;
    message: string;
    latitude: number;
    longitude: number;
    severity: AlertSeverity;
  }
): Promise<Alert> {
  const response = await fetch(`${API_BASE_URL}/alerts`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(alertData),
  });

  if (!response.ok) {
    throw new Error("Failed to report alert");
  }

  return response.json();
}

/**
 * GET /api/alerts/:id
 * Return single alert details
 */
export async function getAlertById(
  token: string,
  alertId: string
): Promise<Alert> {
  const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch alert");
  }

  return response.json();
}

/**
 * PUT /api/alerts/:id/read
 * Mark alert as read
 */
export async function markAlertAsRead(
  token: string,
  alertId: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/read`, {
    method: "PUT",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to mark alert as read");
  }
}
