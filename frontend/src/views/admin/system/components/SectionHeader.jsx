import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

export default function SectionHeader({ title, description }) {
  return (
    <Flex justify="space-between" align={{ base: 'start', md: 'center' }} gap="12px" mb="18px" wrap="wrap">
      <Box>
        <Heading size="md" mb="6px">
          {title}
        </Heading>
        <Text color="secondaryGray.600" fontSize="sm">
          {description}
        </Text>
      </Box>
    </Flex>
  );
}
