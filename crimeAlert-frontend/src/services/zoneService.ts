import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

export interface Zone {
    id?: string;
    userId: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    phoneNameOnly: boolean;
    highRiskAlerts: boolean;
}

/**
 * Get all zones for the current user
 */
export async function getUserZones(): Promise<Zone[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const zonesCol = collection(db, "zones");
    const q = query(zonesCol, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Zone));
}

/**
 * Create a new zone
 */
export async function createZone(zoneData: Omit<Zone, "userId" | "id">): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const zonesCol = collection(db, "zones");
    const docRef = await addDoc(zonesCol, {
        ...zoneData,
        userId: user.uid
    });
    return docRef.id;
}

/**
 * Update an existing zone
 */
export async function updateZone(zoneId: string, updates: Partial<Zone>): Promise<void> {
    const zoneDoc = doc(db, "zones", zoneId);
    await updateDoc(zoneDoc, updates);
}

/**
 * Delete a zone
 */
export async function deleteZone(zoneId: string): Promise<void> {
    const zoneDoc = doc(db, "zones", zoneId);
    await deleteDoc(zoneDoc);
}
