import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService';
import { onAuthStateChanged } from 'firebase/auth';

import { UserProfile, getUserProfile } from '../services/userService';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (displayName: string, photoURL?: string, emergencyContact?: string) => Promise<void>;
    signInWithGoogle: (idToken: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const userProfile = await getUserProfile(firebaseUser.uid);
                setProfile(userProfile);
            } else {
                setProfile(null);
            }
            setLoading(false);
            console.log('Auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const firebaseUser = await loginService(email, password);
            setUser(firebaseUser);
            const userProfile = await getUserProfile(firebaseUser.uid);
            setProfile(userProfile);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setLoading(true);
        try {
            const firebaseUser = await registerService(email, password);
            setUser(firebaseUser);
            const userProfile = await getUserProfile(firebaseUser.uid);
            setProfile(userProfile);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutService();
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (displayName: string, photoURL?: string, emergencyContact?: string) => {
        setLoading(true);
        try {
            const { updateUserProfile } = await import('../services/authService');
            await updateUserProfile(displayName, photoURL, emergencyContact);

            if (auth.currentUser) {
                setUser({ ...auth.currentUser });
                const userProfile = await getUserProfile(auth.currentUser.uid);
                setProfile(userProfile);
            }
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        const { forgotPassword: forgotService } = await import('../services/authService');
        await forgotService(email);
    };

    const signInWithGoogle = async (idToken: string) => {
        setLoading(true);
        try {
            const { signInWithGoogle: googleService } = await import('../services/authService');
            const firebaseUser = await googleService(idToken);
            setUser(firebaseUser);
            const userProfile = await getUserProfile(firebaseUser.uid);
            setProfile(userProfile);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, register, logout, updateProfile, forgotPassword, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
