// Chakra Imports
import {
  Flex,
  Icon,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { GlobalSearch } from 'components/navbar/searchBar/GlobalSearch';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import React from 'react';
import { MdHome, MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import routes from 'routes';

export default function HeaderLinks(props) {
  const { secondary } = props;
  const navigate = useNavigate();
  const navbarIcon = useColorModeValue('gray.400', 'white');

  function handleLogout() {
    localStorage.removeItem('iu_auth');
    navigate('/login', { replace: true });
  }
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg="transparent"
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <GlobalSearch
        mb={secondary ? { base: '10px', md: 'unset' } : 'unset'}
        me="10px"
        borderRadius="30px"
      />
      <Flex
        align="center"
        gap="6px"
        me="10px"
        cursor="pointer"
        onClick={() => navigate('/admin/default')}
      >
        <Icon as={MdHome} h="18px" w="18px" color={navbarIcon} />
        <Text fontSize="sm" fontWeight="500" color={navbarIcon}>Início</Text>
      </Flex>
      <SidebarResponsive routes={routes} />
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
