import { modalStore } from "./modalStore";

interface ProductPrice {
  id: string;
  productId: string;
  productName?: string;
  price: number;
  status?: string;
  effectiveAt: Date;
}

const useProductPriceModalStore = modalStore<ProductPrice>();

export { useProductPriceModalStore };
export type { ProductPrice };
