import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { BookingCard, EmptyState, SafeScreen, ScreenHeader } from '../components';
import { getApiErrorMessage } from '../services/apiErrors';
import { cancelBooking, fetchBookings, type Booking } from '../services/bookingService';

export function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadBookings = useCallback(async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load bookings.'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  function confirmCancel(booking: Booking) {
    Alert.alert(
      'Cancel booking',
      `Cancel your appointment for ${booking.service?.name ?? 'this service'}?`,
      [
        { text: 'Keep booking', style: 'cancel' },
        {
          text: 'Cancel booking',
          style: 'destructive',
          onPress: () => handleCancel(booking.id),
        },
      ],
    );
  }

  async function handleCancel(bookingId: number) {
    setCancellingId(bookingId);

    try {
      const updated = await cancelBooking(bookingId);
      setBookings((current) => current.map((item) => (item.id === bookingId ? updated : item)));
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, 'Could not cancel booking.'));
    } finally {
      setCancellingId(null);
    }
  }

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
        title="My bookings"
        subtitle="View upcoming appointments and cancel if needed."
      />

      {error ? (
        <EmptyState title="Could not load bookings" message={error} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadBookings(true)} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No bookings yet"
              message="Browse services and book your first appointment."
            />
          }
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              cancelling={cancellingId === item.id}
              onCancel={item.status === 'confirmed' ? () => confirmCancel(item) : undefined}
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
