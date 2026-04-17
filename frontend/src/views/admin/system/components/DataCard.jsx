import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';
import SectionHeader from './SectionHeader';

export default function DataCard({ title, description, children, aside }) {
  return (
    <Card p="24px">
      <SectionHeader title={title} description={description} />
      {aside ? (
        <Flex gap="24px" direction={{ base: 'column', xl: 'row' }} align="flex-start">
          <Box w={{ base: '100%', xl: '320px' }} flexShrink={0}>{aside}</Box>
          <Box flex="1" minW={0} overflow="hidden">{children}</Box>
        </Flex>
      ) : children}
    </Card>
  );
}
