import { Flex } from '@chakra-ui/react';
import QuestionForm from './QuestionForm';
import QuestionTable from './QuestionTable';
import { useState, useEffect } from 'react';

function QuestionApp() {
  // Initialize exampleFormData from localStorage or provide a default value
  const initialData = JSON.parse(localStorage.getItem('exampleFormData')) || [
    // Default initial question data
    {
        id: 1,
        title: 'Two Sum',
        description:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        categories: ['Arrays', 'Hash Tables'],
        complexity: 'Easy',
        link: 'https://leetcode.com/problems/two-sum/',
    },
    {
        id: 2,
        title: 'Add Two Numbers',
        description:
            'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.',
        categories: ['Linked Lists', 'Math'],
        complexity: 'Medium',
        link: 'https://leetcode.com/problems/add-two-numbers/',
    },
    {
        id: 3,
        title: 'Longest Substring Without Repeating Characters',
        description:
            'Given a string s, find the length of the longest substring without repeating characters.',
        categories: ['Hash Tables', 'Two Pointers', 'String'],
        complexity: 'Hard',
        link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    }
  ];

  const [exampleFormData, setExampleFormData] = useState(initialData);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Save exampleFormData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('exampleFormData', JSON.stringify(exampleFormData));
  }, [exampleFormData]);

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