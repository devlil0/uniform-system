import { apiClient } from '@/lib/api-client';
import { ProducaoRequest, ProducaoResponse } from '@/types/api';

export const listProducoes = async (): Promise<ProducaoResponse[]> => {
  const { data } = await apiClient.get<ProducaoResponse[]>('/api/producao');
  return data;
};

export const getProducao = async (id: number): Promise<ProducaoResponse> => {
  const { data } = await apiClient.get<ProducaoResponse>(`/api/producao/${id}`);
  return data;
};

export const createProducao = async (body: ProducaoRequest): Promise<ProducaoResponse> => {
  const { data } = await apiClient.post<ProducaoResponse>('/api/producao', body);
  return data;
};

export const updateProducao = async (id: number, body: ProducaoRequest): Promise<ProducaoResponse> => {
  const { data } = await apiClient.put<ProducaoResponse>(`/api/producao/${id}`, body);
  return data;
};

export const deleteProducao = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/producao/${id}`);
};
