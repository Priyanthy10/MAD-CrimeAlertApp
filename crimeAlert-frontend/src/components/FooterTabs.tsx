import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type ActiveTab = 'add' | 'alerts' | 'settings';

interface Props {
  active?: ActiveTab;
}

export default function FooterTabs({ active = 'alerts' }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={() => router.push('/add-zone')}>
        <MaterialIcons
          name="add-circle-outline"
          size={28}
          color={active === 'add' ? '#16A34A' : '#6B7280'}
        />
        <Text style={[styles.label, active === 'add' && styles.activeLabel]}>Add Zone</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push('/alerts')}>
        <MaterialIcons
          name="notifications"
          size={28}
          color={active === 'alerts' ? '#EF4444' : '#6B7280'}
        />
        <Text style={[styles.label, active === 'alerts' && styles.activeLabel]}>Alerts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push('/settings')}>
        <MaterialIcons
          name="settings"
          size={28}
          color={active === 'settings' ? '#0EA5A4' : '#6B7280'}
        />
        <Text style={[styles.label, active === 'settings' && styles.activeLabel]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activeLabel: {
    color: '#111827',
    fontWeight: '700',
  },
});
