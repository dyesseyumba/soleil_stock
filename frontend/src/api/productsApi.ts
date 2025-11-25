import type { Product } from '@/store';
import { crudApi } from './crudApi';
import { axiosClient } from './axiosClient';

const productApi = crudApi<Product>('/products');

async function fetchTotalStock(): Promise<{ totalStock: number }> {
  const { data } = await axiosClient.get<{ totalStock: number }>('/stocks/total-stock');
  return data;
}

async function fetchTotalValue(): Promise<{ totalStockValue: number }> {
  const { data } = await axiosClient.get<{ totalStockValue: number }>('/stocks/total-stock-value');
  return data;
}

async function fetchTotalOutOfStock(): Promise<{ totalOutOfStock: number }> {
  const { data } = await axiosClient.get<{ totalOutOfStock: number }>('/stocks/out-of-stock');
  return data;
}

async function fetchTotalExpiring(): Promise<{ totalExpiring: number }> {
  const { data } = await axiosClient.get<{ totalExpiring: number }>('/stocks/expiring-soon');
  return data;
}

export const {
  fetchAll: fetchProducts,
  fetchOne: fetchProduct,
  create: createProduct,
  update: updateProduct,
  remove: deleteProduct,
} = productApi;

export { fetchTotalStock, fetchTotalValue, fetchTotalOutOfStock, fetchTotalExpiring };
