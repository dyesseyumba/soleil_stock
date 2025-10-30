import { modalStore } from './modalStore';

interface Purchase {
  id: string;
  productId: string;
  productName?: string;
  supplierId: string;
  supplierName?: string;
  quantity: number;
  unitCost: number;
  expirationDate?: Date;
}

const usePurchaseModalStore = modalStore<Purchase>();

export { usePurchaseModalStore };
export type { Purchase };
