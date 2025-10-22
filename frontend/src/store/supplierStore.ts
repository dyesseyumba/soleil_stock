import type { Product } from '@/pages';
import { create } from 'zustand';

interface Supplier {
  id: string;
  name: string;
  contactInfo: string;
}

interface SupplierModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingProduct?: Product | null;
  openAdd: () => void;
  openEdit: (product: Product) => void;
  close: () => void;
}

const useSupplierModalStore = create<SupplierModalState>((set) => ({
  isOpen: false,
  mode: 'add',
  editingProduct: null,
  openAdd: () => set({ isOpen: true, mode: 'add', editingProduct: null }),
  openEdit: (product) => set({ isOpen: true, mode: 'edit', editingProduct: product }),
  close: () => set({ isOpen: false, editingProduct: null }),
}));

export { useSupplierModalStore };
export type { SupplierModalState, Supplier };
