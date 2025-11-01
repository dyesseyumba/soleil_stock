import type { Sale } from '@/store';
import { createCrudHooks } from '.';
import { createSale, deleteSale, fetchSale, fetchSales, updateSale } from '@/api';

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
