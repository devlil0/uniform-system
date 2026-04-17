import React, { useEffect, useState } from 'react';
import {
  Alert, AlertDescription, AlertIcon,
  Box, Button, FormControl, FormLabel,
  IconButton, Input, Select, Spinner, Stack,
  Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import Card from 'components/card/Card';
import DataCard from 'views/admin/system/components/DataCard';
import SectionHeader from 'views/admin/system/components/SectionHeader';
import { useAutoAlert } from 'hooks/useAutoAlert';
import { api } from 'services/api';

const initialForm = { pedidoId: '', dataEnvio: '' };

export default function FardoPage() {
  const [fardos, setFardos] = useState([]);
  const [pedidosDespachados, setPedidosDespachados] = useState([]);
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
      const [fardosData, pedidosData, producoesData] = await Promise.all([
        api.getFardos(), api.getPedidos(), api.getProducao(),
      ]);
      setFardos(fardosData);
      const idsDespachados = new Set(
        producoesData.filter((p) => p.etapa === 'DESPACHADO').map((p) => p.pedidoResponse?.id)
      );
      setPedidosDespachados(pedidosData.filter((p) => idsDespachados.has(p.id)));
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
      await api.createFardo({ pedidoId: Number(form.pedidoId), dataEnvio: form.dataEnvio });
      setForm(initialForm);
      setSuccess('Fardo criado com sucesso.');
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
      await api.deleteFardo(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const form_aside = (
    <Card variant="secondary" p="20px">
      <SectionHeader title="Novo fardo" description="Apenas pedidos com etapa DESPACHADO podem ser expedidos." />
      <form onSubmit={handleSubmit}>
        <Stack spacing="14px">
          <FormControl isRequired>
            <FormLabel>Pedido</FormLabel>
            <Select
              placeholder={pedidosDespachados.length ? 'Selecione o pedido' : 'Nenhum pedido despachado'}
              value={form.pedidoId}
              onChange={(e) => setForm((f) => ({ ...f, pedidoId: e.target.value }))}
              isDisabled={pedidosDespachados.length === 0}
            >
              {pedidosDespachados.map((p) => (
                <option key={p.id} value={p.id}>#{p.id} — {p.clienteResponse?.nome || 'Cliente'} ({p.status})</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Data de envio</FormLabel>
            <Input type="date" value={form.dataEnvio} onChange={(e) => setForm((f) => ({ ...f, dataEnvio: e.target.value }))} />
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={submitting}>Criar fardo</Button>
        </Stack>
      </form>
    </Card>
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        {error && <Alert status="error" borderRadius="16px"><AlertIcon /><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert status="success" borderRadius="16px"><AlertIcon /><AlertDescription>{success}</AlertDescription></Alert>}

        <DataCard title="Fardos" description="Expedição de pedidos prontos para entrega." aside={form_aside}>
          <TableContainer>
            {loading ? (
              <Stack align="center" justify="center" minH="120px"><Spinner color="brand.500" /></Stack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr><Th>ID</Th><Th>Pedido</Th><Th>Data de envio</Th><Th /></Tr>
                </Thead>
                <Tbody>
                  {fardos.length ? (
                    fardos.map((f) => (
                      <Tr key={f.id} _hover={{ bg: rowHover }} transition="background 0.1s">
                        <Td color={muted} fontSize="sm">{f.id}</Td>
                        <Td fontWeight="600">#{f.pedidoResponse?.id} — {f.pedidoResponse?.clienteResponse?.nome || '-'}</Td>
                        <Td color={muted} fontSize="sm">{f.dataEnvio || '-'}</Td>
                        <Td>
                          <IconButton icon={<MdDelete />} size="sm" variant="ghost" colorScheme="red" aria-label="Remover" onClick={() => handleDelete(f.id)} />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr><Td colSpan={4} py="32px" textAlign="center"><Text color={muted}>Nenhum fardo registrado.</Text></Td></Tr>
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
