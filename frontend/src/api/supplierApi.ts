import type { Supplier } from '@/store';
import { crudApi } from './crudApi';

export const supplierApi = crudApi<Supplier>('/suppliers');

export const {
  fetchAll: fetchSuppliers,
  fetchOne: fetchSupplier,
  create: createSupplier,
  update: updateSupplier,
  remove: deleteSupplier,
} = supplierApi;
