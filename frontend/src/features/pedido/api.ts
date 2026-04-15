import { apiClient } from '@/lib/api-client';
import { PedidoRequest, PedidoResponse } from '@/types/api';

export const listPedidos = async (): Promise<PedidoResponse[]> => {
  const { data } = await apiClient.get<PedidoResponse[]>('/api/pedido');
  return data;
};

export const getPedido = async (id: number): Promise<PedidoResponse> => {
  const { data } = await apiClient.get<PedidoResponse>(`/api/pedido/${id}`);
  return data;
};

export const createPedido = async (body: PedidoRequest): Promise<PedidoResponse> => {
  const { data } = await apiClient.post<PedidoResponse>('/api/pedido', body);
  return data;
};

export const updatePedido = async (id: number, body: PedidoRequest): Promise<PedidoResponse> => {
  const { data } = await apiClient.put<PedidoResponse>(`/api/pedido/${id}`, body);
  return data;
};

export const deletePedido = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/pedido/${id}`);
};
