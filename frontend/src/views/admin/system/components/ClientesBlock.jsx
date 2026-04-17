import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import DataCard from './DataCard';
import SectionHeader from './SectionHeader';

export default function ClientesBlock({ clientes, clienteForm, setClienteForm, handleSubmit, submitting }) {
  return (
    <DataCard title="Clientes" description="Cadastro rapido e lista sincronizada com /api/cliente.">
      <Grid templateColumns={{ base: '1fr', xl: '0.9fr 1.1fr' }} gap="20px">
        <Card variant="secondary" p="20px">
          <SectionHeader
            title="Novo cliente"
            description="Preencha os dados para cadastrar um novo cliente."
            tag="POST /api/cliente"
          />
          <form onSubmit={(event) => handleSubmit(event, 'cliente')}>
            <Stack spacing="14px">
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={clienteForm.nome}
                  onChange={(event) =>
                    setClienteForm((current) => ({ ...current, nome: event.target.value }))
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contato</FormLabel>
                <Input
                  value={clienteForm.contato}
                  onChange={(event) =>
                    setClienteForm((current) => ({ ...current, contato: event.target.value }))
                  }
                />
              </FormControl>
              <Button type="submit" colorScheme="brand" isLoading={submitting}>
                Salvar cliente
              </Button>
            </Stack>
          </form>
        </Card>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nome</Th>
                <Th>Contato</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clientes.length ? (
                clientes.map((cliente) => (
                  <Tr key={cliente.id}>
                    <Td>{cliente.id}</Td>
                    <Td>{cliente.nome}</Td>
                    <Td>{cliente.contato}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3}>Nenhum cliente cadastrado.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Grid>
    </DataCard>
  );
}
