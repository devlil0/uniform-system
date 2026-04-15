import { apiClient } from '@/lib/api-client';
import { ClienteRequest, ClienteResponse } from '@/types/api';

export const listClientes = async (): Promise<ClienteResponse[]> => {
  const { data } = await apiClient.get<ClienteResponse[]>('/api/cliente');
  return data;
};

export const getCliente = async (id: number): Promise<ClienteResponse> => {
  const { data } = await apiClient.get<ClienteResponse>(`/api/cliente/${id}`);
  return data;
};

export const createCliente = async (cliente: ClienteRequest): Promise<ClienteResponse> => {
  const { data } = await apiClient.post<ClienteResponse>('/api/cliente', cliente);
  return data;
};

export const updateCliente = async (id: number, cliente: ClienteRequest): Promise<ClienteResponse> => {
  const { data } = await apiClient.put<ClienteResponse>(`/api/cliente/${id}`, cliente);
  return data;
};

export const deleteCliente = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/cliente/${id}`);
};
