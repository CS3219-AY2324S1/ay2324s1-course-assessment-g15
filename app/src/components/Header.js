import React from "react";
import { Box, Flex, Text } from '@chakra-ui/react';

function Header() {
  return (
    <Box bg="blue.500" p={4}>
      <Flex justifyContent="center">
        <Text fontSize="2xl" fontWeight="bold" color="white">
          PeerPrep
        </Text>
      </Flex>
    </Box>
  );
}

export default Header;
