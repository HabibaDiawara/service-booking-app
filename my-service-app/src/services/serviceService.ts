import api from '../../api/axios';

export interface Service {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

export async function fetchServices(): Promise<Service[]> {
  const { data } = await api.get<{ services: Service[] }>('/api/services');
  return data.services;
}

export async function fetchService(serviceId: number): Promise<Service> {
  const { data } = await api.get<{ service: Service }>(`/api/services/${serviceId}`);
  return data.service;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}
