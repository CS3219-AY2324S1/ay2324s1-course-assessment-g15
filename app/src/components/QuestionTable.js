import React from 'react';
import {
  Tag,
  TagLabel,
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Wrap,
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
            <Td><Text fontSize='xl'>{question.title}</Text></Td>
            <Td><Text fontSize='md'>{question.description}</Text></Td>
            <Td>
                <Wrap spacing={4}>
                    {question.categories.map((category, index) => (
                        <Tag key={index} variant='subtle' colorScheme='linkedin'>
                            {category}
                        </Tag>
                    ))}
                </Wrap>
            </Td>
            <Td>
                <Tag variant='solid' size="lg"  colorScheme={question.complexity === 'Easy' ? 'green' : question.complexity === 'Medium' ? 'yellow' : 'red'}>
                    <TagLabel>{question.complexity}</TagLabel>
                </Tag>
            </Td>
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
