import type { Product } from '@/pages';
import { create } from 'zustand';

interface ProductModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingProduct?: Product | null;
  openAdd: () => void;
  openEdit: (product: Product) => void;
  close: () => void;
}

const useProductModalStore = create<ProductModalState>((set) => ({
  isOpen: false,
  mode: 'add',
  editingProduct: null,
  openAdd: () => set({ isOpen: true, mode: 'add', editingProduct: null }),
  openEdit: (product) => set({ isOpen: true, mode: 'edit', editingProduct: product }),
  close: () => set({ isOpen: false, editingProduct: null }),
}));

export { useProductModalStore };
export type { ProductModalState };
