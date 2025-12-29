import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../styles/theme';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    error?: string;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType = 'default',
    error,
    icon,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error ? styles.inputError : {}]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.secondary}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.sm,
        width: '100%',
    },
    label: {
        ...Typography.small,
        marginBottom: Spacing.xs,
        marginLeft: Spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        height: 50,
    },
    inputError: {
        borderColor: Colors.danger,
    },
    iconContainer: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        height: '100%',
        color: Colors.text,
        fontSize: 16,
    },
    errorText: {
        color: Colors.danger,
        fontSize: 12,
        marginTop: 2,
        marginLeft: Spacing.md,
    },
});
