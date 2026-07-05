import api from '../../api/axios';

export type BookingStatus = 'confirmed' | 'cancelled';

export interface BookingServiceSummary {
  id: number;
  name: string;
  duration_minutes: number;
  price: number;
}

export interface Booking {
  id: number;
  service_id: number;
  scheduled_at: string;
  status: BookingStatus;
  notes: string | null;
  service: BookingServiceSummary | null;
}

export interface CreateBookingPayload {
  service_id: number;
  scheduled_at: string;
  notes?: string;
}

export async function fetchBookings(): Promise<Booking[]> {
  const { data } = await api.get<{ bookings: Booking[] }>('/api/bookings');
  return data.bookings;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await api.post<{ booking: Booking }>('/api/bookings', payload);
  return data.booking;
}

export async function cancelBooking(bookingId: number): Promise<Booking> {
  const { data } = await api.patch<{ booking: Booking }>(`/api/bookings/${bookingId}`, {
    status: 'cancelled',
  });
  return data.booking;
}

export function formatBookingDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function isUpcoming(booking: Booking): boolean {
  return booking.status === 'confirmed' && new Date(booking.scheduled_at) > new Date();
}
