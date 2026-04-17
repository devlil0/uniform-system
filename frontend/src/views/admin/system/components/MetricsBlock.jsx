import React from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { MdAssignment, MdInventory2, MdPeople } from 'react-icons/md';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';

export default function MetricsBlock({ loading, brandColor, boxBg, clientes, pedidos, uniformes }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="20px">
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Box as={MdPeople} color={brandColor} boxSize="28px" />}
          />
        }
        name="Clientes"
        value={loading ? '...' : String(clientes.length)}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Box as={MdAssignment} color={brandColor} boxSize="28px" />}
          />
        }
        name="Pedidos"
        value={loading ? '...' : String(pedidos.length)}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={<Box as={MdInventory2} color={brandColor} boxSize="28px" />}
          />
        }
        name="Uniformes"
        value={loading ? '...' : String(uniformes.length)}
      />
    </SimpleGrid>
  );
}
