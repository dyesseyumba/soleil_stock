import type { Sale } from '@/store';
import { crudApi } from './crudApi';
import { axiosClient } from './axiosClient';

const saleApi = crudApi<Sale>('/sales');

async function fetchMonthlySales(): Promise<{ month: string; sales: number }[]> {
  const { data } = await axiosClient.get<{ month: string; sales: number }[]>('/sales/monthly-sales');
  return data;
}

async function fetchPurchasesSales(): Promise<{ month: string; purchases: string; sales: number }[]> {
  const { data } =
    await axiosClient.get<{ month: string; purchases: string; sales: number }[]>('/sales/purchases-vs-sales');
  return data;
}

async function fetchTopSales(): Promise<{ name: string; sold: number }[]> {
  const { data } = await axiosClient.get<{ name: string; sold: number }[]>('/sales/top-products-sold');
  return data;
}

export const {
  fetchAll: fetchSales,
  fetchOne: fetchSale,
  create: createSale,
  update: updateSale,
  remove: deleteSale,
} = saleApi;

export { fetchMonthlySales, fetchPurchasesSales, fetchTopSales };
