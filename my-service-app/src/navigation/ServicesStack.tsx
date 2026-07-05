import { createStackNavigator } from '@react-navigation/stack';

import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { ServicesScreen } from '../screens/ServicesScreen';

export type ServicesStackParamList = {
  ServicesList: undefined;
  ServiceDetail: { serviceId: number };
};

const Stack = createStackNavigator<ServicesStackParamList>();

export function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServicesList" component={ServicesScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    </Stack.Navigator>
  );
}
