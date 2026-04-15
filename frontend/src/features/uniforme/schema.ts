import { z } from 'zod';

export const uniformeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  malha: z.string().min(1, 'Malha é obrigatória'),
  tamanho: z.string().min(1, 'Tamanho é obrigatório'),
  refletivo: z.string().min(1, 'Refletivo é obrigatório'),
  cor: z.string().min(1, 'Cor é obrigatória'),
});

export type UniformeFormValues = z.infer<typeof uniformeSchema>;
