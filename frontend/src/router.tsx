import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';

// Cliente
import { ClienteListPage } from './features/cliente/ClienteListPage';
import { ClienteFormPage } from './features/cliente/ClienteFormPage';

// Costureira
import { CostureiraListPage } from './features/costureira/CostureiraListPage';
import { CostureiraFormPage } from './features/costureira/CostureiraFormPage';

// Entregador
import { EntregadorListPage } from './features/entregador/EntregadorListPage';
import { EntregadorFormPage } from './features/entregador/EntregadorFormPage';

// Uniforme
import { UniformeListPage } from './features/uniforme/UniformeListPage';
import { UniformeFormPage } from './features/uniforme/UniformeFormPage';

// Pedido
import { PedidoListPage } from './features/pedido/PedidoListPage';
import { PedidoFormPage } from './features/pedido/PedidoFormPage';
import { PedidoDetailPage } from './features/pedido/PedidoDetailPage';

// Produção
import { ProducaoListPage } from './features/producao/ProducaoListPage';
import { ProducaoFormPage } from './features/producao/ProducaoFormPage';

// Fardo
import { FardoListPage } from './features/fardo/FardoListPage';
import { FardoFormPage } from './features/fardo/FardoFormPage';

// Estoque
import { EstoqueListPage } from './features/estoque/EstoqueListPage';
import { EstoqueFormPage } from './features/estoque/EstoqueFormPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      // Clientes
      { path: 'clientes',              element: <ClienteListPage /> },
      { path: 'clientes/novo',         element: <ClienteFormPage /> },
      { path: 'clientes/:id/editar',   element: <ClienteFormPage /> },

      // Costureiras
      { path: 'costureiras',            element: <CostureiraListPage /> },
      { path: 'costureiras/nova',       element: <CostureiraFormPage /> },
      { path: 'costureiras/:id/editar', element: <CostureiraFormPage /> },

      // Entregadores
      { path: 'entregadores',            element: <EntregadorListPage /> },
      { path: 'entregadores/novo',       element: <EntregadorFormPage /> },
      { path: 'entregadores/:id/editar', element: <EntregadorFormPage /> },

      // Uniformes
      { path: 'uniformes',            element: <UniformeListPage /> },
      { path: 'uniformes/novo',       element: <UniformeFormPage /> },
      { path: 'uniformes/:id/editar', element: <UniformeFormPage /> },

      // Pedidos
      { path: 'pedidos',                 element: <PedidoListPage /> },
      { path: 'pedidos/novo',            element: <PedidoFormPage /> },
      { path: 'pedidos/:id',             element: <PedidoDetailPage /> },
      { path: 'pedidos/:id/itens/novo',  element: <PedidoDetailPage /> },
      { path: 'pedidos/:id/editar',      element: <PedidoFormPage /> },

      // Produções
      { path: 'producoes',             element: <ProducaoListPage /> },
      { path: 'producoes/nova',        element: <ProducaoFormPage /> },
      { path: 'producoes/:id/editar',  element: <ProducaoFormPage /> },

      // Fardos
      { path: 'fardos',             element: <FardoListPage /> },
      { path: 'fardos/novo',        element: <FardoFormPage /> },
      { path: 'fardos/:id/editar',  element: <FardoFormPage /> },

      // Estoque
      { path: 'estoque',             element: <EstoqueListPage /> },
      { path: 'estoque/novo',        element: <EstoqueFormPage /> },
      { path: 'estoque/:id/editar',  element: <EstoqueFormPage /> },
    ],
  },
]);
