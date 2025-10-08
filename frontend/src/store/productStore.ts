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

const useProductStore = create<ProductState>(
  (set) => ({
    products: [],
    searchQuery: '',
    selectedProductId: undefined,
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedProduct: (id) => set({ selectedProductId: id }),
    reset: () => set({ searchQuery: '', selectedProductId: undefined }),
  })
);

export { useProductStore };
export type { ProductState };
