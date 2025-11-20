import { modalStore } from './modalStore';

interface Sale {
  id: string;
  productId: string;
  productName?: string;
  activePrice?: number;
  quantity: number;
  soldAt?: Date;
}

const useSaleModalStore = modalStore<Sale>();

export { useSaleModalStore };
export type { Sale };
