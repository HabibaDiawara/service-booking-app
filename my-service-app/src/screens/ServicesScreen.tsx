import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { EmptyState, SafeScreen, ScreenHeader, ServiceCard } from '../components';
import type { ServicesListScreenProps } from '../navigation/types';
import { getApiErrorMessage } from '../services/apiErrors';
import { fetchServices, type Service } from '../services/serviceService';

export function ServicesScreen({ navigation }: ServicesListScreenProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load services.'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  if (isLoading) {
    return (
      <SafeScreen edges={['top']} style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={['top']}>
      <ScreenHeader
        title="Services"
        subtitle="Browse available services and book an appointment."
      />

      {error ? (
        <EmptyState title="Could not load services" message={error} />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadServices(true)} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No services yet"
              message="Services will appear here once they are added to the catalog."
            />
          }
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
            />
          )}
        />
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
});
