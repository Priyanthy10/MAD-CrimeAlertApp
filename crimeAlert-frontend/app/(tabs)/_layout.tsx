import { Tabs } from 'expo-router';
import { Home, AlertCircle, MapPin, Settings } from 'lucide-react-native';
import { Colors } from '../../src/styles/theme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.secondary,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopWidth: 1,
                    borderTopColor: Colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="alerts"
                options={{
                    title: 'Alerts',
                    tabBarIcon: ({ color, size }) => (
                        <AlertCircle size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="zones"
                options={{
                    title: 'Zones',
                    tabBarIcon: ({ color, size }) => (
                        <MapPin size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Settings size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
