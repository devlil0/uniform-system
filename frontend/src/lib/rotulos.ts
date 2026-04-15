import { StatusPedido, EtapaProducao, Refletivo, Tamanho } from '@/types/api';

export const rotulosStatusPedido: Record<StatusPedido, string> = {
  EM_PRODUCAO: 'Em produção',
  FINALIZADO:  'Finalizado',
  ENVIADO:     'Enviado',
};

export const rotulosEtapaProducao: Record<EtapaProducao, string> = {
  CORTE:      'Corte',
  COSTURA:    'Costura',
  ACABAMENTO: 'Acabamento',
  ESTAMPA:    'Estampa',
  EMBALAGEM:  'Embalagem',
  DESPACHADO: 'Despachado',
};

export const rotulosRefletivo: Record<Refletivo, string> = {
  COM_REFLETIVO: 'Com refletivo',
  SEM_REFLETIVO: 'Sem refletivo',
};

export const tamanhos: Tamanho[] = ['PP','P','M','G','GG','EG','EGG','EXG','G1','G2','G3','ESPECIAL'];
