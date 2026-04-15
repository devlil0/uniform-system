// Enums
export type StatusPedido = 'EM_PRODUCAO' | 'FINALIZADO' | 'ENVIADO';
export type Refletivo = 'COM_REFLETIVO' | 'SEM_REFLETIVO';
export type EtapaProducao = 'CORTE' | 'COSTURA' | 'ACABAMENTO' | 'ESTAMPA' | 'EMBALAGEM' | 'DESPACHADO';
export type Tamanho = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'EG' | 'EGG' | 'EXG' | 'G1' | 'G2' | 'G3' | 'ESPECIAL';

// Cliente
export interface ClienteRequest { id: number; nome: string; contato: string; }
export interface ClienteResponse { id: number; nome: string; contato: string; }

// Costureira
export interface CostureiraRequest { id: number; nome: string; telefone: string; }
export interface CostureiraResponse { id: number; nome: string; telefone: string; }

// Entregador
export interface EntregadorRequest { id: number; nome: string; telefone: string; }
export interface EntregadorResponse { id: number; nome: string; telefone: string; }

// Uniforme
export interface UniformeRequest {
  id?: number;
  nome: string;
  malha: string;
  tamanho: Tamanho;
  refletivo: Refletivo;
  cor: string;
}
export interface UniformeResponse extends Required<UniformeRequest> {}

// Pedido
export interface PedidoRequest { id?: number; clienteId: number; status: StatusPedido; }
export interface PedidoResponse {
  id: number;
  clienteResponse: ClienteResponse;
  createdAt: string;
  status: StatusPedido;
}

// ItemPedido
export interface ItemPedidoRequest { id?: number; pedidoId: number; uniformeId: number; quantidade: number; }
export interface ItemPedidoResponse {
  id: number;
  pedidoResponse: PedidoResponse;
  uniformeResponse: UniformeResponse;
  quantidade: number;
}

// Fardo
export interface FardoRequest { id?: number; pedidoId: number; entregadorId: number; dataEnvio: string; }
export interface FardoResponse {
  id: number;
  pedidoResponse: PedidoResponse;
  entregadorResponse: EntregadorResponse;
  dataEnvio: string;
}

// Estoque
export interface EstoqueRequest {
  id: number;
  quantidade: number;
  uniformeId: number;
  vinculadoCliente: boolean;
  clienteId: number;
}
export interface EstoqueResponse {
  id: number;
  quantidade: number;
  uniformeResponse: UniformeResponse;
  vinciuladoCliente: boolean; // Mantendo o typo do backend conforme a spec
  clienteResponse: ClienteResponse;
}

// Producao
export interface ProducaoRequest {
  id?: number;
  pedidoId: number;
  costureiraId: number;
  entrada?: string;
  saida?: string;
  etapa: EtapaProducao;
}
export interface ProducaoResponse {
  id: number;
  pedidoResponse: PedidoResponse;
  costureiraResponse: CostureiraResponse;
  entrada?: string;
  saida?: string;
  etapa: EtapaProducao;
}

// Enums API Response
export interface EnumsResponse {
  etapaProducao: EtapaProducao[];
  statusPedido: StatusPedido[];
  tamanho: Tamanho[];
  refletivo: Refletivo[];
}
