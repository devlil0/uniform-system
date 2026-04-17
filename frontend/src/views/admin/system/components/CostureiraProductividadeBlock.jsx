import React from 'react';
import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import SectionHeader from './SectionHeader';

export default function CostureiraProductividadeBlock({ producao, costureiras }) {
  const porCostureira = {};

  producao.forEach((item) => {
    const nome = item.costureiraResponse?.nome;
    if (!nome) return;
    if (!porCostureira[nome]) {
      porCostureira[nome] = { total: 0, concluidas: 0 };
    }
    porCostureira[nome].total += 1;
    if (item.saida) {
      porCostureira[nome].concluidas += 1;
    }
  });

  const ranking = Object.entries(porCostureira)
    .map(([nome, dados]) => ({ nome, ...dados }))
    .sort((a, b) => b.total - a.total);

  const semProducao = costureiras.filter(
    (c) => !porCostureira[c.nome]
  );

  if (costureiras.length === 0) return null;

  return (
    <Card p="24px">
      <SectionHeader
        title="Produtividade das costureiras"
        description="Tarefas de produção registradas por costureira."
      />
      <Stack spacing="10px">
        {ranking.length === 0 && (
          <Text fontSize="sm" color="secondaryGray.500">
            Nenhuma produção registrada ainda.
          </Text>
        )}
        {ranking.map((item, index) => {
          const pct = item.total > 0 ? Math.round((item.concluidas / item.total) * 100) : 0;
          return (
            <Flex key={item.nome} align="center" gap="12px" p="10px 14px" borderRadius="10px" bg="secondaryGray.50">
              <Text
                fontSize="sm"
                fontWeight="800"
                color="secondaryGray.400"
                minW="24px"
                textAlign="center"
              >
                #{index + 1}
              </Text>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="600">
                  {item.nome}
                </Text>
                <Box mt="4px" h="4px" borderRadius="full" bg="secondaryGray.200" overflow="hidden">
                  <Box h="100%" w={`${pct}%`} bg="brand.500" borderRadius="full" transition="width 0.4s ease" />
                </Box>
              </Box>
              <Flex gap="8px" align="center">
                <Badge colorScheme="brand" fontSize="xs">
                  {item.total} {item.total === 1 ? 'tarefa' : 'tarefas'}
                </Badge>
                <Badge colorScheme="green" fontSize="xs">
                  {item.concluidas} concluídas
                </Badge>
              </Flex>
            </Flex>
          );
        })}
        {semProducao.length > 0 && (
          <Flex
            wrap="wrap"
            gap="8px"
            mt="4px"
            p="10px 14px"
            borderRadius="10px"
            bg="secondaryGray.50"
            align="center"
          >
            <Text fontSize="xs" color="secondaryGray.500" mr="4px">
              Sem tarefas:
            </Text>
            {semProducao.map((c) => (
              <Badge key={c.id} colorScheme="gray" fontSize="xs">
                {c.nome}
              </Badge>
            ))}
          </Flex>
        )}
      </Stack>
    </Card>
  );
}
