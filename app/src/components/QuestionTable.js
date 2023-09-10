import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
} from '@chakra-ui/react';

function QuestionTable({ questions, onSelectQuestion }) {
  return (
    <Table variant="striped" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Title</Th>
          <Th>Description</Th>
          <Th>Categories</Th>
          <Th>Complexity</Th>
          <Th>Link</Th>
        </Tr>
      </Thead>
      <Tbody>
        {questions.map((question) => (
          <Tr key={question.id} onClick={() => onSelectQuestion(question)}>
            <Td>{question.id}</Td>
            <Td>{question.title}</Td>
            <Td>{question.description}</Td>
            <Td>{question.categories.join(', ')}</Td>
            <Td>{question.complexity}</Td>
            <Td>
              <chakra.a href={question.link} target="_blank" rel="noopener noreferrer">
                View
              </chakra.a>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default QuestionTable;
