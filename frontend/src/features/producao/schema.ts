import { z } from 'zod';

export const producaoSchema = z.object({
  pedidoId: z.coerce.number().int().positive('Selecione um pedido'),
  costureiraId: z.coerce.number().int().positive('Selecione uma costureira'),
  etapa: z.string().min(1, 'Selecione uma etapa'),
  entrada: z.string().optional(),
  saida: z.string().optional(),
});

export type ProducaoFormValues = z.infer<typeof producaoSchema>;
