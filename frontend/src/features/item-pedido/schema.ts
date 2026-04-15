import { z } from 'zod';

export const itemPedidoSchema = z.object({
  pedidoId: z.coerce.number().int().positive('Pedido é obrigatório'),
  uniformeId: z.coerce.number().int().positive('Selecione um uniforme'),
  quantidade: z.coerce.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
});

export type ItemPedidoFormValues = z.infer<typeof itemPedidoSchema>;
