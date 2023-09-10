import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import Header from './components/Header';
import QuestionApp from './components/QuestionApp';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Box textAlign="center" fontSize="xl">
        <QuestionApp />
      </Box>
    </ChakraProvider>
  );
}

export default App;
