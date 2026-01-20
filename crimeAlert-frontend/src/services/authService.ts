import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    User,
    updateProfile, // Firebase Auth update
    GoogleAuthProvider,
    signInWithCredential
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { syncUserProfile } from "./userService";

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile();
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message || "Failed to login");
    }
}

/**
 * Register a new user
 */
export async function register(email: string, password: string): Promise<User> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfile();
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message || "Failed to register");
    }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error(error.message || "Failed to logout");
    }
}

/**
 * Login with Google
 */
export async function signInWithGoogle(idToken: string): Promise<User> {
    try {
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        await syncUserProfile();
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message || "Failed to login with Google");
    }
}

/**
 * Send password reset email
 */
export async function forgotPassword(email: string): Promise<void> {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        throw new Error(error.message || "Failed to send reset email");
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(displayName: string, photoURL?: string, emergencyContact?: string): Promise<void> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");

        // Update Firebase Auth Profile
        await updateProfile(user, { displayName, photoURL });

        // Update Firestore Document
        const { updateProfile: updateFirestore } = await import('./userService');
        await updateFirestore(user.uid, {
            displayName,
            photoURL,
            emergencyContact
        });
    } catch (error: any) {
        throw new Error(error.message || "Failed to update profile");
    }
}
