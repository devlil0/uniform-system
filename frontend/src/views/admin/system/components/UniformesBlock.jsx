import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import DataCard from './DataCard';
import SectionHeader from './SectionHeader';

export default function UniformesBlock({
  enums,
  uniformeForm,
  setUniformeForm,
  uniformes,
  handleSubmit,
  submitting,
  muted,
}) {
  return (
    <DataCard title="Uniformes" description="Catalogo inicial com os campos exigidos por /api/uniforme.">
      <SectionHeader
        title="Novo uniforme"
        description="A lista de enums vem de /api/enums para refletivo e tamanho."
        tag="POST /api/uniforme"
      />
      <form onSubmit={(event) => handleSubmit(event, 'uniforme')}>
        <Stack spacing="14px" mb="20px">
          <FormControl isRequired>
            <FormLabel>Tipo</FormLabel>
            <Select
              placeholder="Selecione o uniforme"
              value={uniformeForm.nome}
              onChange={(event) =>
                setUniformeForm((current) => ({ ...current, nome: event.target.value }))
              }
            >
              {enums.nomeUniforme.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Malha</FormLabel>
            <Input
              value={uniformeForm.malha}
              onChange={(event) =>
                setUniformeForm((current) => ({ ...current, malha: event.target.value }))
              }
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tamanho</FormLabel>
            <Select
              placeholder="Selecione o tamanho"
              value={uniformeForm.tamanho}
              onChange={(event) =>
                setUniformeForm((current) => ({ ...current, tamanho: event.target.value }))
              }
            >
              {enums.tamanho.map((tamanho) => (
                <option key={tamanho} value={tamanho}>
                  {tamanho}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Refletivo</FormLabel>
            <Select
              placeholder="Selecione"
              value={uniformeForm.refletivo}
              onChange={(event) =>
                setUniformeForm((current) => ({
                  ...current,
                  refletivo: event.target.value,
                }))
              }
            >
              {enums.refletivo.map((refletivo) => (
                <option key={refletivo} value={refletivo}>
                  {refletivo}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Cor</FormLabel>
            <Select
              placeholder="Selecione a cor"
              value={uniformeForm.cor}
              onChange={(event) =>
                setUniformeForm((current) => ({ ...current, cor: event.target.value }))
              }
            >
              {enums.cor.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={submitting}>
            Salvar uniforme
          </Button>
        </Stack>
      </form>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Nome</Th>
              <Th>Tamanho</Th>
              <Th>Cor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {uniformes.length ? (
              uniformes.map((uniforme) => (
                <Tr key={uniforme.id}>
                  <Td>{uniforme.id}</Td>
                  <Td>
                    <Text fontWeight="700">{uniforme.nome}</Text>
                    <Text fontSize="xs" color={muted}>
                      {uniforme.malha}
                    </Text>
                  </Td>
                  <Td>{uniforme.tamanho}</Td>
                  <Td>{uniforme.cor}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4}>Nenhum uniforme cadastrado.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </DataCard>
  );
}
