/*eslint-disable*/
import React from "react";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

export default function Footer() {
  let textColor = useColorModeValue("gray.400", "white");
  return (
    <Flex
      zIndex='3'
      alignItems='center'
      justifyContent='center'
      px={{ base: "30px", md: "0px" }}
      pb='30px'>
      <Text color={textColor} textAlign='center'>
        &copy; {1900 + new Date().getYear()}{" "}
        <Text as='span' fontWeight='500'>
          Murillo Oliveira. All Rights Reserved.
        </Text>
      </Text>
    </Flex>
  );
}
