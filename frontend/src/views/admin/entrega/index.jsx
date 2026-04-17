import React, { useEffect, useState } from 'react';
import {
  Alert, AlertDescription, AlertIcon,
  Box, Button, FormControl, FormLabel,
  Grid, IconButton, Input, Select, Spinner, Stack,
  Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import Card from 'components/card/Card';
import DataCard from 'views/admin/system/components/DataCard';
import SectionHeader from 'views/admin/system/components/SectionHeader';
import { useAutoAlert } from 'hooks/useAutoAlert';
import { api } from 'services/api';

const STATUS_COLOR = {
  PENDENTE: 'gray',
  EM_TRANSITO: 'blue',
  ENTREGUE: 'green',
  DEVOLVIDO: 'red',
};

const initialForm = { fardoId: '', entregadorId: '', dataEntrega: '', status: '', observacao: '' };

export default function EntregaPage() {
  const [entregas, setEntregas] = useState([]);
  const [fardos, setFardos] = useState([]);
  const [entregadores, setEntregadores] = useState([]);
  const [enums, setEnums] = useState({ statusEntrega: [] });
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.400');
  const rowHover = useColorModeValue('gray.50', 'whiteAlpha.50');

  useAutoAlert(success, setSuccess);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [entregasData, fardosData, entregadoresData, enumsData] = await Promise.all([
        api.getEntregas(), api.getFardos(), api.getEntregadores(), api.getEnums(),
      ]);
      setEntregas(entregasData);
      setFardos(fardosData);
      setEntregadores(entregadoresData);
      setEnums({ statusEntrega: enumsData.statusEntrega || [] });
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
      await api.createEntrega({
        fardoId: Number(form.fardoId),
        entregadorId: Number(form.entregadorId),
        dataEntrega: form.dataEntrega,
        status: form.status,
        observacao: form.observacao || null,
      });
      setForm(initialForm);
      setSuccess('Entrega registrada com sucesso.');
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(entrega, novoStatus) {
    setUpdatingId(entrega.id);
    setError('');
    try {
      await api.updateEntrega(entrega.id, {
        fardoId: entrega.fardoResponse.id,
        entregadorId: entrega.entregadorResponse?.id,
        dataEntrega: entrega.dataEntrega,
        status: novoStatus,
        observacao: entrega.observacao || null,
      });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await api.deleteEntrega(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const entregues = entregas.filter((e) => e.status === 'ENTREGUE').length;
  const emTransito = entregas.filter((e) => e.status === 'EM_TRANSITO').length;

  const form_aside = (
    <Card variant="secondary" p="20px">
      <SectionHeader title="Nova entrega" description="Registre a entrega de um fardo ao cliente." />
      <form onSubmit={handleSubmit}>
        <Stack spacing="14px">
          <FormControl isRequired>
            <FormLabel>Fardo</FormLabel>
            <Select placeholder="Selecione o fardo" value={form.fardoId} onChange={(e) => setForm((f) => ({ ...f, fardoId: e.target.value }))}>
              {fardos.map((f) => <option key={f.id} value={f.id}>Fardo #{f.id} — {f.pedidoResponse?.clienteResponse?.nome || 'Cliente'}</option>)}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Entregador</FormLabel>
            <Select placeholder="Selecione o entregador" value={form.entregadorId} onChange={(e) => setForm((f) => ({ ...f, entregadorId: e.target.value }))}>
              {entregadores.map((entregador) => <option key={entregador.id} value={entregador.id}>{entregador.nome}</option>)}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Data de entrega</FormLabel>
            <Input type="date" value={form.dataEntrega} onChange={(e) => setForm((f) => ({ ...f, dataEntrega: e.target.value }))} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select placeholder="Selecione o status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              {enums.statusEntrega.map((s) => <option key={s} value={s}>{String(s).replaceAll('_', ' ')}</option>)}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Observação</FormLabel>
            <Input value={form.observacao} onChange={(e) => setForm((f) => ({ ...f, observacao: e.target.value }))} />
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={submitting}>Registrar entrega</Button>
        </Stack>
      </form>
    </Card>
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        {error && <Alert status="error" borderRadius="16px"><AlertIcon /><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert status="success" borderRadius="16px"><AlertIcon /><AlertDescription>{success}</AlertDescription></Alert>}

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="16px">
          <Card p="20px">
            <Text fontSize="xs" fontWeight="700" color={muted} textTransform="uppercase" letterSpacing="0.08em" mb="6px">Total</Text>
            <Text fontSize="3xl" fontWeight="800">{loading ? '—' : entregas.length}</Text>
          </Card>
          <Card p="20px">
            <Text fontSize="xs" fontWeight="700" color={muted} textTransform="uppercase" letterSpacing="0.08em" mb="6px">Em trânsito</Text>
            <Text fontSize="3xl" fontWeight="800" color="blue.400">{loading ? '—' : emTransito}</Text>
          </Card>
          <Card p="20px">
            <Text fontSize="xs" fontWeight="700" color={muted} textTransform="uppercase" letterSpacing="0.08em" mb="6px">Entregues</Text>
            <Text fontSize="3xl" fontWeight="800" color="green.400">{loading ? '—' : entregues}</Text>
          </Card>
        </Grid>

        <DataCard title="Entregas" description="Registro e acompanhamento das entregas de fardos." aside={form_aside}>
          <TableContainer>
            {loading ? (
              <Stack align="center" justify="center" minH="120px"><Spinner color="brand.500" /></Stack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr><Th>ID</Th><Th>Fardo</Th><Th>Cliente</Th><Th>Entregador</Th><Th>Data</Th><Th>Status</Th><Th /></Tr>
                </Thead>
                <Tbody>
                  {entregas.length ? (
                    entregas.map((e) => (
                      <Tr key={e.id} _hover={{ bg: rowHover }} transition="background 0.1s">
                        <Td color={muted} fontSize="sm">{e.id}</Td>
                        <Td color={muted} fontSize="sm">#{e.fardoResponse?.id}</Td>
                        <Td fontWeight="600">{e.fardoResponse?.pedidoResponse?.clienteResponse?.nome || '-'}</Td>
                        <Td>{e.entregadorResponse?.nome || '-'}</Td>
                        <Td color={muted} fontSize="sm">{e.dataEntrega || '-'}</Td>
                        <Td>
                          <Select
                            size="sm"
                            value={e.status}
                            onChange={(ev) => handleStatusChange(e, ev.target.value)}
                            isDisabled={updatingId === e.id}
                            borderRadius="full"
                            w="140px"
                            fontWeight="600"
                            colorScheme={STATUS_COLOR[e.status]}
                          >
                            {enums.statusEntrega.map((s) => <option key={s} value={s}>{String(s).replaceAll('_', ' ')}</option>)}
                          </Select>
                        </Td>
                        <Td>
                          <IconButton icon={<MdDelete />} size="sm" variant="ghost" colorScheme="red" aria-label="Remover" onClick={() => handleDelete(e.id)} />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr><Td colSpan={7} py="32px" textAlign="center"><Text color={muted}>Nenhuma entrega registrada.</Text></Td></Tr>
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
