// chakra imports
import { Box, Flex, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React from "react";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function SidebarContent(props) {
  const { routes, onClose } = props;
  const navigate = useNavigate();
  const textColor = useColorModeValue("gray.500", "gray.400");

  function handleLogout() {
    localStorage.removeItem("iu_auth");
    navigate("/login", { replace: true });
  }

  return (
    <Flex direction='column' height='100%' pt='25px' px="16px" borderRadius='30px'>
      <Brand />
      <Stack direction='column' mb='auto' mt='8px'>
        <Box ps='20px' pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} onClose={onClose} />
        </Box>
      </Stack>
      <Flex
        align="center"
        gap="10px"
        px="20px"
        py="16px"
        mb="8px"
        cursor="pointer"
        borderRadius="12px"
        color={textColor}
        _hover={{ color: "red.400", bg: useColorModeValue("gray.50", "whiteAlpha.50") }}
        transition="all 0.15s"
        onClick={handleLogout}
      >
        <Icon as={MdLogout} w="18px" h="18px" />
        <Text fontSize="sm" fontWeight="500">Sair</Text>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
