import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchTotalStock,
  fetchTotalValue,
  fetchTotalOutOfStock,
  fetchTotalExpiring,
  fetchAlerts,
  fetchActivities,
  fetchReport,
} from '@/api';
import type { Product, ReportFilters, ReportRow } from '@/store';
import { createCrudHooks } from '.';
import { useQuery } from '@tanstack/react-query';

function useTotalStocks() {
  return useQuery<{ totalStock: number }, Error>({
    queryKey: ['totalStock'],
    queryFn: () => fetchTotalStock(),
  });
}

function useTotalValue() {
  return useQuery<{ totalStockValue: number }, Error>({
    queryKey: ['totalStockValue'],
    queryFn: () => fetchTotalValue(),
  });
}

function useTotalOutOfStock() {
  return useQuery<{ totalOutOfStock: number }, Error>({
    queryKey: ['totalOutOfStock'],
    queryFn: () => fetchTotalOutOfStock(),
  });
}

function useTotalExpiring() {
  return useQuery<{ totalExpiring: number }, Error>({
    queryKey: ['totalExpiring'],
    queryFn: () => fetchTotalExpiring(),
  });
}

function useAlerts() {
  return useQuery<string[], Error>({
    queryKey: ['stockAlert'],
    queryFn: () => fetchAlerts(),
  });
}

function useActivities() {
  return useQuery<string[], Error>({
    queryKey: ['stockActivities'],
    queryFn: () => fetchActivities(),
  });
}

function useReport(filters: ReportFilters = {}) {
  return useQuery<ReportRow[], Error>({
    queryKey: ['report', filters],
    queryFn: () => fetchReport(filters),
    // placeholderData: (previousData) => previousData, // smooth UX when changing filters
  });
}

export const {
  useList: useProducts,
  useItem: useProduct,
  useCreate: useCreateProduct,
  useUpdate: useUpdateProduct,
  useDelete: useDeleteProduct,
} = createCrudHooks<Product, Omit<Product, 'id'>, Partial<Product>>({
  key: 'products',
  fetchAll: fetchProducts,
  fetchOne: fetchProduct,
  create: createProduct, // expects Omit<Product, 'id'>
  update: (id, data) => updateProduct(id, data), // expects Partial<Product>
  remove: deleteProduct,
});

export {
  useTotalStocks,
  useTotalValue,
  useTotalOutOfStock,
  useTotalExpiring,
  useAlerts,
  useActivities,
  useReport,
};
