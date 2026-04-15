import { apiClient } from '@/lib/api-client';
import { EstoqueRequest, EstoqueResponse } from '@/types/api';

export const listEstoque = async (): Promise<EstoqueResponse[]> => {
  const { data } = await apiClient.get<EstoqueResponse[]>('/api/estoque');
  return data;
};

export const getEstoque = async (id: number): Promise<EstoqueResponse> => {
  const { data } = await apiClient.get<EstoqueResponse>(`/api/estoque/${id}`);
  return data;
};

export const createEstoque = async (body: EstoqueRequest): Promise<EstoqueResponse> => {
  const { data } = await apiClient.post<EstoqueResponse>('/api/estoque', body);
  return data;
};

export const updateEstoque = async (id: number, body: EstoqueRequest): Promise<EstoqueResponse> => {
  const { data } = await apiClient.put<EstoqueResponse>(`/api/estoque/${id}`, body);
  return data;
};

export const deleteEstoque = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/estoque/${id}`);
};
