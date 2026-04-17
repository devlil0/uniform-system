import React from 'react';
import { Alert, AlertIcon, Badge, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { MdWarning } from 'react-icons/md';
import Card from 'components/card/Card';
import SectionHeader from './SectionHeader';

const ESTOQUE_MINIMO = 5;

export default function AlertasBlock({ estoque }) {
  const baixos = estoque.filter((item) => item.quantidade <= ESTOQUE_MINIMO);

  if (baixos.length === 0) return null;

  return (
    <Card p="24px" borderLeft="4px solid" borderColor="orange.400">
      <SectionHeader
        title="Alertas operacionais"
        description="Itens que precisam de atenção imediata."
      />
      <Stack spacing="10px">
        {baixos.map((item) => {
          const nome = item.uniformeResponse?.nome || `Item #${item.id}`;
          const tamanho = item.uniformeResponse?.tamanho;
          const cor = item.uniformeResponse?.cor;
          const semEstoque = item.quantidade === 0;

          return (
            <Flex
              key={item.id}
              justify="space-between"
              align="center"
              p="10px 14px"
              borderRadius="10px"
              bg={semEstoque ? 'red.50' : 'orange.50'}
            >
              <Flex align="center" gap="10px">
                <Box as={MdWarning} color={semEstoque ? 'red.500' : 'orange.400'} boxSize="18px" flexShrink={0} />
                <Box>
                  <Text fontSize="sm" fontWeight="600" color={semEstoque ? 'red.700' : 'orange.700'}>
                    {nome}
                    {tamanho && <Text as="span" fontWeight="400"> — {tamanho}</Text>}
                    {cor && <Text as="span" fontWeight="400"> / {cor}</Text>}
                  </Text>
                  {item.vinculadoCliente && item.clienteResponse && (
                    <Text fontSize="xs" color="secondaryGray.600">
                      Cliente: {item.clienteResponse.nome}
                    </Text>
                  )}
                </Box>
              </Flex>
              <Badge colorScheme={semEstoque ? 'red' : 'orange'} fontSize="sm" px="10px" py="4px" borderRadius="8px">
                {semEstoque ? 'Sem estoque' : `${item.quantidade} un.`}
              </Badge>
            </Flex>
          );
        })}
      </Stack>
      <Alert status="warning" borderRadius="10px" mt="16px" fontSize="sm">
        <AlertIcon />
        {baixos.length} {baixos.length === 1 ? 'item abaixo' : 'itens abaixo'} do nível mínimo ({ESTOQUE_MINIMO} unidades).
      </Alert>
    </Card>
  );
}
