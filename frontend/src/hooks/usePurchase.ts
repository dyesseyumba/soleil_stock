import type { Purchase } from '@/store';
import { createCrudHooks } from '.';
import { createPurchase, deletePurchase, fetchPurchase, fetchPurchases, updatePurchase } from '@/api';

export const {
  useList: usePurchases,
  useItem: usePurchase,
  useCreate: useCreatePurchase,
  useUpdate: useUpdatePurchase,
  useDelete: useDeletePurchase,
} = createCrudHooks<Purchase, Omit<Purchase, 'id'>, Partial<Purchase>>({
  key: 'purchases',
  fetchAll: fetchPurchases,
  fetchOne: fetchPurchase,
  create: createPurchase, // expects Omit<Purchase, 'id'>
  update: (id, data) => updatePurchase(id, data), // expects Partial<Purchase>
  remove: deletePurchase,
});
