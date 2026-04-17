import React, { useEffect, useState } from 'react';
import {
  Alert, AlertDescription, AlertIcon,
  Box, Button, FormControl, FormLabel,
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

const initialForm = { nome: '', malha: '', tamanho: '', refletivo: '', cor: '' };

export default function UniformesPage() {
  const [uniformes, setUniformes] = useState([]);
  const [enums, setEnums] = useState({ tamanho: [], refletivo: [], malha: [], cor: [], nomeUniforme: [] });
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
      const [uniformesData, enumsData] = await Promise.all([api.getUniformes(), api.getEnums()]);
      setUniformes(uniformesData);
      setEnums({
        tamanho: enumsData.tamanho || [],
        refletivo: enumsData.refletivo || [],
        malha: enumsData.malha || [],
        cor: enumsData.cor || [],
        nomeUniforme: enumsData.nomeUniforme || [],
      });
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
      await api.createUniforme(form);
      setForm(initialForm);
      setSuccess('Uniforme cadastrado com sucesso.');
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
      await api.deleteUniforme(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const form_aside = (
    <Card variant="secondary" p="20px">
      <SectionHeader title="Novo uniforme" description="Preencha os dados para cadastrar um uniforme." />
      <form onSubmit={handleSubmit}>
        <Stack spacing="14px">
          <FormControl isRequired>
            <FormLabel>Tipo</FormLabel>
            <Select placeholder="Selecione o uniforme" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}>
              {enums.nomeUniforme.map((n) => <option key={n} value={n}>{n}</option>)}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Malha</FormLabel>
            <Select placeholder="Selecione a malha" value={form.malha} onChange={(e) => setForm((f) => ({ ...f, malha: e.target.value }))}>
              {enums.malha.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tamanho</FormLabel>
            <Select placeholder="Selecione o tamanho" value={form.tamanho} onChange={(e) => setForm((f) => ({ ...f, tamanho: e.target.value }))}>
              {enums.tamanho.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Refletivo</FormLabel>
            <Select placeholder="Selecione" value={form.refletivo} onChange={(e) => setForm((f) => ({ ...f, refletivo: e.target.value }))}>
              {enums.refletivo.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Cor</FormLabel>
            <Select placeholder="Selecione a cor" value={form.cor} onChange={(e) => setForm((f) => ({ ...f, cor: e.target.value }))}>
              {enums.cor.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={submitting}>Salvar uniforme</Button>
        </Stack>
      </form>
    </Card>
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        {error && <Alert status="error" borderRadius="16px"><AlertIcon /><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert status="success" borderRadius="16px"><AlertIcon /><AlertDescription>{success}</AlertDescription></Alert>}

        <DataCard title="Uniformes" description="Catálogo de uniformes cadastrados no sistema." aside={form_aside}>
          <TableContainer>
            {loading ? (
              <Stack align="center" justify="center" minH="120px"><Spinner color="brand.500" /></Stack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr><Th>ID</Th><Th>Nome</Th><Th>Malha</Th><Th>Tamanho</Th><Th>Cor</Th><Th>Refletivo</Th><Th /></Tr>
                </Thead>
                <Tbody>
                  {uniformes.length ? (
                    uniformes.map((u) => (
                      <Tr key={u.id} _hover={{ bg: rowHover }} transition="background 0.1s">
                        <Td color={muted} fontSize="sm">{u.id}</Td>
                        <Td fontWeight="600">{u.nome}</Td>
                        <Td>{u.malha}</Td>
                        <Td>{u.tamanho}</Td>
                        <Td>{u.cor}</Td>
                        <Td>{u.refletivo}</Td>
                        <Td>
                          <IconButton icon={<MdDelete />} size="sm" variant="ghost" colorScheme="red" aria-label="Remover" onClick={() => handleDelete(u.id)} />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr><Td colSpan={7} py="32px" textAlign="center"><Text color={muted}>Nenhum uniforme cadastrado.</Text></Td></Tr>
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
