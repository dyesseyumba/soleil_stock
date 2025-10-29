
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/api';
import type { Product } from '@/store';
import { createCrudHooks } from '.';

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
