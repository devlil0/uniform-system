import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  IconButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import AmbientBackground from 'components/ambientBackground/AmbientBackground';
import logo from 'assets/img/logo.png';

const CREDENTIALS = {
  email: 'devmurilloliveira@gmail.com',
  password: 'joji1213!',
};

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const cardBg     = useColorModeValue('white', 'navy.800');
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const inputBg    = useColorModeValue('gray.50', 'navy.900');
  const shadow     = useColorModeValue(
    '0 20px 60px rgba(112,144,176,0.2)',
    '0 20px 60px rgba(0,0,0,0.4)'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === CREDENTIALS.email &&
        password === CREDENTIALS.password
      ) {
        localStorage.setItem('iu_auth', '1');
        navigate('/admin', { replace: true });
      } else {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <Box minH="100vh" position="relative">
      <AmbientBackground />
      <Flex
        position="relative"
        zIndex={1}
        minH="100vh"
        align="center"
        justify="center"
        px="4"
      >
        <Box
          bg={cardBg}
          borderRadius="24px"
          boxShadow={shadow}
          p={{ base: '32px 24px', md: '48px 40px' }}
          w="100%"
          maxW="420px"
        >
          <Flex align="center" justify="center" gap="10px" mb="8px">
            <Image src={logo} alt="IU Uniformes" w="40px" h="40px" borderRadius="10px" />
            <Heading fontSize="2xl" fontWeight="800" letterSpacing="-0.5px">
              IU Uniformes
            </Heading>
          </Flex>
          <Text fontSize="sm" color="gray.400" textAlign="center" mb="32px">
            Acesse o painel de gestão
          </Text>

          {error && (
            <Alert status="error" borderRadius="12px" mb="20px" fontSize="sm">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <FormControl mb="20px">
              <FormLabel fontSize="sm" fontWeight="500" color={labelColor}>
                E-mail
              </FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                bg={inputBg}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'navy.600')}
                borderRadius="12px"
                fontSize="sm"
                h="46px"
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                required
              />
            </FormControl>

            <FormControl mb="28px">
              <FormLabel fontSize="sm" fontWeight="500" color={labelColor}>
                Senha
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  bg={inputBg}
                  border="1px solid"
                  borderColor={useColorModeValue('gray.200', 'navy.600')}
                  borderRadius="12px"
                  fontSize="sm"
                  h="46px"
                  _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                  required
                />
                <InputRightElement h="46px">
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={showPass ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPass((v) => !v)}
                    aria-label="toggle password"
                    color="gray.400"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              w="100%"
              h="46px"
              borderRadius="12px"
              bg="brand.500"
              color="white"
              fontSize="sm"
              fontWeight="600"
              isLoading={loading}
              _hover={{ bg: 'brand.600' }}
              _active={{ bg: 'brand.700' }}
            >
              Entrar
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  );
}
