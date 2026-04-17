import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import {
  MdAssignment,
  MdDashboard,
  MdDeliveryDining,
  MdInventory2,
  MdLocalShipping,
  MdMoveToInbox,
  MdPeople,
  MdStraighten,
  MdWarehouse,
} from 'react-icons/md';
import { api } from 'services/api';

const PAGES = [
  { label: 'Dashboard',    path: '/admin/default',      icon: MdDashboard },
  { label: 'Clientes',     path: '/admin/clientes',     icon: MdPeople },
  { label: 'Pedidos',      path: '/admin/pedidos',      icon: MdAssignment },
  { label: 'Produção',     path: '/admin/producao',     icon: MdStraighten },
  { label: 'Uniformes',    path: '/admin/uniformes',    icon: MdInventory2 },
  { label: 'Estoque',      path: '/admin/estoque',      icon: MdWarehouse },
  { label: 'Costureiras',  path: '/admin/costureiras',  icon: MdStraighten },
  { label: 'Entregadores', path: '/admin/entregadores', icon: MdLocalShipping },
  { label: 'Fardos',       path: '/admin/fardos',       icon: MdMoveToInbox },
  { label: 'Entregas',     path: '/admin/entregas',     icon: MdDeliveryDining },
];

const STATUS_LABEL = {
  PENDENTE:    { label: 'Pendente',    color: 'orange' },
  EM_PRODUCAO: { label: 'Em produção', color: 'blue' },
  FINALIZADO:  { label: 'Finalizado',  color: 'green' },
  ENVIADO:     { label: 'Enviado',     color: 'teal' },
  CANCELADO:   { label: 'Cancelado',   color: 'red' },
};

function highlight(text, query) {
  if (!query) return text;
  const idx = String(text).toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {String(text).slice(0, idx)}
      <Box as="mark" bg="brand.100" color="brand.700" borderRadius="2px" px="1px">
        {String(text).slice(idx, idx + query.length)}
      </Box>
      {String(text).slice(idx + query.length)}
    </>
  );
}

function ResultItem({ icon, label, sublabel, badge, badgeColor, active, onClick }) {
  const activeBg   = useColorModeValue('brand.50',  'navy.700');
  const hoverBg    = useColorModeValue('gray.50',   'navy.800');
  const textColor  = useColorModeValue('gray.800',  'white');
  const mutedColor = useColorModeValue('gray.500',  'gray.400');
  const iconBg     = useColorModeValue('gray.100',  'navy.600');
  const iconColor  = useColorModeValue('gray.600',  'gray.300');

  return (
    <Flex
      align="center"
      gap="10px"
      px="12px"
      py="8px"
      cursor="pointer"
      borderRadius="8px"
      bg={active ? activeBg : 'transparent'}
      _hover={{ bg: active ? activeBg : hoverBg }}
      onClick={onClick}
      transition="background 0.1s"
    >
      {icon && (
        <Flex
          align="center"
          justify="center"
          w="28px"
          h="28px"
          borderRadius="6px"
          bg={iconBg}
          flexShrink={0}
        >
          <Icon as={icon} boxSize="14px" color={iconColor} />
        </Flex>
      )}
      <Box flex="1" minW={0}>
        <Text fontSize="sm" fontWeight="500" color={textColor} noOfLines={1}>
          {label}
        </Text>
        {sublabel && (
          <Text fontSize="xs" color={mutedColor} noOfLines={1}>
            {sublabel}
          </Text>
        )}
      </Box>
      {badge && (
        <Box
          fontSize="10px"
          fontWeight="600"
          px="7px"
          py="2px"
          borderRadius="full"
          bg={`${badgeColor}.100`}
          color={`${badgeColor}.700`}
          flexShrink={0}
        >
          {badge}
        </Box>
      )}
    </Flex>
  );
}

function SectionLabel({ children }) {
  const color = useColorModeValue('gray.400', 'gray.500');
  return (
    <Text fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color={color} px="12px" pt="10px" pb="4px">
      {children}
    </Text>
  );
}

