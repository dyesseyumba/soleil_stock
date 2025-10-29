
import {
  fetchSuppliers,
  fetchSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '@/api';
import type { Supplier } from '@/store';
import { createCrudHooks } from '.';

export const {
  useList: useSuppliers,
  useItem: useSupplier,
  useCreate: useCreateSupplier,
  useUpdate: useUpdateSupplier,
  useDelete: useDeleteSupplier,
} = createCrudHooks<Supplier, Omit<Supplier, 'id'>, Partial<Supplier>>({
  key: 'suppliers',
  fetchAll: fetchSuppliers,
  fetchOne: fetchSupplier,
  create: createSupplier, // expects Omit<Supplier, 'id'>
  update: (id, data) => updateSupplier(id, data), // expects Partial<Supplier>
  remove: deleteSupplier,
});
