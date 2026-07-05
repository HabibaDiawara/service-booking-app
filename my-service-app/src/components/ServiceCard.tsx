import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDuration, formatPrice, type Service } from '../services/serviceService';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.price}>{formatPrice(service.price)}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {service.description}
      </Text>
      <Text style={styles.meta}>{formatDuration(service.duration_minutes)}</Text>
    </Pressable>
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
  cardPressed: {
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
