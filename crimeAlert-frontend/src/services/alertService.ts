import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// 🔹 Alert severity enum (matching UI expectation)
export enum AlertSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  SOS = "SOS"
}

// 🔹 Alert type definition
export interface Alert {
  id?: string;
  type: string;
  message: string;
  latitude: number;
  longitude: number;
  timestamp: any;
  severity: AlertSeverity;
  isRead?: boolean;
  imageUrl?: string;
  userId?: string;
  confirmedBy?: string[];
}

/**
 * Get all alerts from Firestore
 */
export async function getAlerts(): Promise<Alert[]> {
  const alertsCol = collection(db, "alerts");
  const alertSnapshot = await getDocs(query(alertsCol, orderBy("timestamp", "desc")));
  return alertSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Alert));
}

/**
 * Subscribe to real-time alerts
 */
export function subscribeToAlerts(callback: (alerts: Alert[]) => void) {
  const alertsCol = collection(db, "alerts");
  const q = query(alertsCol, orderBy("timestamp", "desc"));

  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Alert));
    callback(alerts);
  });
}

/**
 * Report a new alert to Firestore
 */
export async function reportAlert(alertData: {
  type: string;
  message: string;
  latitude: number;
  longitude: number;
  severity: AlertSeverity;
  imageUrl?: string;
}): Promise<string> {
  try {
    // Check authentication
    const { auth } = await import('./firebaseConfig');
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Authentication Required: Please log in to report a crime.");
    }

    const alertsCol = collection(db, "alerts");

    const dataToSave = {
      ...alertData,
      userId: currentUser.uid,
      timestamp: Timestamp.now(),
      isRead: false,
      confirmedBy: []
    };

    const docRef = await addDoc(alertsCol, dataToSave);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || "Failed to submit report");
  }
}

/**
 * Confirm a report to increase its credibility
 */
export async function confirmAlert(alertId: string, userId: string): Promise<void> {
  const alertDoc = doc(db, "alerts", alertId);
  const docSnap = await getDoc(alertDoc);

  if (docSnap.exists()) {
    const data = docSnap.data() as Alert;
    const confirmedBy = data.confirmedBy || [];

    // Prevent reporter from confirming their own report and prevent duplicate confirmations
    if (data.userId === userId) {
      throw new Error("You cannot confirm your own report.");
    }

    if (confirmedBy.includes(userId)) {
      throw new Error("You have already confirmed this report.");
    }

    await updateDoc(alertDoc, {
      confirmedBy: [...confirmedBy, userId]
    });
  }
}

/**
 * Mark alert as read
 */
export async function markAlertAsRead(alertId: string): Promise<void> {
  const alertDoc = doc(db, "alerts", alertId);
  await updateDoc(alertDoc, { isRead: true });
}
