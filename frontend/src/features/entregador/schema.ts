import { z } from 'zod';

export const entregadorSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um número positivo'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
});

export type EntregadorFormValues = z.infer<typeof entregadorSchema>;
