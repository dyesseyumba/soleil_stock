import { z } from 'zod';

const loginSchema = z.object({
  email: z.email("L'email est obligatoire"),
  password: z.string('Le mot de passe est obligatoire'),
});

type LoginInput = z.infer<typeof loginSchema>;

export type { LoginInput };
export { loginSchema };
