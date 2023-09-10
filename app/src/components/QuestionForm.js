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
  NumberInput,
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
    link: '',
  });

  const CATEGORIES = [
    "Algorithms",
    "Arrays",
    "Bit Manipulation",
    "Brain Teaser",
    "Databases",
    "Data Structures",
    "Hash Tables",
    "Strings",
    "Two Pointers"
  ].sort();

  const toast = useToast();

  const [validAddUpdate, setValidAddUpdate] = useState(false);
  const [validDelete, setValidDelete] = useState(false);

  useEffect(() => {
    if (selectedQuestion) {
      setFormData(selectedQuestion);
    }
  }, [selectedQuestion]);

  useEffect(() => {
    if (validAddUpdate) {
      setValidAddUpdate(true);
    }
  }, [validAddUpdate, formData]);

  useEffect(() => {
    if (validDelete) {
      setValidDelete(true);
    }
  }, [validDelete, formData]);

  const isIDInFormData = (id) => {
    return exampleFormData.some((question) => question.id === id);
  };

  const validateAddUpdate = () => {
    const requiredFields = ['id', 'title', 'description', 'category', 'complexity', 'link'];
    return requiredFields.every((field) => formData[field] !== '' || formData.length === 0);
  };

  const validateDelete = () => {
    return formData.id !== '';
  };

  const handleToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleAddQuestion = () => {
    if (validateAddUpdate()) {
      if (isIDInFormData(formData.id)) {
        handleToast(
          'Adding failed!',
          'Question with the same ID already exists.',
          'error'
        );
        return;
      }
      setExampleFormData([...exampleFormData, formData]);
      clearFormData();
      handleToast(
        'Question added!',
        `Question ${formData.id} has been added successfully.`,
        'success'
      );
      return;
    }
    handleToast('Adding failed!', 'Please fill in all required fields.', 'error');
  };

  const handleUpdateQuestion = () => {
    if (validateAddUpdate()) {
      const updatedFormData = exampleFormData.map((question) =>
        question.id === formData.id ? formData : question
      );
      setExampleFormData(updatedFormData);
      setSelectedQuestion(null);
      clearFormData();
      handleToast(
        'Question updated!',
        `Question ${formData.id} has been updated successfully.`,
        'success'
      );
      return;
    }
    handleToast(
      'Updating failed!',
      'Please fill in all required fields.',
      'error'
    );
  };

  const handleDeleteQuestion = () => {
    if (validateDelete()) {
      const updatedFormData = exampleFormData.filter(
        (question) => question.id !== formData.id
      );
      setExampleFormData(updatedFormData);
      setSelectedQuestion(null);
      clearFormData();
      handleToast(
        'Question deleted!',
        `Question ${formData.id} has been deleted successfully.`,
        'success'
      );
      return;
    }
    handleToast(
      'Deleting failed!',
      'Please fill in all required fields.',
      'error'
    );
  };

  const clearFormData = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      category: [],
      complexity: '',
      link: '',
    });
  };

  return (
    <Box p={4}>
      <VStack spacing={3}>
        <FormControl id="questionId" isRequired>
          <FormLabel>Question ID</FormLabel>
          <NumberInput
            value={formData.id === '' ? '' : formData.id}
            onChange={(valueString) =>
              setFormData({
                ...formData,
                id: valueString === '' ? '' : parseInt(valueString, 10),
              })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
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
            onChange={(values) =>
              setFormData({ ...formData, categories: values })
            }
          >
            <Box maxH="200px" overflowY="scroll">
              <VStack align="start">
                {CATEGORIES.map((category) => (
                  <Checkbox key={category} value={category}>
                    {category}
                  </Checkbox>
                ))}
              </VStack>
            </Box>
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
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Select>
        </FormControl>

        <FormControl id="questionLink" isRequired>
          <FormLabel> Link </FormLabel>
          <Input
            type="textarea"
            placeholder="Enter Link"
            value={formData.link}
            onChange={(e) =>
              setFormData({ ...formData, link: e.target.value })
            }
          />
        </FormControl>
        <Button
          type="button"
          colorScheme={validateAddUpdate() ? 'blue' : 'blackAlpha'}
          onClick={handleAddQuestion}
          isDisabled={!validateAddUpdate()}
        >
          Add
        </Button>
        <Button
          type="button"
          colorScheme={validateAddUpdate() ? 'teal' : 'blackAlpha'}
          onClick={handleUpdateQuestion}
          isDisabled={!validateAddUpdate()}
        >
          Update
        </Button>
        <Button
          type="button"
          colorScheme={validateDelete() ? 'red' : 'blackAlpha'}
          onClick={handleDeleteQuestion}
          isDisabled={!validateDelete()}
        >
          Delete
        </Button>
      </VStack>
    </Box>
  );
}

export default QuestionForm;
