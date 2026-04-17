import React, { useEffect, useState } from 'react';
import {
  Alert, AlertDescription, AlertIcon,
  Box, Button, FormControl, FormLabel,
  IconButton, Input, Spinner, Stack,
  Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import Card from 'components/card/Card';
import DataCard from 'views/admin/system/components/DataCard';
import SectionHeader from 'views/admin/system/components/SectionHeader';
import { useAutoAlert } from 'hooks/useAutoAlert';
import { api } from 'services/api';

const initialForm = { nome: '', telefone: '' };

export default function CostureirasPage() {
  const [costureiras, setCostureiras] = useState([]);
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
      setCostureiras(await api.getCostureiras());
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
      await api.createCostureira({ nome: form.nome, telefone: form.telefone });
      setForm(initialForm);
      setSuccess('Costureira cadastrada com sucesso.');
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
      await api.deleteCostureira(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const form_aside = (
    <Card variant="secondary" p="20px">
      <SectionHeader title="Nova costureira" description="Preencha os dados para cadastrar uma costureira." />
      <form onSubmit={handleSubmit}>
        <Stack spacing="14px">
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Telefone</FormLabel>
            <Input value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} />
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={submitting}>Salvar costureira</Button>
        </Stack>
      </form>
    </Card>
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        {error && <Alert status="error" borderRadius="16px"><AlertIcon /><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert status="success" borderRadius="16px"><AlertIcon /><AlertDescription>{success}</AlertDescription></Alert>}

        <DataCard title="Costureiras" description="Cadastro e listagem de costureiras vinculadas ao sistema." aside={form_aside}>
          <TableContainer>
            {loading ? (
              <Stack align="center" justify="center" minH="120px"><Spinner color="brand.500" /></Stack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr><Th>ID</Th><Th>Nome</Th><Th>Telefone</Th><Th /></Tr>
                </Thead>
                <Tbody>
                  {costureiras.length ? (
                    costureiras.map((c) => (
                      <Tr key={c.id} _hover={{ bg: rowHover }} transition="background 0.1s">
                        <Td color={muted} fontSize="sm">{c.id}</Td>
                        <Td fontWeight="600">{c.nome}</Td>
                        <Td>{c.telefone}</Td>
                        <Td>
                          <IconButton icon={<MdDelete />} size="sm" variant="ghost" colorScheme="red" aria-label="Remover" onClick={() => handleDelete(c.id)} />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr><Td colSpan={4} py="32px" textAlign="center"><Text color={muted}>Nenhuma costureira cadastrada.</Text></Td></Tr>
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
