import { Flex } from '@chakra-ui/react';
import QuestionForm from './QuestionForm';
import QuestionTable from './QuestionTable';
import { useState } from 'react';

function QuestionApp() {
  const [exampleFormData, setExampleFormData] = useState([
    // Initial question data
    {
      id: 1,
      title: 'Two Sum',
      description:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      categories: ['Arrays', 'Hash Tables'],
      complexity: 'Easy',
      link: 'https://leetcode.com/problems/two-sum/',
    },
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  return (
    <Flex justify="center" align="flex-start" p={4}>
      <QuestionForm
        exampleFormData={exampleFormData}
        setExampleFormData={setExampleFormData}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
      />
      <QuestionTable
        questions={exampleFormData}
        onSelectQuestion={(question) => setSelectedQuestion(question)}
      />
    </Flex>
  );
}

export default QuestionApp;
