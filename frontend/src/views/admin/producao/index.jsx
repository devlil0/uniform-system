import React, { useEffect, useState } from 'react';
import {
  Alert, AlertDescription, AlertIcon,
  Badge, Box, Button, Flex, FormControl, FormLabel,
  Grid, IconButton, Select, Spinner, Stack,
  Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdCheck, MdClose, MdDelete } from 'react-icons/md';
import Card from 'components/card/Card';
import DataCard from 'views/admin/system/components/DataCard';
import SectionHeader from 'views/admin/system/components/SectionHeader';
import { useAutoAlert } from 'hooks/useAutoAlert';
import { api } from 'services/api';

const ETAPA_COLOR = {
  CORTE: 'red',
  COSTURA: 'orange',
  ACABAMENTO: 'yellow',
  ESTAMPA: 'purple',
  EMBALAGEM: 'blue',
  DESPACHADO: 'green',
};

const ETAPA_LABEL = {
  CORTE: 'Corte',
  COSTURA: 'Costura',
  ACABAMENTO: 'Acabamento',
  ESTAMPA: 'Estampa',
  EMBALAGEM: 'Embalagem',
  DESPACHADO: 'Despachado',
};

// ESTAMPA é opcional: de ACABAMENTO pode ir para ESTAMPA ou direto para EMBALAGEM
const PROXIMAS_ETAPAS = {
  CORTE:      ['COSTURA'],
  COSTURA:    ['ACABAMENTO'],
  ACABAMENTO: ['ESTAMPA', 'EMBALAGEM'],
  ESTAMPA:    ['EMBALAGEM'],
  EMBALAGEM:  ['DESPACHADO'],
  DESPACHADO: [],
};

function EtapaPill({ value }) {
  return (
    <Badge colorScheme={ETAPA_COLOR[value] || 'gray'} borderRadius="full" px="10px" py="4px">
      {String(value || '').replaceAll('_', ' ')}
    </Badge>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return '-';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateValue));
}

const initialForm = { pedidoId: '', costureiraId: '', entrada: '', saida: '' };

