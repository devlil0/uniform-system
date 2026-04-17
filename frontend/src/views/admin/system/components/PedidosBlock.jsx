import React from 'react';
import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import DataCard from './DataCard';
import SectionHeader from './SectionHeader';

function StatusPill({ value }) {
  const colorScheme = {
    ENTREGUE: 'green',
    CANCELADO: 'red',
    PRONTO: 'cyan',
    EM_PRODUCAO: 'orange',
    PENDENTE: 'gray',
  }[value] || 'gray';

  return (
    <Badge colorScheme={colorScheme} borderRadius="full" px="10px" py="4px">
      {String(value || '').replaceAll('_', ' ')}
    </Badge>
  );
}

export default function PedidosBlock({
  clientes,
  pedidos,
  pedidoForm,
  setPedidoForm,
  enums,
  handleSubmit,
  submitting,
  formatDate,
}) {
  return (
    <DataCard title="Pedidos" description="Criacao simples com cliente e status inicial. Lista ligada a /api/pedido.">
      <Grid templateColumns={{ base: '1fr', xl: '0.9fr 1.1fr' }} gap="20px">
        <Card variant="secondary" p="20px">
          <SectionHeader
            title="Novo pedido"
            description="Escolha um cliente existente e o status do pedido."
            tag="POST /api/pedido"
          />
          <form onSubmit={(event) => handleSubmit(event, 'pedido')}>
            <Stack spacing="14px">
              <FormControl isRequired>
                <FormLabel>Cliente</FormLabel>
                <Select
                  placeholder="Selecione um cliente"
                  value={pedidoForm.clienteId}
                  onChange={(event) =>
                    setPedidoForm((current) => ({
                      ...current,
                      clienteId: event.target.value,
                    }))
                  }
                >
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  placeholder="Selecione o status"
                  value={pedidoForm.status}
                  onChange={(event) =>
                    setPedidoForm((current) => ({ ...current, status: event.target.value }))
                  }
                >
                  {enums.statusPedido.map((status) => (
                    <option key={status} value={status}>
                      {String(status).replaceAll('_', ' ')}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" colorScheme="brand" isLoading={submitting}>
                Criar pedido
              </Button>
            </Stack>
          </form>
        </Card>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Cliente</Th>
                <Th>Status</Th>
                <Th>Criado em</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pedidos.length ? (
                pedidos.map((pedido) => (
                  <Tr key={pedido.id}>
                    <Td>{pedido.id}</Td>
                    <Td>{pedido.clienteResponse?.nome || '-'}</Td>
                    <Td>
                      <StatusPill value={pedido.status} />
                    </Td>
                    <Td>{formatDate(pedido.createdAt)}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4}>Nenhum pedido registrado.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Grid>
    </DataCard>
  );
}
