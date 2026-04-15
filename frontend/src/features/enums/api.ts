import { apiClient } from '@/lib/api-client';
import { EnumsResponse } from '@/types/api';

export const listEnums = async (): Promise<EnumsResponse> => {
  const { data } = await apiClient.get<EnumsResponse>('/api/enums');
  return data;
};
