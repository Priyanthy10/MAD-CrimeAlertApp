import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationCoords {
    latitude: number;
    longitude: number;
    address?: string;
}

export const useLocation = () => {
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getAddress = async (latitude: number, longitude: number) => {
        try {
            const result = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (result.length > 0) {
                const item = result[0];
                const address = [
                    item.name,
                    item.street,
                    item.city,
                    item.region,
                ].filter(Boolean).join(', ');
                return address;
            }
        } catch (error) {
            console.warn('Geocoding error:', error);
        }
        return undefined;
    };

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        async function startTracking() {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    setLoading(false);
                    return;
                }

                // Get initial location
                let initialLocation = await Location.getCurrentPositionAsync({});
                const address = await getAddress(
                    initialLocation.coords.latitude,
                    initialLocation.coords.longitude
                );

                setLocation({
                    latitude: initialLocation.coords.latitude,
                    longitude: initialLocation.coords.longitude,
                    address,
                });
                setLoading(false);

                // Subscribe to location updates
                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 10000, // 10 seconds
                        distanceInterval: 50, // 50 meters
                    },
                    async (newLocation) => {
                        const newAddress = await getAddress(
                            newLocation.coords.latitude,
                            newLocation.coords.longitude
                        );
                        setLocation({
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude,
                            address: newAddress,
                        });
                    }
                );
            } catch (error: any) {
                setErrorMsg(error.message || 'Error tracking location');
                setLoading(false);
            }
        }

        startTracking();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return { location, errorMsg, loading };
};
