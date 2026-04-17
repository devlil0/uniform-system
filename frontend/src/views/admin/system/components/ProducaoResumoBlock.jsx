import React from 'react';
import { Badge, Box, Flex, Grid, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import SectionHeader from './SectionHeader';

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

export default function ProducaoResumoBlock({ producao, etapas, loading }) {
  const muted = useColorModeValue('secondaryGray.600', 'secondaryGray.400');
  const etapaCardBgLight = 'whiteAlpha.100';
  const isLight = useColorModeValue(true, false);

  const contagemPorEtapa = etapas.reduce((acc, etapa) => {
    acc[etapa] = producao.filter((p) => p.etapa === etapa).length;
    return acc;
  }, {});

  const total = producao.length;
  const despachados = contagemPorEtapa['DESPACHADO'] || 0;
  const ativos = total - despachados;

  return (
    <Card p="24px">
      <SectionHeader
        title="Produção"
        description="Distribuição dos registros de produção por etapa."
      />

      <Flex gap="16px" mb="20px" wrap="wrap">
        <Box>
          <Text fontSize="2xl" fontWeight="800" lineHeight="1" color="brand.500">{loading ? '—' : ativos}</Text>
          <Text fontSize="xs" color={muted} mt="3px">Pedidos em Produção</Text>
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="800" lineHeight="1" color="green.500">{loading ? '—' : despachados}</Text>
          <Text fontSize="xs" color={muted} mt="3px">Despachados</Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} gap="10px">
        {etapas.map((etapa) => {
          const count = contagemPorEtapa[etapa] || 0;
          const color = ETAPA_COLOR[etapa] || 'gray';
          return (
            <Flex
              key={etapa}
              direction="column"
              align="center"
              p="12px 8px"
              borderRadius="10px"
              bg={isLight ? `${color}.50` : `${color}.900`}
              gap="6px"
            >
              <Text fontSize="xl" fontWeight="800" color={`${color}.500`} lineHeight="1">
                {loading ? '—' : count}
              </Text>
              <Badge colorScheme={color} fontSize="9px" textTransform="uppercase" letterSpacing="0.05em">
                {ETAPA_LABEL[etapa] || etapa}
              </Badge>
            </Flex>
          );
        })}
      </Grid>
    </Card>
  );
}
