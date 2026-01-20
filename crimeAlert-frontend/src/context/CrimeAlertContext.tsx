import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, subscribeToAlerts } from '../services/alertService';
import { useLocation } from '../hooks/useLocation';
import { checkProximity } from '../services/proximityService';

interface CrimeAlertContextType {
    alerts: Alert[];
    userLocation: { latitude: number; longitude: number; address?: string } | null;
    loading: boolean;
}

const CrimeAlertContext = createContext<CrimeAlertContextType | undefined>(undefined);

export const CrimeAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const { location, loading: locationLoading } = useLocation();

    useEffect(() => {
        // Subscribe to real-time alerts from Firestore
        const unsubscribe = subscribeToAlerts((fetchedAlerts) => {
            setAlerts(fetchedAlerts);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Check proximity whenever location or alerts update
        if (location && alerts.length > 0) {
            checkProximity(location.latitude, location.longitude, alerts);
        }
    }, [location, alerts]);

    return (
        <CrimeAlertContext.Provider value={{ alerts, userLocation: location, loading: locationLoading }}>
            {children}
        </CrimeAlertContext.Provider>
    );
};

export const useCrimeAlerts = () => {
    const context = useContext(CrimeAlertContext);
    if (context === undefined) {
        throw new Error('useCrimeAlerts must be used within a CrimeAlertProvider');
    }
    return context;
};
