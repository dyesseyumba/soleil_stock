import { z } from 'zod';

const saleCreateSchema = z.object({
  productId: z.string().nonempty('Vous devez sélectionner un produit'),
  quantity: z.number().min(1, 'La quantité doit être supérieur à 0'),
  soldAt: z.date().optional(),
});

type CreateSaleInput = z.infer<typeof saleCreateSchema>;
type UpdateSaleInput = Partial<CreateSaleInput>;

export type { CreateSaleInput, UpdateSaleInput };
export { saleCreateSchema };
