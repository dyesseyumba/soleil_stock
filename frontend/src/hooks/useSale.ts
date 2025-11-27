import type { Sale } from '@/store';
import { createCrudHooks } from '.';
import {
  createSale,
  deleteSale,
  fetchMonthlySales,
  fetchPurchasesSales,
  fetchSale,
  fetchSales,
  fetchTopSales,
  updateSale,
} from '@/api';
import { useQuery } from '@tanstack/react-query';

function useMonthlySales() {
  return useQuery<{ month: string; sales: number }[], Error>({
    queryKey: ['monthlySales'],
    queryFn: () => fetchMonthlySales(),
  });
}

function usePurchasesSales() {
  return useQuery<{ month: string; purchases: string; sales: number }[], Error>({
    queryKey: ['purchasesSales'],
    queryFn: () => fetchPurchasesSales(),
  });
}

function useTopSales() {
  return useQuery<{ name: string; sold: number }[], Error>({
    queryKey: ['topSales'],
    queryFn: () => fetchTopSales(),
  });
}

export const {
  useList: useSales,
  useItem: useSale,
  useCreate: useCreateSale,
  useUpdate: useUpdateSale,
  useDelete: useDeleteSale,
} = createCrudHooks<Sale, Omit<Sale, 'id'>, Partial<Sale>>({
  key: 'sales',
  fetchAll: fetchSales,
  fetchOne: fetchSale,
  create: createSale, // expects Omit<Sale, 'id'>
  update: (id, data) => updateSale(id, data), // expects Partial<Sale>
  remove: deleteSale,
});

export { useMonthlySales, usePurchasesSales, useTopSales };
