import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AlertSeverity } from "../../app/alerts";

interface Props {
  alert: {
    id: string;
    type: string;
    message: string;
    timestamp: string;
    severity: AlertSeverity;
    isRead?: boolean;
  };
  onPress?: () => void;
}

function timeAgo(iso: string) {
  try {
    const then = new Date(iso).getTime();
    const diff = Date.now() - then;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } catch {
    return iso;
  }
}

const severityColors: Record<AlertSeverity, string> = {
  low: '#34D399',
  medium: '#FBBF24',
  high: '#F87171',
};

export default function AlertItem({ alert, onPress }: Props) {
  const color = severityColors[alert.severity] || '#CBD5E1';

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.sideBar, { backgroundColor: color }]} />

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.leftBadges}>
            <View style={[styles.severityBadge, { borderColor: color }]}> 
              <Text style={[styles.severityText, { color }]}>{alert.severity.toUpperCase()}</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
        </View>

        <Text style={styles.title}>{alert.type}</Text>
        <Text style={styles.message} numberOfLines={2}>{alert.message}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.time}>{timeAgo(alert.timestamp)}</Text>
          {alert.isRead ? <Text style={styles.readLabel}>READ</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  sideBar: {
    width: 6,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  leftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  readLabel: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
});
