import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing } from '../styles/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'social';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary': return styles.secondary;
            case 'danger': return styles.danger;
            case 'outline': return styles.outline;
            case 'social': return styles.social;
            default: return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline': return styles.outlineText;
            case 'social': return styles.socialText;
            default: return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[styles.base, getButtonStyle(), style, disabled && styles.disabled]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'social' ? Colors.primary : Colors.white} />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.baseText, getTextStyle(), textStyle, icon ? { marginLeft: 8 } : {}]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        marginVertical: Spacing.sm,
    },
    baseText: {
        fontSize: 16,
        fontWeight: '600',
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    primaryText: {
        color: Colors.white,
    },
    secondary: {
        backgroundColor: Colors.secondary,
    },
    danger: {
        backgroundColor: Colors.danger,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    outlineText: {
        color: Colors.primary,
    },
    social: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    socialText: {
        color: Colors.text,
    },
    disabled: {
        opacity: 0.5,
    },
});
