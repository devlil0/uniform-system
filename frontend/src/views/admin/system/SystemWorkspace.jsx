import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Grid,
  GridItem,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { api } from 'services/api';
import ClientesBlock from './components/ClientesBlock';
import HeroBlock from './components/HeroBlock';
import MetricsBlock from './components/MetricsBlock';
import PedidosBlock from './components/PedidosBlock';
import SummaryBlock from './components/SummaryBlock';
import UniformesBlock from './components/UniformesBlock';

const initialClienteForm = {
  nome: '',
  contato: '',
};

const initialPedidoForm = {
  clienteId: '',
  status: '',
};

const initialUniformeForm = {
  nome: '',
  malha: '',
  tamanho: '',
  refletivo: '',
  cor: '',
};

function formatDate(dateValue) {
  if (!dateValue) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateValue));
}

export default function SystemWorkspace({ focus = 'dashboard' }) {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [uniformes, setUniformes] = useState([]);
  const [enums, setEnums] = useState({
    statusPedido: [],
    tamanho: [],
    refletivo: [],
    cor: [],
    nomeUniforme: [],
  });
  const [clienteForm, setClienteForm] = useState(initialClienteForm);
  const [pedidoForm, setPedidoForm] = useState(initialPedidoForm);
  const [uniformeForm, setUniformeForm] = useState(initialUniformeForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.400');
  const headline = useColorModeValue('secondaryGray.900', 'white');
  const sectionIds = useMemo(
    () => ({
      clientes: 'secao-clientes',
      pedidos: 'secao-pedidos',
      uniformes: 'secao-uniformes',
    }),
    []
  );

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [clientesData, pedidosData, uniformesData, enumsData] = await Promise.all([
        api.getClientes(),
        api.getPedidos(),
        api.getUniformes(),
        api.getEnums(),
      ]);

      setClientes(clientesData);
      setPedidos(pedidosData);
      setUniformes(uniformesData);
      setEnums({
        statusPedido: enumsData.statusPedido || [],
        tamanho: enumsData.tamanho || [],
        refletivo: enumsData.refletivo || [],
        cor: enumsData.cor || [],
        nomeUniforme: enumsData.nomeUniforme || [],
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (focus === 'dashboard') {
      return;
    }

    const targetId = sectionIds[focus];
    if (!targetId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [focus, sectionIds]);

  async function handleSubmit(event, type) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (type === 'cliente') {
        await api.createCliente({
          nome: clienteForm.nome,
          contato: clienteForm.contato,
        });
        setClienteForm(initialClienteForm);
        setSuccess('Cliente cadastrado com sucesso.');
      }

      if (type === 'pedido') {
        await api.createPedido({
          clienteId: Number(pedidoForm.clienteId),
          status: pedidoForm.status,
        });
        setPedidoForm(initialPedidoForm);
        setSuccess('Pedido criado com sucesso.');
      }

      if (type === 'uniforme') {
        await api.createUniforme(uniformeForm);
        setUniformeForm(initialUniformeForm);
        setSuccess('Uniforme cadastrado com sucesso.');
      }

      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        <HeroBlock
          apiUrl={api.getApiUrl()}
          loading={loading}
          onRefresh={loadData}
          headline={headline}
          clientes={clientes}
          pedidos={pedidos}
          uniformes={uniformes}
        />

        {error ? (
          <Alert status="error" borderRadius="16px">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {success ? (
          <Alert status="success" borderRadius="16px">
            <AlertIcon />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        ) : null}

        <MetricsBlock
          loading={loading}
          brandColor={brandColor}
          boxBg={boxBg}
          clientes={clientes}
          pedidos={pedidos}
          uniformes={uniformes}
        />

        {loading ? (
          <Card p="32px">
            <Stack align="center" justify="center" minH="180px" spacing="12px">
              <Spinner color="brand.500" size="lg" />
              <Text color={muted}>Carregando dados da API...</Text>
            </Stack>
          </Card>
        ) : null}

        <Grid templateColumns={{ base: '1fr', '2xl': '1.2fr 0.8fr' }} gap="20px">
          <GridItem>
            <Stack spacing="20px">
              <Box id={sectionIds.clientes}>
                <ClientesBlock
                  clientes={clientes}
                  clienteForm={clienteForm}
                  setClienteForm={setClienteForm}
                  handleSubmit={handleSubmit}
                  submitting={submitting}
                />
              </Box>

              <Box id={sectionIds.pedidos}>
                <PedidosBlock
                  clientes={clientes}
                  pedidos={pedidos}
                  pedidoForm={pedidoForm}
                  setPedidoForm={setPedidoForm}
                  enums={enums}
                  handleSubmit={handleSubmit}
                  submitting={submitting}
                  formatDate={formatDate}
                />
              </Box>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing="20px">
              <Box id={sectionIds.uniformes}>
                <UniformesBlock
                  enums={enums}
                  uniformeForm={uniformeForm}
                  setUniformeForm={setUniformeForm}
                  uniformes={uniformes}
                  handleSubmit={handleSubmit}
                  submitting={submitting}
                  muted={muted}
                />
              </Box>

              <SummaryBlock pedidos={pedidos} enums={enums} muted={muted} formatDate={formatDate} />
            </Stack>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  );
}
