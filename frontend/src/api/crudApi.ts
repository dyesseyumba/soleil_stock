import { axiosClient } from './axiosClient';

/**
 * Generic CRUD API factory
 * @param endpoint The base API endpoint (e.g. '/products')
 */
function crudApi<T>(endpoint: string) {
  return {
    async fetchAll(): Promise<T[]> {
      const { data } = await axiosClient.get<T[]>(endpoint);
      return data;
    },

    async fetchOne(id: string): Promise<T> {
      const { data } = await axiosClient.get<T>(`${endpoint}/${id}`);
      return data;
    },

    async create(item: Omit<T, 'id'>): Promise<T> {
      const { data } = await axiosClient.post<T>(endpoint, item);
      return data;
    },

    async update(id: string, item: Partial<T>): Promise<T> {
      const { data } = await axiosClient.put<T>(`${endpoint}/${id}`, item);
      return data;
    },

    async remove(id: string): Promise<void> {
      await axiosClient.delete(`${endpoint}/${id}`);
    },
  };
}

export { crudApi };
