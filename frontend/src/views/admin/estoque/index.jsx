import React, { useEffect, useState } from 'react';
import {
  Alert, AlertDescription, AlertIcon,
  Box, Button, Checkbox, FormControl, FormLabel,
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

const initialForm = { quantidade: '', uniformeId: '', vinculadoCliente: false, clienteId: '' };

export default function EstoquePage() {
  const [estoque, setEstoque] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [uniformes, setUniformes] = useState([]);
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
      const [estoqueData, clientesData, uniformesData] = await Promise.all([
        api.getEstoque(), api.getClientes(), api.getUniformes(),
      ]);
      setEstoque(estoqueData);
      setClientes(clientesData);
      setUniformes(uniformesData);
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
      await api.createEstoque({
        quantidade: Number(form.quantidade),
        uniformeId: Number(form.uniformeId),
        vinculadoCliente: form.vinculadoCliente,
        clienteId: form.vinculadoCliente && form.clienteId ? Number(form.clienteId) : null,
      });
      setForm(initialForm);
      setSuccess('Item de estoque criado com sucesso.');
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
      await api.deleteEstoque(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const form_aside = (
    <Card variant="secondary" p="20px">
      <SectionHeader title="Novo item" description="Associe um uniforme ao estoque com quantidade e cliente opcional." />
      <form onSubmit={handleSubmit}>
        <Stack spacing="14px">
          <FormControl isRequired>
            <FormLabel>Uniforme</FormLabel>
            <Select placeholder="Selecione um uniforme" value={form.uniformeId} onChange={(e) => setForm((f) => ({ ...f, uniformeId: e.target.value }))}>
              {uniformes.map((u) => <option key={u.id} value={u.id}>{u.nome} — {u.tamanho} / {u.cor}</option>)}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Quantidade</FormLabel>
            <Input type="number" min="1" value={form.quantidade} onChange={(e) => setForm((f) => ({ ...f, quantidade: e.target.value }))} />
          </FormControl>
          <FormControl>
            <Checkbox isChecked={form.vinculadoCliente} onChange={(e) => setForm((f) => ({ ...f, vinculadoCliente: e.target.checked }))}>
              Vinculado a cliente
            </Checkbox>
          </FormControl>
          {form.vinculadoCliente && (
            <FormControl isRequired>
              <FormLabel>Cliente</FormLabel>
              <Select placeholder="Selecione um cliente" value={form.clienteId} onChange={(e) => setForm((f) => ({ ...f, clienteId: e.target.value }))}>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </Select>
            </FormControl>
          )}
          <Button type="submit" colorScheme="brand" isLoading={submitting}>Salvar item</Button>
        </Stack>
      </form>
    </Card>
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        {error && <Alert status="error" borderRadius="16px"><AlertIcon /><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert status="success" borderRadius="16px"><AlertIcon /><AlertDescription>{success}</AlertDescription></Alert>}

        <DataCard title="Estoque" description="Controle de uniformes em estoque, vinculados ou não a clientes." aside={form_aside}>
          <TableContainer>
            {loading ? (
              <Stack align="center" justify="center" minH="120px"><Spinner color="brand.500" /></Stack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr><Th>ID</Th><Th>Uniforme</Th><Th>Qtd</Th><Th>Cliente</Th><Th /></Tr>
                </Thead>
                <Tbody>
                  {estoque.length ? (
                    estoque.map((item) => (
                      <Tr key={item.id} _hover={{ bg: rowHover }} transition="background 0.1s">
                        <Td color={muted} fontSize="sm">{item.id}</Td>
                        <Td>
                          <Text fontWeight="600">{item.uniformeResponse?.nome || '-'}</Text>
                          <Text fontSize="xs" color={muted}>{item.uniformeResponse?.tamanho} / {item.uniformeResponse?.cor}</Text>
                        </Td>
                        <Td>{item.quantidade}</Td>
                        <Td>{item.vinculadoCliente ? item.clienteResponse?.nome || '-' : '—'}</Td>
                        <Td>
                          <IconButton icon={<MdDelete />} size="sm" variant="ghost" colorScheme="red" aria-label="Remover" onClick={() => handleDelete(item.id)} />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr><Td colSpan={5} py="32px" textAlign="center"><Text color={muted}>Nenhum item em estoque.</Text></Td></Tr>
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
