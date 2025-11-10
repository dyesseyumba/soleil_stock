import type { ProductPrice } from '@/store';
import { crudApi } from './crudApi';
import { axiosClient } from './axiosClient';

const productPriceApi = crudApi<ProductPrice>('/productPrices');

const fetchAllByProductId = async (productId: string): Promise<ProductPrice[]> => {
  const { data } = await axiosClient.get<ProductPrice[]>(`/productPrices/prices-by-product-id/${productId}`);
  return data;
};

const fetchAllActivePrice = async (productId: string): Promise<ProductPrice> => {
  const { data } = await axiosClient.get<ProductPrice>(`/productPrices/active-price/${productId}`);
  return data;
};

export const {
  fetchAll: fetchProductPrices,
  fetchOne: fetchProductPrice,
  create: createProductPrice,
  update: updateProductPrice,
  remove: deleteProductPrice,
} = productPriceApi;

export { fetchAllByProductId, fetchAllActivePrice };
