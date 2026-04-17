import React from 'react';
import { Badge, Box, Button, Divider, Flex, Heading, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';
import Card from 'components/card/Card';

const ETAPA_COLOR = {
  CORTE:      'red',
  COSTURA:    'orange',
  ACABAMENTO: 'yellow',
  ESTAMPA:    'purple',
  EMBALAGEM:  'blue',
  DESPACHADO: 'green',
};

const ETAPA_LABEL = {
  CORTE:      'Corte',
  COSTURA:    'Costura',
  ACABAMENTO: 'Acabamento',
  ESTAMPA:    'Estampa',
  EMBALAGEM:  'Embalagem',
  DESPACHADO: 'Despachado',
};

function SectionLabel({ children }) {
  return (
    <Text
      fontSize="10px"
      fontWeight="700"
      textTransform="uppercase"
      letterSpacing="0.1em"
      color="secondaryGray.500"
      mb="10px"
    >
      {children}
    </Text>
  );
}

function StatPill({ label, value, colorScheme }) {
  return (
    <Box textAlign="center" px="16px" py="10px" borderRadius="12px" bg={`${colorScheme}.50`}>
      <Text fontSize="xl" fontWeight="800" color={`${colorScheme}.500`} lineHeight="1">
        {value}
      </Text>
      <Text fontSize="xs" color={`${colorScheme}.600`} mt="4px" fontWeight="500">
        {label}
      </Text>
    </Box>
  );
}

function EtapaChip({ etapa, count, loading }) {
  const color = ETAPA_COLOR[etapa] || 'gray';
  return (
    <Flex
      direction="column"
      align="center"
      px="10px"
      py="8px"
      borderRadius="10px"
      bg={`${color}.500`}
      gap="4px"
      minW="60px"
    >
      <Text fontSize="lg" fontWeight="800" color="white" lineHeight="1">
        {loading ? '—' : count}
      </Text>
      <Text fontSize="9px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em" color="whiteAlpha.800">
        {ETAPA_LABEL[etapa] || etapa}
      </Text>
    </Flex>
  );
}

function today() {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export default function HeroBlock({ loading, onRefresh, headline, clientes, pedidos, uniformes, producao, etapas }) {
  const pendentes  = pedidos.filter((p) => p.status === 'PENDENTE').length;
  const emProducao = pedidos.filter((p) => p.status === 'EM_PRODUCAO').length;
  const finalizados = pedidos.filter((p) => p.status === 'FINALIZADO').length;
  const enviados   = pedidos.filter((p) => p.status === 'ENVIADO').length;
  const cancelados = pedidos.filter((p) => p.status === 'CANCELADO').length;

  const contagemPorEtapa = (etapas || []).reduce((acc, etapa) => {
    acc[etapa] = (producao || []).filter((p) => p.etapa === etapa).length;
    return acc;
  }, {});

  const despachados    = contagemPorEtapa['DESPACHADO'] || 0;
  const totalProducao  = (producao || []).length;
  const emAndamento    = totalProducao - despachados;

  return (
    <Card p={{ base: '24px', md: '28px' }}>
      <Flex direction={{ base: 'column', xl: 'row' }} justify="space-between" gap="28px">

        {/* Coluna principal */}
        <Box flex="1">
          <Heading size="lg" color={headline} mb="4px">
            Olá, Thiago Siqueira.
          </Heading>
          <Text color="secondaryGray.600" fontSize="sm" textTransform="capitalize" mb="20px">
            {today()}
          </Text>

          {/* Seção Geral */}
          <SectionLabel>Geral</SectionLabel>
          <SimpleGrid columns={{ base: 2, md: 3 }} gap="10px" maxW="520px">
            <StatPill label="Pendentes"   value={loading ? '—' : pendentes}   colorScheme="orange" />
            <StatPill label="Em produção" value={loading ? '—' : emProducao}  colorScheme="blue"   />
            <StatPill label="Finalizados" value={loading ? '—' : finalizados} colorScheme="green"  />
            <StatPill label="Enviados"    value={loading ? '—' : enviados}    colorScheme="teal"   />
            <StatPill label="Cancelados"  value={loading ? '—' : cancelados}  colorScheme="red"    />
          </SimpleGrid>

          <Divider my="18px" maxW="520px" />

          {/* Seção Produção */}
          <Heading size="lg" color={headline} mb="4px">Produção</Heading>
          <Flex gap="16px" mb="14px" align="center">
            <Box>
              <Text fontSize="xl" fontWeight="800" color="brand.500" lineHeight="1">
                {loading ? '—' : emAndamento}
              </Text>
              <Text fontSize="xs" color="secondaryGray.600" mt="3px">Pedidos em produção</Text>
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="800" color="green.500" lineHeight="1">
                {loading ? '—' : despachados}
              </Text>
              <Text fontSize="xs" color="secondaryGray.600" mt="3px">Despachados</Text>
            </Box>
          </Flex>
          <Flex gap="8px" wrap="wrap">
            {(etapas || []).map((etapa) => (
              <EtapaChip
                key={etapa}
                etapa={etapa}
                count={contagemPorEtapa[etapa] || 0}
                loading={loading}
              />
            ))}
          </Flex>
        </Box>

        {/* Coluna direita */}
        <Flex direction="column" justify="space-between" gap="16px" minW={{ base: '100%', xl: '200px' }}>
          <Box>
            <Text fontSize="xs" fontWeight="700" color="secondaryGray.600" textTransform="uppercase" letterSpacing="0.08em" mb="10px">
              Resumo geral
            </Text>
            <Flex direction="column" gap="8px">
              <Flex justify="space-between">
                <Text fontSize="sm" color="secondaryGray.600">Clientes</Text>
                <Badge colorScheme="purple">{loading ? '...' : clientes.length}</Badge>
              </Flex>
              <Flex justify="space-between">
                <Text fontSize="sm" color="secondaryGray.600">Pedidos</Text>
                <Badge colorScheme="brand">{loading ? '...' : pedidos.length}</Badge>
              </Flex>
              <Flex justify="space-between">
                <Text fontSize="sm" color="secondaryGray.600">Uniformes</Text>
                <Badge colorScheme="teal">{loading ? '...' : uniformes.length}</Badge>
              </Flex>
            </Flex>
          </Box>
          <Button
            size="sm"
            colorScheme="brand"
            variant="outline"
            leftIcon={<MdRefresh />}
            onClick={onRefresh}
            isLoading={loading}
          >
            Atualizar
          </Button>
        </Flex>

      </Flex>
    </Card>
  );
}