export default function ProducaoPage() {
  const [producoes, setProducoes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [costureiras, setCostureiras] = useState([]);
  const [enums, setEnums] = useState({ etapaProducao: [] });
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingEtapa, setEditingEtapa] = useState('');
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.400');
  const rowHover = useColorModeValue('gray.50', 'whiteAlpha.50');

  useAutoAlert(success, setSuccess);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [producoesData, pedidosData, costureirasData, enumsData] = await Promise.all([
        api.getProducao(),
        api.getPedidos(),
        api.getCostureiras(),
        api.getEnums(),
      ]);
      setProducoes(producoesData);
      setPedidos(pedidosData);
      setCostureiras(costureirasData);
      setEnums({ etapaProducao: enumsData.etapaProducao || [] });
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
      await api.createProducao({
        pedidoId: Number(form.pedidoId),
        costureiraId: Number(form.costureiraId),
        etapa: 'CORTE',
        entrada: form.entrada || null,
        saida: form.saida || null,
      });
      setForm(initialForm);
      setSuccess('Registro de produção criado.');
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(producao) {
    const proximas = PROXIMAS_ETAPAS[producao.etapa] || [];
    if (proximas.length === 0) return;
    setEditingId(producao.id);
    setEditingEtapa(proximas[0]);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingEtapa('');
  }

  async function handleUpdateEtapa(id) {
    setError('');
    try {
      const current = producoes.find((p) => p.id === id);
      await api.updateProducao(id, {
        pedidoId: current.pedidoResponse?.id,
        costureiraId: current.costureiraResponse?.id,
        etapa: editingEtapa,
        entrada: current.entrada || null,
        saida: current.saida || null,
      });
      setSuccess('Etapa atualizada.');
      cancelEdit();
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await api.deleteProducao(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const despachadosPedidoIds = new Set(
    producoes
      .filter((p) => p.etapa === 'DESPACHADO')
      .map((p) => p.pedidoResponse?.id)
      .filter(Boolean)
  );

  const producoesAtivas = producoes.filter(
    (p) => !despachadosPedidoIds.has(p.pedidoResponse?.id)
  );

  const pedidosComProducaoAtivaIds = new Set(
    producoesAtivas.map((p) => p.pedidoResponse?.id).filter(Boolean)
  );

  const pedidosDisponiveis = pedidos.filter(
    (p) => !despachadosPedidoIds.has(p.id) && !pedidosComProducaoAtivaIds.has(p.id)
  );

  const contagemPorEtapa = enums.etapaProducao.reduce((acc, etapa) => {
    acc[etapa] = producoes.filter((p) => p.etapa === etapa).length;
    return acc;
  }, {});

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        {error && (
          <Alert status="error" borderRadius="16px">
            <AlertIcon /><AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert status="success" borderRadius="16px">
            <AlertIcon /><AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Resumo por etapa */}
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' }} gap="12px">
          {enums.etapaProducao.map((etapa) => (
            <Card key={etapa} p="18px">
              <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.08em" color="secondaryGray.500" mb="8px">
                {ETAPA_LABEL[etapa] || etapa}
              </Text>
              <Text fontSize="3xl" fontWeight="800" color={etapa === 'DESPACHADO' ? 'green.400' : 'brand.400'} lineHeight="1">
                {loading ? '—' : contagemPorEtapa[etapa] || 0}
              </Text>
            </Card>
          ))}
        </Grid>

        <DataCard title="Produção" description="Registros de produção por pedido, etapa e costureira.">
          <Stack spacing="20px">

            {/* Tabela — acima */}
            <TableContainer>
              {loading ? (
                <Stack align="center" justify="center" minH="120px">
                  <Spinner color="brand.500" />
                </Stack>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Pedido</Th>
                      <Th>Costureira</Th>
                      <Th>Etapa</Th>
                      <Th>Entrada</Th>
                      <Th>Saída</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {producoesAtivas.length ? (
                      producoesAtivas.map((p) => (
                        <Tr key={p.id} _hover={{ bg: rowHover }} transition="background 0.1s">
                          <Td color={muted} fontSize="sm">{p.id}</Td>
                          <Td fontWeight="600">#{p.pedidoResponse?.id} — {p.pedidoResponse?.clienteResponse?.nome || '-'}</Td>
                          <Td>{p.costureiraResponse?.nome || '-'}</Td>
                          <Td>
                            {editingId === p.id ? (
                              <Flex gap="6px" align="center">
                                <Select
                                  size="sm"
                                  borderRadius="8px"
                                  value={editingEtapa}
                                  onChange={(e) => setEditingEtapa(e.target.value)}
                                  w="140px"
                                >
                                  {(PROXIMAS_ETAPAS[p.etapa] || []).map((e) => (
                                    <option key={e} value={e}>{e}</option>
                                  ))}
                                </Select>
                                <IconButton
                                  icon={<MdCheck />}
                                  size="sm"
                                  colorScheme="green"
                                  variant="ghost"
                                  aria-label="Confirmar"
                                  onClick={() => handleUpdateEtapa(p.id)}
                                />
                                <IconButton
                                  icon={<MdClose />}
                                  size="sm"
                                  colorScheme="gray"
                                  variant="ghost"
                                  aria-label="Cancelar"
                                  onClick={cancelEdit}
                                />
                              </Flex>
                            ) : (
                              <Box
                                display="inline-block"
                                cursor={(PROXIMAS_ETAPAS[p.etapa] || []).length > 0 ? 'pointer' : 'default'}
                                onClick={() => startEdit(p)}
                                title={(PROXIMAS_ETAPAS[p.etapa] || []).length > 0 ? 'Clique para avançar a etapa' : undefined}
                              >
                                <EtapaPill value={p.etapa} />
                              </Box>
                            )}
                          </Td>
                          <Td color={muted} fontSize="sm">{formatDate(p.entrada)}</Td>
                          <Td color={muted} fontSize="sm">{formatDate(p.saida)}</Td>
                          <Td>
                            <IconButton
                              icon={<MdDelete />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              aria-label="Remover"
                              onClick={() => handleDelete(p.id)}
                            />
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={7} py="32px" textAlign="center">
                          <Text color={muted}>
                            {producoes.length > 0
                              ? 'Todos os pedidos foram despachados.'
                              : 'Nenhum registro de produção.'}
                          </Text>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              )}
            </TableContainer>

            {/* Formulário — abaixo */}
            <Card variant="secondary" p="20px">
              <SectionHeader title="Novo registro" description="Registre a etapa de produção de um pedido." />
              <form onSubmit={handleSubmit}>
                <Stack spacing="14px">
                  <FormControl isRequired>
                    <FormLabel>Pedido</FormLabel>
                    <Select
                      placeholder="Selecione o pedido"
                      value={form.pedidoId}
                      onChange={(e) => setForm((f) => ({ ...f, pedidoId: e.target.value }))}
                    >
                      {pedidosDisponiveis.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.id} — {p.clienteResponse?.nome || 'Cliente'} ({p.status})
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Costureira</FormLabel>
                    <Select
                      placeholder="Selecione a costureira"
                      value={form.costureiraId}
                      onChange={(e) => setForm((f) => ({ ...f, costureiraId: e.target.value }))}
                    >
                      {costureiras.map((c) => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <Flex align="center" gap="8px">
                    <Text fontSize="sm" color={muted}>Etapa inicial:</Text>
                    <EtapaPill value="CORTE" />
                  </Flex>
                  <Button type="submit" colorScheme="brand" isLoading={submitting}>
                    Registrar etapa
                  </Button>
                </Stack>
              </form>
            </Card>

          </Stack>
        </DataCard>
      </Stack>
    </Box>
  );
}
