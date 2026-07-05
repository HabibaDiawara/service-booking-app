import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackScreenProps } from '@react-navigation/stack';

import type { MainTabParamList } from './MainTabs';
import type { ServicesStackParamList } from './ServicesStack';

export type ServicesListScreenProps = CompositeScreenProps<
  StackScreenProps<ServicesStackParamList, 'ServicesList'>,
  BottomTabScreenProps<MainTabParamList>
>;

export type ServiceDetailScreenProps = CompositeScreenProps<
  StackScreenProps<ServicesStackParamList, 'ServiceDetail'>,
  BottomTabScreenProps<MainTabParamList>
>;
