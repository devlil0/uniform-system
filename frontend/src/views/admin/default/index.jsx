import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Progress,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {
  MdAssignment,
  MdDeliveryDining,
  MdFactory,
  MdMoveToInbox,
  MdRefresh,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import SectionHeader from 'views/admin/system/components/SectionHeader';
import logo from 'assets/img/logo.png';
import { api } from 'services/api';

const ETAPA_LABEL = {
  CORTE: 'Corte',
  COSTURA: 'Costura',
  ACABAMENTO: 'Acabamento',
  ESTAMPA: 'Estampa',
  EMBALAGEM: 'Embalagem',
  DESPACHADO: 'Despachado',
};

const ESTOQUE_MINIMO = 5;

const todayLabel = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date());

const KpiCard = memo(function KpiCard({ label, value, hint, icon, accent, onClick }) {
  return (
    <Card
      p="22px"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      _hover={onClick ? { transform: 'translateY(-2px)' } : undefined}
      transition="transform 0.18s ease"
      borderTop="4px solid"
      borderColor={accent}
    >
      <Flex justify="space-between" align="flex-start" gap="16px">
        <Box>
          <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.08em" color="secondaryGray.500" mb="8px">
            {label}
          </Text>
          <Heading size="lg" mb="6px">
            {value}
          </Heading>
          <Text fontSize="sm" color="secondaryGray.600">
            {hint}
          </Text>
        </Box>
        <Flex
          w="48px"
          h="48px"
          borderRadius="16px"
          align="center"
          justify="center"
          bg={accent}
          color="white"
          flexShrink={0}
        >
          <Box as={icon} boxSize="24px" />
        </Flex>
      </Flex>
    </Card>
  );
});

