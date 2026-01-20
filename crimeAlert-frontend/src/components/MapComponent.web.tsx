import React from 'react';
import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Colors } from '../styles/theme';

export const Map = ({ style, children }: any) => (
    <View style={[style, { backgroundColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center' }]}>
        <MapPin size={40} color={Colors.primary} />
        <Text style={{ marginTop: 10, color: Colors.secondary, fontWeight: '600' }}>Map Preview (Web)</Text>
        <Text style={{ fontSize: 12, color: Colors.secondary }}>[Map fully functional on iOS/Android]</Text>
        {children}
    </View>
);

export const MapMarker = ({ children }: any) => <View>{children}</View>;
export const MapCircle = () => null;
export const MapHeatmap = () => null;

export default Map;
