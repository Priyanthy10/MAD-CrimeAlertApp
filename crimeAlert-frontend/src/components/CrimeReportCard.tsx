import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../styles/theme';
import { AlertTriangle, Clock } from 'lucide-react-native';

interface CrimeReportCardProps {
    type: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    time: string;
    location?: string;
    onPress?: () => void;
}

export const CrimeReportCard: React.FC<CrimeReportCardProps> = ({
    type,
    riskLevel,
    time,
    location,
    onPress,
}) => {
    const getRiskStyles = () => {
        switch (riskLevel) {
            case 'HIGH': return { bg: Colors.riskHigh, text: Colors.danger, label: 'HIGH RISK' };
            case 'MEDIUM': return { bg: Colors.riskMedium, text: Colors.warning, label: 'MEDIUM RISK' };
            default: return { bg: Colors.riskLow, text: Colors.primary, label: 'LOW RISK' };
        }
    };

    const risk = getRiskStyles();

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={[styles.indicator, { backgroundColor: risk.text }]} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.typeContainer}>
                        <AlertTriangle size={16} color={risk.text} style={styles.icon} />
                        <Text style={styles.typeText}>{type}</Text>
                    </View>
                    <Text style={styles.timeText}>{time}</Text>
                </View>

                <View style={[styles.riskBadge, { backgroundColor: risk.bg }]}>
                    <Text style={[styles.riskText, { color: risk.text }]}>{risk.label}</Text>
                </View>

                {location && (
                    <View style={styles.locationContainer}>
                        <Clock size={12} color={Colors.secondary} />
                        <Text style={styles.locationText}>{location}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginVertical: Spacing.xs,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    indicator: {
        width: 4,
        height: '100%',
    },
    content: {
        flex: 1,
        padding: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: Spacing.sm,
    },
    typeText: {
        ...Typography.h2,
        fontSize: 16,
    },
    timeText: {
        ...Typography.small,
    },
    riskBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: Spacing.xs,
    },
    riskText: {
        fontSize: 10,
        fontWeight: '700',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    locationText: {
        ...Typography.small,
        marginLeft: 4,
    },
});
