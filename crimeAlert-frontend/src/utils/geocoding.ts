import * as Location from 'expo-location';

export const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
        const result = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (result.length > 0) {
            const item = result[0];

            // If the name is a Plus Code (contains +), don't use it as the primary label
            const displayName = (item.name && item.name.includes('+')) ? item.street : item.name;

            const addressParts = [
                displayName,
                (displayName !== item.street) ? item.street : null,
                item.district,
                item.city,
                item.subregion,
            ].filter(Boolean);

            // Use at most 3 parts for a clean display
            return addressParts.slice(0, 3).join(', ');
        }
    } catch (error) {
        console.warn('Geocoding error:', error);
    }
    return undefined;
};

export const getCoordsFromAddress = async (address: string) => {
    try {
        const result = await Location.geocodeAsync(address);
        if (result.length > 0) {
            return {
                latitude: result[0].latitude,
                longitude: result[0].longitude,
            };
        }
    } catch (error) {
        console.warn('Forward geocoding error:', error);
    }
    return undefined;
};
