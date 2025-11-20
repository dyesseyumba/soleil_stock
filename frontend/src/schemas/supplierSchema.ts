import { z } from 'zod';

const supplierCreateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  contactInfo: z
    .string()
    .min(9, 'le téléphone doit avoir au moins 9 caractère')
    .max(15, 'Le numéro de téléphone doit avoir au plus 10 caractère')
    .regex(/^\+?[0-9]{9,15}$/, 'Le format du numéro de téléphone est invalide'),
});

type CreateSupplierInput = z.infer<typeof supplierCreateSchema>;
type UpdateSupplierInput = Partial<CreateSupplierInput>;

export type { CreateSupplierInput, UpdateSupplierInput };
export { supplierCreateSchema };
