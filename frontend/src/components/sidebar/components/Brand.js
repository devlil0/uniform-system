import React from "react";
import { Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import logo from "assets/img/logo.png";

export function SidebarBrand() {
  const textColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Flex align='center' gap='10px' mb='20px' mt='12px'>
        <Image src={logo} alt="IU Uniformes" w='36px' h='36px' borderRadius='8px' bg='transparent' />
        <Text
          fontSize='xl'
          fontWeight='800'
          color={textColor}
          letterSpacing='-0.5px'
        >
          IU Uniformes
        </Text>
      </Flex>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
