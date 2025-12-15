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

type ReportRow = {
  id?: string;
  product: string;
  sold: number;
  revenue: number;
  cost: number;
  profit: number;
};

type ReportFilters = {
  product?: string;
  fromDate?: string; // ISO string e.g. "2025-12-01"
  toDate?: string; // ISO string e.g. "2025-12-31"
};

const useProductModalStore = modalStore<Product>();

export { useProductModalStore };
export type { Product, ReportRow, ReportFilters };
