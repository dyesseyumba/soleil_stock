import { z } from 'zod';

const productPriceCreateSchema = z.object({
  productId: z.string().nonempty('Vous devez sélectionner un produit'),
  price: z.number().min(1, 'Veuillez entrer le prix unitaire'),
  effectiveAt: z.date('Veuillez entrer une date'),
});

type CreateProductPriceInput = z.infer<typeof productPriceCreateSchema>;
type UpdateProductPriceInput = Partial<CreateProductPriceInput>;

export type { CreateProductPriceInput, UpdateProductPriceInput };
export { productPriceCreateSchema };
