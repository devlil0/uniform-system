import { apiClient } from '@/lib/api-client';
import { FardoRequest, FardoResponse } from '@/types/api';

export const listFardos = async (): Promise<FardoResponse[]> => {
  const { data } = await apiClient.get<FardoResponse[]>('/api/fardo');
  return data;
};

export const getFardo = async (id: number): Promise<FardoResponse> => {
  const { data } = await apiClient.get<FardoResponse>(`/api/fardo/${id}`);
  return data;
};

export const createFardo = async (body: FardoRequest): Promise<FardoResponse> => {
  const { data } = await apiClient.post<FardoResponse>('/api/fardo', body);
  return data;
};

export const updateFardo = async (id: number, body: FardoRequest): Promise<FardoResponse> => {
  const { data } = await apiClient.put<FardoResponse>(`/api/fardo/${id}`, body);
  return data;
};

export const deleteFardo = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/fardo/${id}`);
};
