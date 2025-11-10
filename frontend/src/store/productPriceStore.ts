interface ProductPrice {
  id: string;
  productId: string;
  productName?: string;
  price: number;
  status?: string;
  effectiveAt: Date;
}

export type { ProductPrice };
