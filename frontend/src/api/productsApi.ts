import type { Product } from '@/store';
import { axiosClient } from './axiosClient';

async function fetchProducts(): Promise<Product[]> {
  const { data } = await axiosClient.get<Product[]>('/products');
  return data;
}

async function fetchProduct(id: string): Promise<Product> {
  const { data } = await axiosClient.get<Product>(`/products/${id}`);
  return data;
}

async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const { data } = await axiosClient.post<Product>('/products', product);
  return data;
}

async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const { data } = await axiosClient.put<Product>(`/products/${id}`, product);
  return data;
}

async function deleteProduct(id: string): Promise<void> {
  await axiosClient.delete(`/products/${id}`);
}

export { fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct };
