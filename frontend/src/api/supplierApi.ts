
import type { Supplier } from '@/store';
import { axiosClient } from './axiosClient';

async function fetchSuppliers(): Promise<Supplier[]> {
  const { data } = await axiosClient.get<Supplier[]>('/suppliers');
  return data;
}

async function fetchSupplier(id: string): Promise<Supplier> {
  const { data } = await axiosClient.get<Supplier>(`/suppliers/${id}`);
  return data;
}

async function createSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
  const { data } = await axiosClient.post<Supplier>('/suppliers', supplier);
  return data;
}

async function updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
  const { data } = await axiosClient.put<Supplier>(`/suppliers/${id}`, supplier);
  return data;
}

async function deleteSupplier(id: string): Promise<void> {
  await axiosClient.delete(`/suppliers/${id}`);
}

export { fetchSuppliers, fetchSupplier, createSupplier, updateSupplier, deleteSupplier };
