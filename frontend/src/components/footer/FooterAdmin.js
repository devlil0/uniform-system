/*eslint-disable*/
import React from "react";
import {
  Flex,
  Icon,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  const textColor = useColorModeValue("gray.400", "white");
  return (
    <Flex
      zIndex='3'
      alignItems='center'
      justifyContent='center'
      px={{ base: "30px", md: "50px" }}
      pb='30px'>
      <Flex alignItems='center' gap='12px' flexWrap='wrap' justifyContent='center'>
        <Text color={textColor} textAlign='center'>
          &copy; {1900 + new Date().getYear()}{" "}
          <Text as='span' fontWeight='500'>
            Murillo Oliveira. All Rights Reserved.
          </Text>
        </Text>
        <Link
          href="https://github.com/devlil0"
          isExternal
          display='flex'
          alignItems='center'
          gap='5px'
          color={textColor}
          _hover={{ color: 'brand.400' }}
          fontWeight='500'
        >
          <Icon as={FaGithub} h='16px' w='16px' />
          devlil0
        </Link>
      </Flex>
    </Flex>
  );
}
