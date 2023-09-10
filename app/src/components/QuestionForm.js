import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  Checkbox,
  CheckboxGroup,
  useToast,
  NumberInputField,
  NumberInput
} from '@chakra-ui/react';

function QuestionForm({
    exampleFormData,
    setExampleFormData,
    selectedQuestion,
    setSelectedQuestion,
  }) {
    const [formData, setFormData] = useState({
      id: '',
      title: '',
      description: '',
      category: [],
      complexity: '',
    });
  
    const toast = useToast(); // Initialize the toast function
  
    useEffect(() => {
      if (selectedQuestion) {
        setFormData(selectedQuestion);
      }
    }, [selectedQuestion]);
  
    const isIDInFormData = (id) => {
      return exampleFormData.some((question) => question.id === id);
    };
  
    const handleAddQuestion = () => {
      if (formData.id && formData.title) {
        if (isIDInFormData(formData.id)) {
          toast({
            title: 'Adding failed!',
            description: 'Question with the same ID already exists.',
            status: 'error',
            duration: 5000, // Duration in milliseconds
            isClosable: true,
          });
          return;
        }
        setExampleFormData([...exampleFormData, formData]);
        clearFormData();
      }
      console.log(exampleFormData);
    };

  const handleUpdateQuestion = () => {
    if (formData.id && formData.title) {
      const updatedFormData = exampleFormData.map((question) =>
        question.id === formData.id ? formData : question
      );
      setExampleFormData(updatedFormData);
      setSelectedQuestion(null);
      clearFormData();
      console.log(exampleFormData);
    }
  };

  const handleDeleteQuestion = () => {
    if (formData.id) {
      const updatedFormData = exampleFormData.filter(
        (question) => question.id !== formData.id
      );
      setExampleFormData(updatedFormData);
      setSelectedQuestion(null);
      clearFormData();
      console.log(exampleFormData);
    }
  };

  const clearFormData = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      category: [],
      complexity: '',
    });
  };

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <FormControl id="questionId" isRequired>
        <FormLabel>Question ID</FormLabel>
        <NumberInput
            value={formData.id}
            onChange={(valueString) => setFormData({ ...formData, id: parseInt(valueString, 10) })}
        >
            <NumberInputField placeholder="Enter Question ID" />
        </NumberInput>
        </FormControl>

        <FormControl id="questionTitle" isRequired>
          <FormLabel>Question Title</FormLabel>
          <Input
            type="text"
            placeholder="Enter Question Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </FormControl>

        <FormControl id="questionDescription" isRequired>
          <FormLabel>Question Description</FormLabel>
          <Input
            type="textarea"
            placeholder="Enter Question Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </FormControl>

        <FormControl id="questionCategory" isRequired>
          <FormLabel>Question Category</FormLabel>
          <CheckboxGroup
            value={formData.categories}
            onChange={(values) => setFormData({ ...formData, categories: values })}
          >
            <Checkbox value="Arrays">Arrays</Checkbox>
            <br />
            <Checkbox value="Strings">Strings</Checkbox>
            <br />
            <Checkbox value="Hash Tables">Hash Tables</Checkbox>
            {/* Add more categories as needed */}
          </CheckboxGroup>
        </FormControl>

        <FormControl id="questionComplexity" isRequired>
          <FormLabel>Question Complexity</FormLabel>
          <Select
            placeholder="Select Question Complexity"
            value={formData.complexity}
            onChange={(e) =>
              setFormData({ ...formData, complexity: e.target.value })
            }
          >
            {/* Add your complexity options here */}
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            {/* Add more complexity levels as needed */}
          </Select>
        </FormControl>

        <Button type="button" colorScheme="blue" onClick={handleAddQuestion}>
          Add
        </Button>

        <Button type="button" colorScheme="teal" onClick={handleUpdateQuestion}>
          Update
        </Button>

        <Button type="button" colorScheme="red" onClick={handleDeleteQuestion}>
          Delete
        </Button>
      </VStack>
    </Box>
  );
}

export default QuestionForm;
