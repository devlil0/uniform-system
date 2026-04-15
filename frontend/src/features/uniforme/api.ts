import { apiClient } from '@/lib/api-client';
import { UniformeRequest, UniformeResponse } from '@/types/api';

export const listUniformes = async (): Promise<UniformeResponse[]> => {
  const { data } = await apiClient.get<UniformeResponse[]>('/api/uniforme');
  return data;
};

export const getUniforme = async (id: number): Promise<UniformeResponse> => {
  const { data } = await apiClient.get<UniformeResponse>(`/api/uniforme/${id}`);
  return data;
};

export const createUniforme = async (body: UniformeRequest): Promise<UniformeResponse> => {
  const { data } = await apiClient.post<UniformeResponse>('/api/uniforme', body);
  return data;
};

export const updateUniforme = async (id: number, body: UniformeRequest): Promise<UniformeResponse> => {
  const { data } = await apiClient.put<UniformeResponse>(`/api/uniforme/${id}`, body);
  return data;
};

export const deleteUniforme = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/uniforme/${id}`);
};
