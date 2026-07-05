import { StyleSheet, Text, View } from 'react-native';

import { formatBookingDate, type Booking } from '../services/bookingService';
import { formatPrice } from '../services/serviceService';

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
  cancelling?: boolean;
}

export function BookingCard({ booking, onCancel, cancelling }: BookingCardProps) {
  const isCancelled = booking.status === 'cancelled';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.serviceName}>{booking.service?.name ?? 'Service'}</Text>
        <View style={[styles.badge, isCancelled ? styles.badgeCancelled : styles.badgeConfirmed]}>
          <Text style={[styles.badgeText, isCancelled ? styles.badgeTextCancelled : styles.badgeTextConfirmed]}>
            {isCancelled ? 'Cancelled' : 'Confirmed'}
          </Text>
        </View>
      </View>

      <Text style={styles.date}>{formatBookingDate(booking.scheduled_at)}</Text>

      {booking.service ? (
        <Text style={styles.meta}>
          {formatPrice(booking.service.price)} · {booking.service.duration_minutes} min
        </Text>
      ) : null}

      {booking.notes ? <Text style={styles.notes}>{booking.notes}</Text> : null}

      {!isCancelled && onCancel ? (
        <Text
          onPress={cancelling ? undefined : onCancel}
          style={[styles.cancelLink, cancelling ? styles.cancelDisabled : null]}
        >
          {cancelling ? 'Cancelling...' : 'Cancel booking'}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  serviceName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeConfirmed: {
    backgroundColor: '#DCFCE7',
  },
  badgeCancelled: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextConfirmed: {
    color: '#166534',
  },
  badgeTextCancelled: {
    color: '#991B1B',
  },
  date: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  meta: {
    fontSize: 14,
    color: '#6B7280',
  },
  notes: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  cancelLink: {
    marginTop: 4,
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelDisabled: {
    opacity: 0.5,
  },
});
