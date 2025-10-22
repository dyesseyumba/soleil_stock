import type { Product } from '@/store';
import { crudApi } from './crudApi';

const productApi = crudApi<Product>('/products');

export const {
  fetchAll: fetchProducts,
  fetchOne: fetchProduct,
  create: createProduct,
  update: updateProduct,
  remove: deleteProduct,
} = productApi;
