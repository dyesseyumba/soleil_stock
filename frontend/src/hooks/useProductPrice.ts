import type { ProductPrice } from '@/store';
import { createCrudHooks } from '.';
import {
  createProductPrice,
  deleteProductPrice,
  fetchAllActivePrice,
  fetchAllByProductId,
  fetchProductPrice,
  fetchProductPrices,
  updateProductPrice,
} from '@/api';
import { useQuery } from '@tanstack/react-query';

function usePricesByProductId(id: string) {
  return useQuery<ProductPrice[], Error>({
    queryKey: ['ProductPrices', id],
    queryFn: () => fetchAllByProductId(id),
    enabled: !!id,
  });
}

function useActivePriceByProductId(id: string) {
  return useQuery<ProductPrice, Error>({
    queryKey: ['ProductPrices', id],
    queryFn: () => fetchAllActivePrice(id),
    enabled: !!id,
  });
}

export const {
  useList: useProductPrices,
  useItem: useProductPrice,
  useCreate: useCreateProductPrice,
  useUpdate: useUpdateProductPrice,
  useDelete: useDeleteProductPrice,
} = createCrudHooks<ProductPrice, Omit<ProductPrice, 'id'>, Partial<ProductPrice>>({
  key: 'ProductPrices',
  fetchAll: fetchProductPrices,
  fetchOne: fetchProductPrice,
  create: createProductPrice, // expects Omit<ProductPrice, 'id'>
  update: (id, data) => updateProductPrice(id, data), // expects Partial<ProductPrice>
  remove: deleteProductPrice,
});

export { usePricesByProductId, useActivePriceByProductId };
