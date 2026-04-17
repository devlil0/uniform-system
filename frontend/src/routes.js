import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdAssignment,
  MdFactory,
  MdHome,
  MdLocalShipping,
  MdPeople,
  MdStraighten,
  MdWarehouse,
  MdMoveToInbox,
  MdDeliveryDining,
} from 'react-icons/md';
import { GiShirt, GiSewingMachine } from 'react-icons/gi';
import { BsBoxSeam } from 'react-icons/bs';
import { TbCube } from 'react-icons/tb';

const MainDashboard   = React.lazy(() => import('views/admin/default'));
const ClientesPage    = React.lazy(() => import('views/admin/clientes'));
const PedidosPage     = React.lazy(() => import('views/admin/pedidos'));
const ProducaoPage    = React.lazy(() => import('views/admin/producao'));
const FardoPage       = React.lazy(() => import('views/admin/fardo'));
const EntregaPage     = React.lazy(() => import('views/admin/entrega'));
const UniformesPage   = React.lazy(() => import('views/admin/uniformes'));
const CostureirasPage = React.lazy(() => import('views/admin/costureiras'));
const EntregadoresPage = React.lazy(() => import('views/admin/entregadores'));
const EstoquePage     = React.lazy(() => import('views/admin/estoque'));

const routes = [
  {
    name: 'Início',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: 'Fluxo de Produção',
    category: true,
    items: [
      {
        name: 'Clientes',
        layout: '/admin',
        path: '/clientes',
        icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
        component: ClientesPage,
      },
      {
        name: 'Pedidos',
        layout: '/admin',
        path: '/pedidos',
        icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
        component: PedidosPage,
      },
      {
        name: 'Uniformes',
        layout: '/admin',
        path: '/uniformes',
        icon: <Icon as={GiShirt} width="20px" height="20px" color="inherit" />,
        component: UniformesPage,
      },
      {
        name: 'Produção',
        layout: '/admin',
        path: '/producao',
        icon: <Icon as={MdFactory} width="20px" height="20px" color="inherit" />,
        component: ProducaoPage,
      },
      {
        name: 'Fardos',
        layout: '/admin',
        path: '/fardos',
        icon: <Icon as={BsBoxSeam} width="20px" height="20px" color="inherit" />,
        component: FardoPage,
      },
      {
        name: 'Entregas',
        layout: '/admin',
        path: '/entregas',
        icon: <Icon as={MdDeliveryDining} width="20px" height="20px" color="inherit" />,
        component: EntregaPage,
      },
    ],
  },
  {
    name: 'Equipe',
    category: true,
    items: [
      {
        name: 'Costureiras',
        layout: '/admin',
        path: '/costureiras',
        icon: <Icon as={GiSewingMachine} width="20px" height="20px" color="inherit" />,
        component: CostureirasPage,
      },
      {
        name: 'Entregadores',
        layout: '/admin',
        path: '/entregadores',
        icon: <Icon as={MdLocalShipping} width="20px" height="20px" color="inherit" />,
        component: EntregadoresPage,
      },
    ],
  },
  {
    name: 'Estoque',
    category: true,
    items: [
      {
        name: 'Estoque',
        layout: '/admin',
        path: '/estoque',
        icon: <Icon as={TbCube} width="20px" height="20px" color="inherit" />,
        component: EstoquePage,
      },
    ],
  },
];

export default routes;
