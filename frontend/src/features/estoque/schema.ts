import { z } from 'zod';

export const estoqueSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um número positivo'),
  uniformeId: z.coerce.number().int().positive('Selecione um uniforme'),
  quantidade: z.coerce.number().int().min(0, 'Quantidade não pode ser negativa'),
  vinculadoCliente: z.boolean(),
  clienteId: z.coerce.number().int().min(0),
}).superRefine((values, ctx) => {
  if (values.vinculadoCliente && values.clienteId <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['clienteId'],
      message: 'Selecione um cliente',
    });
  }
});

export type EstoqueFormValues = z.infer<typeof estoqueSchema>;
