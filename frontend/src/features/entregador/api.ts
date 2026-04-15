import { apiClient } from '@/lib/api-client';
import { EntregadorRequest, EntregadorResponse } from '@/types/api';

export const listEntregadores = async (): Promise<EntregadorResponse[]> => {
  const { data } = await apiClient.get<EntregadorResponse[]>('/api/entregador');
  return data;
};

export const getEntregador = async (id: number): Promise<EntregadorResponse> => {
  const { data } = await apiClient.get<EntregadorResponse>(`/api/entregador/${id}`);
  return data;
};

export const createEntregador = async (body: EntregadorRequest): Promise<EntregadorResponse> => {
  const { data } = await apiClient.post<EntregadorResponse>('/api/entregador', body);
  return data;
};

export const updateEntregador = async (id: number, body: EntregadorRequest): Promise<EntregadorResponse> => {
  const { data } = await apiClient.put<EntregadorResponse>(`/api/entregador/${id}`, body);
  return data;
};

export const deleteEntregador = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/entregador/${id}`);
};
