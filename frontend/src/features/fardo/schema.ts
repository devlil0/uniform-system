import { z } from 'zod';

export const fardoSchema = z.object({
  pedidoId: z.coerce.number().int().positive('Selecione um pedido'),
  entregadorId: z.coerce.number().int().positive('Selecione um entregador'),
  dataEnvio: z.string().min(1, 'Data de envio é obrigatória'),
});

export type FardoFormValues = z.infer<typeof fardoSchema>;
