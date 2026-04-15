export const qk = {
  cliente:    { all: ['cliente']    as const, byId: (id: number) => ['cliente',    id] as const },
  costureira: { all: ['costureira'] as const, byId: (id: number) => ['costureira', id] as const },
  entregador: { all: ['entregador'] as const, byId: (id: number) => ['entregador', id] as const },
  uniforme:   { all: ['uniforme']   as const, byId: (id: number) => ['uniforme',   id] as const },
  pedido:     { all: ['pedido']     as const, byId: (id: number) => ['pedido',     id] as const },
  itemPedido: { all: ['item-pedido'] as const, byId: (id: number) => ['item-pedido', id] as const },
  fardo:      { all: ['fardo']      as const, byId: (id: number) => ['fardo',      id] as const },
  estoque:    { all: ['estoque']    as const, byId: (id: number) => ['estoque',    id] as const },
  producao:   { all: ['producao']   as const, byId: (id: number) => ['producao',   id] as const },
  enums:      ['enums'] as const,
};
