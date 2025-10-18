import type { Product } from '@/pages';
import { create } from 'zustand';

interface ProductState {
  products: Product[];
  searchQuery: string;
  selectedProductId?: string;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (id: string | undefined) => void;
  reset: () => void;
}

interface ProductModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  searchQuery: '',
  selectedProductId: undefined,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedProduct: (id) => set({ selectedProductId: id }),
  reset: () => set({ searchQuery: '', selectedProductId: undefined }),
}));

const useProductModalStore = create<ProductModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export { useProductStore, useProductModalStore };
export type { ProductState, ProductModalState };
