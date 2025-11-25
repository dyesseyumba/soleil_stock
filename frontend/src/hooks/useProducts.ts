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
} from '@/api';
import type { Product } from '@/store';
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

export { useTotalStocks, useTotalValue, useTotalOutOfStock, useTotalExpiring };