export default function DashboardPage() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [producao, setProducao] = useState([]);
  const [fardos, setFardos] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [enums, setEnums] = useState({ etapaProducao: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const headline = useColorModeValue('secondaryGray.900', 'white');
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.400');
  const subtle = useColorModeValue('secondaryGray.500', 'secondaryGray.400');
  const heroBg = useColorModeValue(
    'linear-gradient(135deg, #f8fbff 0%, #eef4ff 48%, #f5f1ea 100%)',
    'linear-gradient(135deg, rgba(17,28,44,0.95) 0%, rgba(17,28,44,0.88) 55%, rgba(34,53,84,0.92) 100%)'
  );

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [
        clientesData,
        pedidosData,
        enumsData,
        estoqueData,
        producaoData,
        fardosData,
        entregasData,
      ] = await Promise.all([
        api.getClientes(),
        api.getPedidos(),
        api.getEnums(),
        api.getEstoque(),
        api.getProducao(),
        api.getFardos(),
        api.getEntregas(),
      ]);

      setClientes(clientesData);
      setPedidos(pedidosData);
      setEstoque(estoqueData);
      setProducao(producaoData || []);
      setFardos(fardosData || []);
      setEntregas(entregasData || []);
      setEnums({ etapaProducao: enumsData.etapaProducao || [] });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const dashboard = useMemo(() => {
    const pendentes = pedidos.filter((pedido) => pedido.status === 'PENDENTE');
    const emProducao = pedidos.filter((pedido) => pedido.status === 'EM_PRODUCAO');
    const finalizados = pedidos.filter((pedido) => pedido.status === 'FINALIZADO');

    const porEtapa = (enums.etapaProducao || []).map((etapa) => {
      const total = producao.filter((item) => item.etapa === etapa).length;
      return { etapa, total };
    });

    const maiorEtapa = Math.max(...porEtapa.map((item) => item.total), 1);
    const estoqueBaixo = estoque.filter((item) => item.quantidade <= ESTOQUE_MINIMO);
    const estoqueCritico = estoque.filter((item) => item.quantidade === 0);
    const entregasPendentes = entregas.filter((entrega) => entrega.status === 'PENDENTE');
    const emTransito = entregas.filter((entrega) => entrega.status === 'EM_TRANSITO');
    const devolvidas = entregas.filter((entrega) => entrega.status === 'DEVOLVIDO');
    const entregues = entregas.filter((entrega) => entrega.status === 'ENTREGUE');
    const pedidosSemProducao = pendentes.filter(
      (pedido) => !producao.some((item) => item.pedidoResponse?.id === pedido.id)
    );

    const topClientes = Object.values(
      pedidos.reduce((acc, pedido) => {
        const cliente = pedido.clienteResponse;
        if (!cliente?.id) return acc;
        if (!acc[cliente.id]) {
          acc[cliente.id] = { id: cliente.id, nome: cliente.nome, total: 0 };
        }
        acc[cliente.id].total += 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const rankingCostureiras = Object.values(
      producao.reduce((acc, item) => {
        const costureira = item.costureiraResponse;
        if (!costureira?.id) return acc;
        if (!acc[costureira.id]) {
          acc[costureira.id] = { id: costureira.id, nome: costureira.nome, total: 0, concluidas: 0 };
        }
        acc[costureira.id].total += 1;
        if (item.saida) {
          acc[costureira.id].concluidas += 1;
        }
        return acc;
      }, {})
    )
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const rankingEntregadores = Object.values(
      entregas.reduce((acc, item) => {
        const entregador = item.entregadorResponse;
        if (!entregador?.id) return acc;
        if (!acc[entregador.id]) {
          acc[entregador.id] = {
            id: entregador.id,
            nome: entregador.nome,
            total: 0,
            concluidas: 0,
          };
        }
        acc[entregador.id].total += 1;
        if (item.status === 'ENTREGUE') {
          acc[entregador.id].concluidas += 1;
        }
        return acc;
      }, {})
    )
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      pendentes,
      emProducao,
      finalizados,
      porEtapa,
      maiorEtapa,
      estoqueBaixo,
      estoqueCritico,
      entregasPendentes,
      emTransito,
      devolvidas,
      entregues,
      pedidosSemProducao,
      topClientes,
      rankingCostureiras,
      rankingEntregadores,
    };
  }, [pedidos, enums.etapaProducao, producao, estoque, entregas]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Stack spacing="24px">
        <Card p={{ base: '24px', md: '30px' }} bgImage={heroBg} overflow="hidden">
          <Flex direction={{ base: 'column', xl: 'row' }} justify="space-between" gap="24px">
            <Flex align="flex-start" gap="14px">
              <Image src={logo} alt="IU Uniformes" w="52px" h="52px" borderRadius="14px" bg="transparent" />
              <Box>
                <Badge colorScheme="blue" borderRadius="full" px="10px" py="4px" mb="10px">
                  Centro de Operações
                </Badge>
                <Heading size="lg" color={headline} mb="6px">
                  Olá, Thiago Siqueira.
                </Heading>
                <Text color={muted} maxW="620px">
                  Central de monitoramento da operação. Visualize pedidos em tempo real, produção e expedição em um só lugar, de forma totalmente digitalizada.
                </Text>
                <Text fontSize="sm" color={subtle} mt="10px" textTransform="capitalize">
                  {todayLabel}
                </Text>
              </Box>
            </Flex>
            <VStack align={{ base: 'stretch', xl: 'end' }} spacing="12px">
              <Button
                leftIcon={<MdRefresh />}
                colorScheme="brand"
                variant="outline"
                onClick={loadData}
                isLoading={loading}
              >
                Atualizar dados
              </Button>
              <SimpleGrid columns={2} gap="10px" w={{ base: '100%', md: '320px' }}>
                <Card p="14px">
                  <Text fontSize="xs" color={subtle} textTransform="uppercase" fontWeight="800" mb="4px">
                    Base
                  </Text>
                  <Text fontSize="2xl" fontWeight="800">
                    {loading ? '—' : clientes.length}
                  </Text>
                  <Text fontSize="sm" color={muted}>
                    clientes cadastrados
                  </Text>
                </Card>
                <Card p="14px">
                  <Text fontSize="xs" color={subtle} textTransform="uppercase" fontWeight="800" mb="4px">
                    Operação
                  </Text>
                  <Text fontSize="2xl" fontWeight="800">
                    {loading ? '—' : producao.length}
                  </Text>
                  <Text fontSize="sm" color={muted}>
                    registros de produção
                  </Text>
                </Card>
              </SimpleGrid>
            </VStack>
          </Flex>
        </Card>

        {error && (
          <Alert status="error" borderRadius="16px">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <Card p="32px">
            <Stack align="center" justify="center" minH="180px" spacing="12px">
              <Spinner color="brand.500" size="lg" />
              <Text color={muted}>Montando a visão inicial...</Text>
            </Stack>
          </Card>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px">
              <KpiCard
                label="Pedidos Pendentes"
                value={dashboard.pendentes.length}
                hint={`${dashboard.pedidosSemProducao.length} ainda sem produção iniciada`}
                icon={MdAssignment}
                accent="orange.400"
                onClick={() => navigate('/admin/pedidos')}
              />
              <KpiCard
                label="Em Produção"
                value={dashboard.emProducao.length}
                hint={`${producao.length} registros ativos no chão de fábrica`}
                icon={MdFactory}
                accent="blue.400"
                onClick={() => navigate('/admin/producao')}
              />
              <KpiCard
                label="Fardos"
                value={fardos.length}
                hint={`${dashboard.finalizados.length} pedidos finalizados`}
                icon={MdMoveToInbox}
                accent="green.400"
                onClick={() => navigate('/admin/fardos')}
              />
              <KpiCard
                label="Entregas Pendentes"
                value={dashboard.entregasPendentes.length}
                hint={`${dashboard.emTransito.length} em trânsito agora`}
                icon={MdDeliveryDining}
                accent="purple.400"
                onClick={() => navigate('/admin/entregas')}
              />
            </SimpleGrid>

            <Card p="24px">
              <SectionHeader
                title="Produção por etapa"
                description="Onde os pedidos estão concentrados agora."
              />
              <SimpleGrid columns={{ base: 2, md: 3, xl: 6 }} gap="16px">
                {dashboard.porEtapa.map((item) => (
                  <Card key={item.etapa} p="18px">
                    <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.08em" color="secondaryGray.500" mb="8px">
                      {ETAPA_LABEL[item.etapa] || item.etapa}
                    </Text>
                    <Text
                      fontSize="3xl"
                      fontWeight="800"
                      color={item.etapa === 'DESPACHADO' ? 'green.400' : 'brand.400'}
                      lineHeight="1"
                    >
                      {item.total}
                    </Text>
                    <Text fontSize="sm" color="secondaryGray.600" mt="8px">
                      registros na etapa
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </Card>

            <Grid templateColumns={{ base: '1fr', xl: '0.9fr 1.1fr' }} gap="20px">
              <GridItem>
                <Stack spacing="20px">
                  <Card p="24px">
                    <SectionHeader
                      title="Top clientes"
                      description="Clientes com maior volume de pedidos."
                    />
                    <Stack spacing="12px">
                      {dashboard.topClientes.length ? (
                        dashboard.topClientes.map((cliente, index) => (
                          <Flex key={cliente.id} align="center" justify="space-between" p="10px 12px" borderRadius="12px" bg="secondaryGray.50">
                            <HStack spacing="12px">
                              <Flex w="32px" h="32px" borderRadius="full" bg="brand.500" color="white" align="center" justify="center" fontWeight="800">
                                {index + 1}
                              </Flex>
                              <Box>
                                <Text fontWeight="700">{cliente.nome}</Text>
                                <Text fontSize="sm" color={muted}>atividade comercial</Text>
                              </Box>
                            </HStack>
                            <Badge colorScheme="brand" borderRadius="full" px="10px" py="4px">
                              {cliente.total} pedidos
                            </Badge>
                          </Flex>
                        ))
                      ) : (
                        <Text color={muted}>Ainda não há pedidos suficientes para ranking.</Text>
                      )}
                    </Stack>
                  </Card>

                  <Card p="24px">
                    <SectionHeader
                      title="Top Costureiras"
                      description="Costureiras com mais registros de produção."
                    />
                    <Stack spacing="12px">
                      {dashboard.rankingCostureiras.length ? (
                        dashboard.rankingCostureiras.map((item) => {
                          const progresso = item.total ? Math.round((item.concluidas / item.total) * 100) : 0;
                          return (
                            <Box key={item.id} p="12px" borderRadius="12px" bg="secondaryGray.50">
                              <Flex justify="space-between" mb="8px" gap="10px">
                                <Text fontWeight="700">{item.nome}</Text>
                                <Text fontSize="sm" color={muted}>
                                  {item.concluidas}/{item.total} concluídas
                                </Text>
                              </Flex>
                              <Progress value={progresso} size="sm" borderRadius="full" colorScheme="green" />
                            </Box>
                          );
                        })
                      ) : (
                        <Text color={muted}>Nenhuma produtividade registrada ainda.</Text>
                      )}
                    </Stack>
                  </Card>
                </Stack>
              </GridItem>
              <GridItem>
                <Card p="24px">
                  <SectionHeader
                    title="Top Entregadores"
                    description="Entregadores com mais entregas registradas."
                  />
                  <Stack spacing="12px">
                    {dashboard.rankingEntregadores.length ? (
                      dashboard.rankingEntregadores.map((item) => {
                        const progresso = item.total ? Math.round((item.concluidas / item.total) * 100) : 0;
                        return (
                          <Box key={item.id} p="12px" borderRadius="12px" bg="secondaryGray.50">
                            <Flex justify="space-between" mb="8px" gap="10px">
                              <Text fontWeight="700">{item.nome}</Text>
                              <Text fontSize="sm" color={muted}>
                                {item.concluidas}/{item.total} concluídas
                              </Text>
                            </Flex>
                            <Progress value={progresso} size="sm" borderRadius="full" colorScheme="purple" />
                          </Box>
                        );
                      })
                    ) : (
                      <Text color={muted}>Nenhuma entrega registrada ainda.</Text>
                    )}
                  </Stack>
                </Card>
              </GridItem>
            </Grid>
          </>
        )}
      </Stack>
    </Box>
  );
}
