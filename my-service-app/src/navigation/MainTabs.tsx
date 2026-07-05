import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingsScreen } from '../screens/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ServicesStack } from './ServicesStack';

export type MainTabParamList = {
  ServicesTab: undefined;
  BookingsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={[styles.label, focused ? styles.labelFocused : null]}>{label}</Text>;
}

export function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 56 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen
        name="ServicesTab"
        component={ServicesStack}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Services" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.icon, focused ? styles.iconFocused : null]} />
          ),
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Bookings" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.icon, focused ? styles.iconFocused : null]} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.icon, focused ? styles.iconFocused : null]} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  labelFocused: {
    color: '#2563EB',
  },
  icon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  iconFocused: {
    backgroundColor: '#2563EB',
  },
});
