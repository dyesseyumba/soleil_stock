import type { Purchase } from '@/store';
import { crudApi } from './crudApi';

const purchaseApi = crudApi<Purchase>('/purchases');

export const {
  fetchAll: fetchPurchases,
  fetchOne: fetchPurchase,
  create: createPurchase,
  update: updatePurchase,
  remove: deletePurchase,
} = purchaseApi;
