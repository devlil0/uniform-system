import { apiClient } from '@/lib/api-client';
import { CostureiraRequest, CostureiraResponse } from '@/types/api';

export const listCostureiras = async (): Promise<CostureiraResponse[]> => {
  const { data } = await apiClient.get<CostureiraResponse[]>('/api/costureira');
  return data;
};

export const getCostureira = async (id: number): Promise<CostureiraResponse> => {
  const { data } = await apiClient.get<CostureiraResponse>(`/api/costureira/${id}`);
  return data;
};

export const createCostureira = async (body: CostureiraRequest): Promise<CostureiraResponse> => {
  const { data } = await apiClient.post<CostureiraResponse>('/api/costureira', body);
  return data;
};

export const updateCostureira = async (id: number, body: CostureiraRequest): Promise<CostureiraResponse> => {
  const { data } = await apiClient.put<CostureiraResponse>(`/api/costureira/${id}`, body);
  return data;
};

export const deleteCostureira = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/costureira/${id}`);
};
