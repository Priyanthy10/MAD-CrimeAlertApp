import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert as RNAlert, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography } from '../src/styles/theme';
import { ChevronLeft, MapPin, AlertTriangle, Search, X } from 'lucide-react-native';
import Map, { MapMarker } from '../src/components/MapComponent';
import { getCoordsFromAddress, getAddressFromCoords } from '../src/utils/geocoding';
import { useRouter } from 'expo-router';
import { useLocation } from '../src/hooks/useLocation';
import { reportAlert, AlertSeverity } from '../src/services/alertService';

export default function ReportCrimeScreen() {
    const router = useRouter();
    const { location: userLocation, loading: locationLoading } = useLocation();
    const [crimeType, setCrimeType] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<AlertSeverity>(AlertSeverity.MEDIUM);
    const [submitting, setSubmitting] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [areaName, setAreaName] = useState<string | null>(null);

    const [reportLocation, setReportLocation] = useState({
        latitude: 5.95,
        longitude: 80.53,
    });

    const [mapRegion, setMapRegion] = useState({
        latitude: 5.95,
        longitude: 80.53,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const updateAreaName = async (lat: number, lon: number) => {
        const address = await getAddressFromCoords(lat, lon);
        if (address) {
            setAreaName(address);
        }
    };

    React.useEffect(() => {
        if (userLocation) {
            const initialLoc = { latitude: userLocation.latitude, longitude: userLocation.longitude };
            setReportLocation(initialLoc);
            setMapRegion(prev => ({ ...prev, ...initialLoc }));
            updateAreaName(userLocation.latitude, userLocation.longitude);
        }
    }, [userLocation]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const coords = await getCoordsFromAddress(searchQuery);
            if (coords) {
                const newLoc = { latitude: coords.latitude, longitude: coords.longitude };
                setReportLocation(newLoc);
                setMapRegion(prev => ({ ...prev, ...newLoc }));
                setAreaName(searchQuery);
            } else {
                RNAlert.alert('Error', 'Location not found');
            }
        } catch (error) {
            RNAlert.alert('Error', 'Failed to search location');
        } finally {
            setSearching(false);
        }
    };

    const handleMapPress = (e: any) => {
        const coords = e.nativeEvent.coordinate;
        setReportLocation(coords);
        updateAreaName(coords.latitude, coords.longitude);
    };

    const crimeTypes = ['Theft', 'Assault', 'Robbery', 'Vandalism', 'Suspicious Activity', 'Other'];
    const severityLevels = [
        { value: AlertSeverity.LOW, label: 'Low Risk', color: Colors.primary },
        { value: AlertSeverity.MEDIUM, label: 'Medium Risk', color: Colors.warning },
        { value: AlertSeverity.HIGH, label: 'High Risk', color: Colors.danger },
    ];



    const handleSubmit = async () => {
        if (!crimeType.trim()) {
            RNAlert.alert('Missing Information', 'Please select a crime type.');
            return;
        }

        if (!description.trim()) {
            RNAlert.alert('Missing Information', 'Please provide a description.');
            return;
        }

        if (!reportLocation) {
            RNAlert.alert('Location Error', 'Please select a location for the report.');
            return;
        }

        setSubmitting(true);

        try {
            await submitReport();

        } catch (error: any) {
            RNAlert.alert('Error', error.message || 'Failed to submit report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const submitReport = async () => {
        // Submit the report
        await reportAlert({
            type: crimeType,
            message: description,
            latitude: reportLocation.latitude,
            longitude: reportLocation.longitude,
            severity: severity
        });

        RNAlert.alert(
            'Success',
            'Your report has been submitted successfully!',
            [{ text: 'OK', onPress: () => router.back() }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Report Crime</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* Location Selection */}
                <Text style={styles.sectionLabel}>Location of Incident</Text>

                <View style={styles.searchBar}>
                    <Search size={18} color={Colors.primary} />
                    <TextInput
                        placeholder="Search for incident location..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    {searching && <ActivityIndicator size="small" color={Colors.primary} />}
                    {searchQuery.length > 0 && !searching && (
                        <TouchableOpacity onPress={handleSearch}>
                            <Search size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.mapContainer}>
                    <Map
                        style={styles.map}
                        region={mapRegion}
                        onRegionChangeComplete={setMapRegion}
                        onPress={handleMapPress}
                    >
                        <MapMarker coordinate={reportLocation}>
                            <View style={styles.markerContainer}>
                                <View style={styles.markerDot} />
                            </View>
                        </MapMarker>
                    </Map>
                    <View style={styles.locationTag}>
                        <MapPin size={14} color={Colors.primary} />
                        <Text style={styles.locationTagText} numberOfLines={1}>
                            {areaName || (locationLoading ? 'Getting location...' : 'Select Area on Map')}
                        </Text>
                    </View>
                </View>

                <Text style={styles.helpText}>
                    Tap on the map or search to adjust where this happened.
                </Text>

                {/* Crime Type Selection */}
                <Text style={styles.sectionLabel}>Crime Type *</Text>
                <View style={styles.typeGrid}>
                    {crimeTypes.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.typeChip,
                                crimeType === type && styles.typeChipActive
                            ]}
                            onPress={() => setCrimeType(type)}
                        >
                            <Text style={[
                                styles.typeChipText,
                                crimeType === type && styles.typeChipTextActive
                            ]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Description */}
                <Text style={styles.sectionLabel}>Description *</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Provide details about what happened..."
                    placeholderTextColor={Colors.secondary}
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                    textAlignVertical="top"
                />

                {/* Severity Level */}
                <Text style={styles.sectionLabel}>Severity Level</Text>
                <View style={styles.severityContainer}>
                    {severityLevels.map((level) => (
                        <TouchableOpacity
                            key={level.value}
                            style={[
                                styles.severityBtn,
                                severity === level.value && { backgroundColor: level.color }
                            ]}
                            onPress={() => setSeverity(level.value)}
                        >
                            <AlertTriangle
                                size={16}
                                color={severity === level.value ? Colors.white : level.color}
                            />
                            <Text style={[
                                styles.severityText,
                                { color: severity === level.value ? Colors.white : level.color }
                            ]}>
                                {level.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>



                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.submitBtnText}>Submit Report</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: 60,
        paddingBottom: Spacing.md,
    },
    backBtn: {
        padding: 8,
    },
    title: {
        ...Typography.h1,
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        height: 44,
        marginBottom: Spacing.md,
    },
    searchInput: {
        flex: 1,
        marginLeft: Spacing.sm,
        ...Typography.body,
        fontSize: 14,
    },
    mapContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.sm,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    locationTag: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    locationTagText: {
        ...Typography.small,
        fontSize: 11,
        marginLeft: 6,
        color: Colors.text,
        flex: 1,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    helpText: {
        ...Typography.small,
        color: Colors.secondary,
        marginBottom: Spacing.lg,
    },
    sectionLabel: {
        ...Typography.h2,
        fontSize: 16,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    typeChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
    },
    typeChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    typeChipText: {
        ...Typography.body,
        fontSize: 14,
        color: Colors.text,
    },
    typeChipTextActive: {
        color: Colors.white,
        fontWeight: '600',
    },
    textArea: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Typography.body,
        minHeight: 120,
    },
    severityContainer: {
        gap: Spacing.sm,
    },
    severityBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
    },
    severityText: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: Spacing.sm,
    },
    imageBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
    },
    imageBtnText: {
        ...Typography.body,
        color: Colors.primary,
        fontWeight: '600',
        marginLeft: Spacing.sm,
    },
    imageSelectedText: {
        ...Typography.small,
        color: Colors.primary,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        padding: Spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: Spacing.xl,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    submitBtnDisabled: {
        opacity: 0.6,
    },
    submitBtnText: {
        ...Typography.h2,
        color: Colors.white,
        fontSize: 16,
    },
});
