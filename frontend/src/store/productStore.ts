import { modalStore } from './modalStore';

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  availableQuantity?: number;
  nextToExpire?: Date;
  totalValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  purchases?: [];
  sales?: [];
  prices?: [];
  StockSummary?: [];
}

const useProductModalStore = modalStore<Product>();

export { useProductModalStore };
export type { Product };
