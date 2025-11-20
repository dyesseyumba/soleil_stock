import { z } from 'zod';

const purchaseCreateSchema = z.object({
  productId: z.string().nonempty('Vous devez sélectionner un produit'),
  // productName: z
  //   .string()
  //   .min(2, 'Le nom du produit doit avoir au moins 2 caractère')
  //   .max(255, 'Le nom ne doit pas avoir plus de 255 caractère'),
  supplierId: z.string().nonempty('Vous devez sélectionner un fournisseur'),
  // supplierName: z.string().min(2, 'Le nom du fournisseur doit avoir au moins 2 caractère'),
  quantity: z.number().min(1, 'La quantité doit être supérieur à 0'),
  unitCost: z.number().min(1, 'Veuillez entrer le prix unitaire'),
  expirationDate: z.date().optional(),
});

type CreatePurchaseInput = z.infer<typeof purchaseCreateSchema>;
type UpdatePurchaseInput = Partial<CreatePurchaseInput>;

export type { CreatePurchaseInput, UpdatePurchaseInput };
export { purchaseCreateSchema };