export function GlobalSearch(props) {
  const { me, mb, borderRadius, ...rest } = props;

  const [query, setQuery]       = useState('');
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [loaded, setLoaded]     = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [data, setData]         = useState({ clientes: [], pedidos: [], costureiras: [] });

  const inputRef    = useRef(null);
  const containerRef = useRef(null);
  const navigate    = useNavigate();

  const inputText  = useColorModeValue('gray.700', 'gray.100');
  const dropBg     = useColorModeValue('white', 'navy.800');
  const dropShadow = useColorModeValue(
    '0 8px 32px rgba(0,0,0,0.12)',
    '0 8px 32px rgba(0,0,0,0.4)'
  );
  const borderColor = useColorModeValue('gray.100', 'navy.700');

  const fetchData = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const [clientes, pedidos, costureiras] = await Promise.all([
        api.getClientes(),
        api.getPedidos(),
        api.getCostureiras(),
      ]);
      setData({ clientes, pedidos, costureiras });
      setLoaded(true);
    } catch (_) {}
    finally { setLoading(false); }
  }, [loaded]);

  const handleFocus = () => {
    setOpen(true);
    fetchData();
  };

  const handleBlur = useCallback((e) => {
    if (containerRef.current && containerRef.current.contains(e.relatedTarget)) return;
    setOpen(false);
  }, []);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const q = query.trim().toLowerCase();

  const filteredPages = PAGES.filter((p) => p.label.toLowerCase().includes(q));

  const filteredPedidos = q
    ? data.pedidos.filter(
        (p) =>
          String(p.id).includes(q) ||
          (p.clienteResponse?.nome || '').toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const filteredClientes = q
    ? data.clientes.filter((c) => c.nome?.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const filteredCostureiras = q
    ? data.costureiras.filter((c) => c.nome?.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const allItems = [
    ...filteredPages.map((p)       => ({ type: 'page',       data: p })),
    ...filteredPedidos.map((p)     => ({ type: 'pedido',     data: p })),
    ...filteredClientes.map((c)    => ({ type: 'cliente',    data: c })),
    ...filteredCostureiras.map((c) => ({ type: 'costureira', data: c })),
  ];

  const go = (path) => {
    setOpen(false);
    setQuery('');
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = allItems[activeIdx];
      if (!item) return;
      if (item.type === 'page')       go(item.data.path);
      if (item.type === 'pedido')     go('/admin/pedidos');
      if (item.type === 'cliente')    go('/admin/clientes');
      if (item.type === 'costureira') go('/admin/costureiras');
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const hasResults = allItems.length > 0;
  const showEmpty  = q && !loading && !hasResults;

  let globalIdx = 0;

  return (
    <Box
      ref={containerRef}
      position="relative"
      w={{ base: '100%', md: '220px' }}
      me={me}
      mb={mb}
      {...rest}
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none" h="100%">
          {loading
            ? <Spinner size="xs" color="gray.400" ml="12px" />
            : <SearchIcon color="gray.400" w="14px" h="14px" ml="12px" />
          }
        </InputLeftElement>
        <Input
          ref={inputRef}
          pl="36px"
          fontSize="sm"
          bg="transparent"
          color={inputText}
          fontWeight="500"
          borderRadius={borderRadius || '30px'}
          placeholder="Buscar..."
          _placeholder={{ color: 'gray.400', fontSize: '13px' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          border="none"
          _focus={{ boxShadow: '0 0 0 2px var(--chakra-colors-brand-300)', bg: 'transparent' }}
          autoComplete="off"
        />
      </InputGroup>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left={0}
          right={0}
          zIndex={9999}
          bg={dropBg}
          borderRadius="14px"
          boxShadow={dropShadow}
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
          minW="280px"
          maxH="420px"
          overflowY="auto"
          pb="6px"
        >
          {!q && (
            <>
              <SectionLabel>Atalhos</SectionLabel>
              {PAGES.map((page, i) => (
                <ResultItem
                  key={page.path}
                  icon={page.icon}
                  label={page.label}
                  active={activeIdx === i}
                  onClick={() => go(page.path)}
                />
              ))}
            </>
          )}

          {q && loading && (
            <Flex align="center" justify="center" py="24px" gap="8px">
              <Spinner size="sm" color="brand.500" />
              <Text fontSize="sm" color="gray.400">Buscando...</Text>
            </Flex>
          )}

          {q && !loading && (
            <>
              {filteredPages.length > 0 && (
                <>
                  <SectionLabel>Páginas</SectionLabel>
                  {filteredPages.map((page) => {
                    const idx = globalIdx++;
                    return (
                      <ResultItem
                        key={page.path}
                        icon={page.icon}
                        label={highlight(page.label, query)}
                        active={activeIdx === idx}
                        onClick={() => go(page.path)}
                      />
                    );
                  })}
                </>
              )}

              {filteredPedidos.length > 0 && (
                <>
                  <SectionLabel>Pedidos</SectionLabel>
                  {filteredPedidos.map((p) => {
                    const idx = globalIdx++;
                    const st = STATUS_LABEL[p.status] || { label: p.status, color: 'gray' };
                    return (
                      <ResultItem
                        key={p.id}
                        icon={MdAssignment}
                        label={highlight(`Pedido #${p.id}`, query)}
                        sublabel={p.clienteResponse?.nome}
                        badge={st.label}
                        badgeColor={st.color}
                        active={activeIdx === idx}
                        onClick={() => go('/admin/pedidos')}
                      />
                    );
                  })}
                </>
              )}

              {filteredClientes.length > 0 && (
                <>
                  <SectionLabel>Clientes</SectionLabel>
                  {filteredClientes.map((c) => {
                    const idx = globalIdx++;
                    return (
                      <ResultItem
                        key={c.id}
                        icon={MdPeople}
                        label={highlight(c.nome, query)}
                        active={activeIdx === idx}
                        onClick={() => go('/admin/clientes')}
                      />
                    );
                  })}
                </>
              )}

              {filteredCostureiras.length > 0 && (
                <>
                  <SectionLabel>Costureiras</SectionLabel>
                  {filteredCostureiras.map((c) => {
                    const idx = globalIdx++;
                    return (
                      <ResultItem
                        key={c.id}
                        icon={MdStraighten}
                        label={highlight(c.nome, query)}
                        active={activeIdx === idx}
                        onClick={() => go('/admin/costureiras')}
                      />
                    );
                  })}
                </>
              )}

              {showEmpty && (
                <Flex direction="column" align="center" py="28px" gap="6px">
                  <Text fontSize="sm" color="gray.400">Nenhum resultado para</Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.600">"{query}"</Text>
                </Flex>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
