import axios from 'axios';
import { toast } from 'sonner';

export interface NotFoundNavigationDetail {
  resourcePath: string;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status;
    const message: string = error.response?.data?.message ?? 'Erro inesperado';

    if (status && status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente.');
      console.error('API 5xx:', error);
    } else if (status === 404) {
      toast.error('Recurso não encontrado.');
      const resourcePath = String(error.config?.url ?? '');
      window.dispatchEvent(new CustomEvent<NotFoundNavigationDetail>('app:not-found', {
        detail: { resourcePath },
      }));
    } else if (status && status >= 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
