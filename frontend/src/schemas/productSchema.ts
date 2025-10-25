import { z } from 'zod';

const productCreateSchema = z.object({
  name: z.string().min(2, 'Le nom est obligatoire'),
  description: z.string().optional().nullable(),
});

type CreateProductInput = z.infer<typeof productCreateSchema>;
type UpdateProductInput = Partial<CreateProductInput>;

export type { CreateProductInput, UpdateProductInput };
export { productCreateSchema };
