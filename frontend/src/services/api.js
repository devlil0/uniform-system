const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = 'Nao foi possivel concluir a requisicao.';

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch (error) {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getApiUrl() {
    return API_URL;
  },
  getClientes() {
    return request('/api/cliente');
  },
  createCliente(payload) {
    return request('/api/cliente', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteCliente(id) {
    return request(`/api/cliente/${id}`, { method: 'DELETE' });
  },
  getPedidos() {
    return request('/api/pedido');
  },
  createPedido(payload) {
    return request('/api/pedido', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updatePedido(id, payload) {
    return request(`/api/pedido/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deletePedido(id) {
    return request(`/api/pedido/${id}`, { method: 'DELETE' });
  },
  getItensPedido() {
    return request('/api/item-pedido');
  },
  createItemPedido(payload) {
    return request('/api/item-pedido', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteItemPedido(id) {
    return request(`/api/item-pedido/${id}`, { method: 'DELETE' });
  },
  getProducao() {
    return request('/api/producao');
  },
  createProducao(payload) {
    return request('/api/producao', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateProducao(id, payload) {
    return request(`/api/producao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteProducao(id) {
    return request(`/api/producao/${id}`, { method: 'DELETE' });
  },
  getFardos() {
    return request('/api/fardo');
  },
  createFardo(payload) {
    return request('/api/fardo', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteFardo(id) {
    return request(`/api/fardo/${id}`, { method: 'DELETE' });
  },
  getEntregas() {
    return request('/api/entrega');
  },
  createEntrega(payload) {
    return request('/api/entrega', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateEntrega(id, payload) {
    return request(`/api/entrega/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteEntrega(id) {
    return request(`/api/entrega/${id}`, { method: 'DELETE' });
  },
  getUniformes() {
    return request('/api/uniforme');
  },
  createUniforme(payload) {
    return request('/api/uniforme', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteUniforme(id) {
    return request(`/api/uniforme/${id}`, { method: 'DELETE' });
  },
  getEnums() {
    return request('/api/enums');
  },
  getCostureiras() {
    return request('/api/costureira');
  },
  createCostureira(payload) {
    return request('/api/costureira', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteCostureira(id) {
    return request(`/api/costureira/${id}`, { method: 'DELETE' });
  },
  getEntregadores() {
    return request('/api/entregador');
  },
  createEntregador(payload) {
    return request('/api/entregador', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteEntregador(id) {
    return request(`/api/entregador/${id}`, { method: 'DELETE' });
  },
  getEstoque() {
    return request('/api/estoque');
  },
  createEstoque(payload) {
    return request('/api/estoque', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteEstoque(id) {
    return request(`/api/estoque/${id}`, { method: 'DELETE' });
  },
};
