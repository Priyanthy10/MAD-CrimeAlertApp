import { TextStyle } from "react-native";

export const Colors = {
    primary: '#1A9B67',
    primaryLight: '#E8F5E9',
    secondary: '#666666',
    text: '#1A1A1A',
    background: '#F8FDFB',
    white: '#FFFFFF',
    danger: '#E23A3A',
    warning: '#F4B400',
    success: '#1A9B67',
    border: '#E0E0E0',
    cardBg: '#FFFFFF',
    riskLow: '#E8F5E9',
    riskMedium: '#FFF8E1',
    riskHigh: '#FFEBEE',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const Typography: Record<string, TextStyle> = {
    h1: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
    },
    h2: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text,
    },
    body: {
        fontSize: 16,
        color: Colors.text,
    },
    caption: {
        fontSize: 14,
        color: Colors.secondary,
    },
    small: {
        fontSize: 12,
        color: Colors.secondary,
    },
};
