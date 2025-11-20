import type { Sale } from '@/store';
import { crudApi } from './crudApi';

const saleApi = crudApi<Sale>('/sales');

export const {
  fetchAll: fetchSales,
  fetchOne: fetchSale,
  create: createSale,
  update: updateSale,
  remove: deleteSale,
} = saleApi;
