import { z } from 'zod';

export const pedidoSchema = z.object({
  clienteId: z.coerce.number().int().positive('Selecione um cliente'),
  status: z.string().min(1, 'Selecione um status'),
});

export type PedidoFormValues = z.infer<typeof pedidoSchema>;
