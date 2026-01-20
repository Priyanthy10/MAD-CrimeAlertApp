import {
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    phoneNumber?: string;
    photoURL?: string;
    emergencyContact?: string;
    role: 'user' | 'admin';
    createdAt: any;
    preferences: {
        notificationsEnabled: boolean;
        radius: number;
    };
}

/**
 * Create or update user profile after registration/login
 */
export async function syncUserProfile(): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        // Initial profile setup
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            role: 'user',
            createdAt: new Date(),
            preferences: {
                notificationsEnabled: true,
                radius: 500
            }
        });
    }
}

/**
 * Get user profile data
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
    }
    return null;
}

/**
 * Update user preferences
 */
export async function updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, updates);
}
