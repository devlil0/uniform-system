import { z } from 'zod';

export const clienteSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um número positivo'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  contato: z.string().min(1, 'Contato é obrigatório'),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;
