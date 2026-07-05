import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { FormInput, PrimaryButton, SafeScreen, ScreenHeader } from '../components';
import type { ServiceDetailScreenProps } from '../navigation/types';
import { getApiErrorMessage } from '../services/apiErrors';
import { createBooking } from '../services/bookingService';
import {
  fetchService,
  formatDuration,
  formatPrice,
  type Service,
} from '../services/serviceService';

export function ServiceDetailScreen({ navigation, route }: ServiceDetailScreenProps) {
  const { serviceId } = route.params;
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [scheduledAt, setScheduledAt] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(10, 0, 0, 0);
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadService() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchService(serviceId);
        if (isMounted) {
          setService(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err, 'Could not load service details.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadService();

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  function handleDateChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'dismissed' || !date) {
      return;
    }

    setScheduledAt((current) => {
      const next = new Date(current);
      next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return next;
    });
  }

  function handleTimeChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (event.type === 'dismissed' || !date) {
      return;
    }

    setScheduledAt((current) => {
      const next = new Date(current);
      next.setHours(date.getHours(), date.getMinutes(), 0, 0);
      return next;
    });
  }

  async function handleBook() {
    if (!service) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createBooking({
        service_id: service.id,
        scheduled_at: scheduledAt.toISOString(),
        notes: notes.trim() || undefined,
      });

      navigation.navigate('BookingsTab');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not create booking.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <SafeScreen edges={['top']} style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeScreen>
    );
  }

  if (!service) {
    return (
      <SafeScreen edges={['top']}>
        <ScreenHeader title="Service" onBack={() => navigation.goBack()} />
        <Text style={styles.errorText}>{error ?? 'Service not found.'}</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={['top']}>
      <ScreenHeader title={service.name} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.description}>{service.description}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{formatPrice(service.price)}</Text>
          <Text style={styles.meta}>{formatDuration(service.duration_minutes)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment date</Text>
          <Pressable style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.pickerButtonText}>{scheduledAt.toLocaleDateString()}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment time</Text>
          <Pressable style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.pickerButtonText}>
              {scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Pressable>
        </View>

        <FormInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special instructions..."
          multiline
          style={styles.notesInput}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton title="Book appointment" onPress={handleBook} loading={isSubmitting} />
      </ScrollView>

      {showDatePicker ? (
        <DateTimePicker
          value={scheduledAt}
          mode="date"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      ) : null}

      {showTimePicker ? (
        <DateTimePicker value={scheduledAt} mode="time" onChange={handleTimeChange} />
      ) : null}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  meta: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  notesInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
});
