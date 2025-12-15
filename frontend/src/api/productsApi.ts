import type { Product, ReportFilters, ReportRow } from '@/store';
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

async function fetchAlerts(): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>('/stocks/alerts');
  return data;
}

async function fetchActivities(): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>('/stocks/recent-activity');
  return data;
}

async function fetchReport(filters: ReportFilters = {}): Promise<ReportRow[]> {
  const params: Record<string, string> = {};
  if (filters.product) params.product = filters.product;
  if (filters.fromDate) params.fromDate = filters.fromDate;
  if (filters.toDate) params.toDate = filters.toDate;

  const { data } = await axiosClient.get<ReportRow[]>('/products/report', { params });
  return data;
}

export const {
  fetchAll: fetchProducts,
  fetchOne: fetchProduct,
  create: createProduct,
  update: updateProduct,
  remove: deleteProduct,
} = productApi;

export {
  fetchTotalStock,
  fetchTotalValue,
  fetchTotalOutOfStock,
  fetchTotalExpiring,
  fetchAlerts,
  fetchActivities,
  fetchReport,
};

