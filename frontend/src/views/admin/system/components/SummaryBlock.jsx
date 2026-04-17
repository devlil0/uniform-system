import React from 'react';
import { Flex, Stack, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import SectionHeader from './SectionHeader';

export default function SummaryBlock({ pedidos, enums, muted, formatDate }) {
  return (
    <Card p="24px">
      <SectionHeader
        title="Resumo operacional"
        description="Leitura rapida do estado atual do sistema."
      />
      <Stack spacing="12px">
        <Flex justify="space-between">
          <Text color={muted}>Clientes com pedidos</Text>
          <Text fontWeight="700">
            {
              new Set(
                pedidos
                  .map((pedido) => pedido.clienteResponse?.id)
                  .filter((value) => value !== undefined && value !== null)
              ).size
            }
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text color={muted}>Ultimo pedido</Text>
          <Text fontWeight="700">{pedidos.length ? formatDate(pedidos[0].createdAt) : '-'}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text color={muted}>Total de tamanhos disponiveis</Text>
          <Text fontWeight="700">{enums.tamanho.length}</Text>
        </Flex>
      </Stack>
    </Card>
  );
}
