import { apiClient } from '@/lib/api-client';
import { ItemPedidoRequest, ItemPedidoResponse } from '@/types/api';

export const listItensPedido = async (): Promise<ItemPedidoResponse[]> => {
  const { data } = await apiClient.get<ItemPedidoResponse[]>('/api/item-pedido');
  return data;
};

export const getItemPedido = async (id: number): Promise<ItemPedidoResponse> => {
  const { data } = await apiClient.get<ItemPedidoResponse>(`/api/item-pedido/${id}`);
  return data;
};

export const createItemPedido = async (body: ItemPedidoRequest): Promise<ItemPedidoResponse> => {
  const { data } = await apiClient.post<ItemPedidoResponse>('/api/item-pedido', body);
  return data;
};

export const updateItemPedido = async (id: number, body: ItemPedidoRequest): Promise<ItemPedidoResponse> => {
  const { data } = await apiClient.put<ItemPedidoResponse>(`/api/item-pedido/${id}`, body);
  return data;
};

export const deleteItemPedido = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/item-pedido/${id}`);
};
