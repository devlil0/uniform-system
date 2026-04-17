import React, { useEffect, useState } from 'react';
import {
  Alert, AlertDescription, AlertIcon,
  Badge, Box, Button, FormControl, FormLabel,
  IconButton, Select, Spinner, Stack,
  Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import Card from 'components/card/Card';
import DataCard from 'views/admin/system/components/DataCard';
import SectionHeader from 'views/admin/system/components/SectionHeader';
import { useAutoAlert } from 'hooks/useAutoAlert';
import { api } from 'services/api';

const initialForm = { clienteId: '' };

const STATUS_COLOR = {
  PENDENTE: 'gray',
  EM_PRODUCAO: 'orange',
  FINALIZADO: 'cyan',
  ENVIADO: 'green',
  CANCELADO: 'red',
};

function StatusPill({ value }) {
  return (
    <Badge colorScheme={STATUS_COLOR[value] || 'gray'} borderRadius="full" px="10px" py="4px">
      {String(value || '').replaceAll('_', ' ')}
    </Badge>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return '-';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateValue));
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.400');
  const rowHover = useColorModeValue('gray.50', 'whiteAlpha.50');

  useAutoAlert(success, setSuccess);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [pedidosData, clientesData] = await Promise.all([api.getPedidos(), api.getClientes()]);
      setPedidos(pedidosData);
      setClientes(clientesData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.createPedido({ clienteId: Number(form.clienteId) });
      setForm(initialForm);
      setSuccess('Pedido criado com sucesso.');
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await api.deletePedido(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const form_aside = (
    <Card variant="secondary" p="20px">
      <SectionHeader title="Novo pedido" description="Escolha um cliente. O pedido será criado com status PENDENTE." />
      <form onSubmit={handleSubmit}>
        <Stack spacing="14px">
          <FormControl isRequired>
            <FormLabel>Cliente</FormLabel>
            <Select
              placeholder="Selecione um cliente"
              value={form.clienteId}
              onChange={(e) => setForm((f) => ({ ...f, clienteId: e.target.value }))}
            >
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={submitting}>Criar pedido</Button>
        </Stack>
      </form>
    </Card>
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        {error && <Alert status="error" borderRadius="16px"><AlertIcon /><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert status="success" borderRadius="16px"><AlertIcon /><AlertDescription>{success}</AlertDescription></Alert>}

        <DataCard title="Pedidos" description="Criação e listagem de pedidos vinculados a clientes." aside={form_aside}>
          <TableContainer>
            {loading ? (
              <Stack align="center" justify="center" minH="120px"><Spinner color="brand.500" /></Stack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr><Th>ID</Th><Th>Cliente</Th><Th>Status</Th><Th>Criado em</Th><Th /></Tr>
                </Thead>
                <Tbody>
                  {pedidos.length ? (
                    pedidos.map((p) => (
                      <Tr key={p.id} _hover={{ bg: rowHover }} transition="background 0.1s">
                        <Td color={muted} fontSize="sm">{p.id}</Td>
                        <Td fontWeight="600">{p.clienteResponse?.nome || '-'}</Td>
                        <Td><StatusPill value={p.status} /></Td>
                        <Td color={muted} fontSize="sm">{formatDate(p.createdAt)}</Td>
                        <Td>
                          <IconButton icon={<MdDelete />} size="sm" variant="ghost" colorScheme="red" aria-label="Remover" onClick={() => handleDelete(p.id)} />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr><Td colSpan={5} py="32px" textAlign="center"><Text color={muted}>Nenhum pedido registrado.</Text></Td></Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </TableContainer>
        </DataCard>
      </Stack>
    </Box>
  );
}
