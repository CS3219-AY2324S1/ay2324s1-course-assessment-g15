import React, { useState, useEffect } from 'react';
import {
  Flex, Slide, useDisclosure, IconButton,
  useToast, Box, Button, Grid, VStack, GridItem, createIcon
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { io, Socket } from 'socket.io-client';
import NavigationBar from '../components/NavigationBar';
import LocalStorageHandler from '../handlers/LocalStorageHandler';
import { useNavigate } from 'react-router-dom';
import { FRONTEND_URL, COLLABORATION_SERVICE_URL } from '../configs';
import AuthRequestHandler from '../handlers/AuthRequestHandler';
import LoadingPage from './LoadingPage';
import QuestionDetails from '../components/coding/QuestionDetails';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import HistoryRequestHandler from '../handlers/HistoryRequestHandler';
import Select from 'react-select';
import { selectorStyles, singleSelectStyles } from '../CommonStyles';
import Chat from '../components/chat/chatDetails';
import { ChatMessage } from '../Commons';
import Canvas from '../components/canvas/canvas';

const CodingPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [socket, setSocket] = useState<Socket>();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [question, setQuestion] = useState(LocalStorageHandler.getMatchData()?.question);
  const [complexityFilter, setComplexityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [isPreferencesModalVisible, setIsPreferencesModalVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isCanvasDrawerOpen, setIsCanvasDrawerOpen] = useState(false);
  const { isOpen: isChatOpen, onToggle: toggleChat } = useDisclosure();
  const { isOpen: isCanvasOpen, onToggle: toggleCanvas } = useDisclosure();


  useEffect(() => {
    toast({
      title: "Welcome!",
      description: "You have entered the collaborative room.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, []);

  useEffect(() => {
    AuthRequestHandler.isAuth()
      .then(res => {
        setIsAuthenticated(res.isAuth);
      })
      .catch(e => {
        console.log(e);
      });
    // Redirect to collaboration room if matched
    if (!LocalStorageHandler.isMatched()) {
      navigate('/collaborate');
    }
  }, []);

  useEffect(() => {
    const socket = io(FRONTEND_URL, {
      path: COLLABORATION_SERVICE_URL
    });
    setSocket(socket);
    const matchData = LocalStorageHandler.getMatchData();
    socket.emit('joinRoom', matchData?.room_id);

    // Socket event listeners
    socket.on('codeChange', (newCode) => {
      setCode(newCode);
    });

    socket.on('languageChange', (newLanguage) => {
      setLanguage(newLanguage);
    });

    socket.on('languageChange', (newLanguage) => {
      setLanguage(newLanguage);
    });

    socket.on('newQuestion', (question) => {
      if (!question) {
        toast({
          title: "Error",
          description: `Change question requested: No question found.`,
          status: "error",
          duration: 3000,
        });
        return;
      }
      toast({
        title: "Question Changed",
        description: "The question has been successfully changed.",
        status: "success",
        duration: 3000,
      });
      setQuestion(question);
      LocalStorageHandler.updateMatchDataQuestion(question);
      setCategoryFilter(categoryFilter);
      setComplexityFilter(complexityFilter);
      updateHistory();
    })

    socket.on('messageChange', (message, user) => {
      // Handle incoming messages and update chat history
      const newMessageObj = { sender: user, text: message };
      updateChatHistory(newMessageObj);
    });

    socket.on('userLeft', (data) => {
      toast({
        title: "Match Left",
        description: "Your match has left the session.",
        status: "warning",
        duration: 3000,
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const clientChatHistory = getChatHistory();
    setChatHistory(clientChatHistory);
  }, []);

  function updateHistory() {
    let date = new Date();
    HistoryRequestHandler.updateHistory({
      userId: LocalStorageHandler.getUserData()?.id!,
      attempt: {
        questionId: LocalStorageHandler.getMatchData()?.question.id!,
        timestamp: date.toISOString(),
      },
      complexity: LocalStorageHandler.getMatchData()?.question.complexity!
    });
  }

  const getChatHistory = () => {
    const clientId = LocalStorageHandler.getUserData()?.id!;
    const storedChatHistory = LocalStorageHandler.getChatData(`chatHistory_${clientId}`);
    return storedChatHistory;
  };

  const updateChatHistory = (newMessage: ChatMessage) => {
    const clientId = LocalStorageHandler.getUserData()?.id!;
    const storedChatHistory = getChatHistory();
    const updatedChatHistory = [...storedChatHistory, newMessage];
    LocalStorageHandler.storeChatData(`chatHistory_${clientId}`, updatedChatHistory);
    setChatHistory(updatedChatHistory);
  };

  const clearChatHistory = () => {
    const clientId = LocalStorageHandler.getUserData()?.id!;
    localStorage.setItem(`chatHistory_${clientId}`, JSON.stringify([]));
    setChatHistory([]);
  };

  const clearCanvasHistory = () => {
    const roomId = LocalStorageHandler.getMatchData()?.room_id!;
    localStorage.setItem(`canvas_${roomId}`, JSON.stringify([]));
  }

  const toggleChatDrawer = () => {
    setIsChatDrawerOpen(!isChatDrawerOpen);
  };

  const toggleCanvasDrawer = () => {
    setIsCanvasDrawerOpen(!isCanvasDrawerOpen);
  }

  const handleCodeChange = (newCode: string) => {
    // Emit code changes to the server
    if (socket) {
      socket.emit('codeChange', newCode);
    }
    setCode(newCode); // Update the state
  };

  const handleLanguageChange = (newLanguage: string) => {
    // Emit code changes to the server
    if (socket) {
      socket.emit('languageChange', newLanguage);
    }
    setLanguage(newLanguage); // Update the state
  };

  const handleNewMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessageText = event.target.value; // Extract the message text
    setNewMessage(newMessageText); // Update the new message state with the text
  };

  const handleSendMessage = () => {
    if (socket && newMessage.trim() !== '') {
      const user = LocalStorageHandler.getUserData()?.username!
      socket.emit('messageChange', newMessage, user); // Send the message to the server
      // Append the sent message to the chat history
      const sentMessage = { sender: user, text: newMessage };
      updateChatHistory(sentMessage);
      setNewMessage(''); // Clear the new message input field
    }
  };

  function handleDisconnect() {
    if (socket) {
      socket.emit('userLeft', { roomId: LocalStorageHandler.getMatchData()?.room_id });
    }
    LocalStorageHandler.deleteMatchData();
    clearChatHistory();
    clearCanvasHistory();
    navigate('../home');
  }

  const toast = useToast();

  const handleQuestionChange = () => {
    if (categoryFilter.length < 1 || !complexityFilter) {
      toast({
        title: "Error",
        description: "Category and Complexity fields cannot be empty.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (socket) {
      socket.on('newQuestion', (question) => {
        if (question) {
          setQuestion(question);
          LocalStorageHandler.updateMatchDataQuestion(question);
        }
        setCategoryFilter(categoryFilter);
        setComplexityFilter(complexityFilter);
      })
      socket.emit("changeQuestion", {
        id: LocalStorageHandler.getMatchData()?.question.id,
        categories: categoryFilter,
        complexity: complexityFilter
      })

    }
  }

  const handleFilterPreferences = (filterOptions: { categories: string[]; complexity: string }) => {
    const { categories, complexity } = filterOptions;
    setComplexityFilter(complexity);
    setCategoryFilter(categories);
  }

  const questionString = LocalStorageHandler.getMatchData()?.question;


  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  const CanvasIcon = createIcon({
    displayName: 'PencilIcon',
    viewBox: '-6.5 0 32 32',
    path: (
      <path
        fill="currentColor"
        d="M19.28 10.32c0-0.24-0.080-0.44-0.24-0.6l-3.12-3.12c-0.32-0.32-0.84-0.32-1.2 0l-2.36 2.36-11.32 11.36c-0.12 0.12-0.2 0.28-0.24 0.44l-0.8 3.92c-0.040 0.28 0.040 0.56 0.24 0.76 0.16 0.16 0.36 0.24 0.6 0.24 0.040 0 0.12 0 0.16 0l3.92-0.8c0.16-0.040 0.32-0.12 0.44-0.24l13.68-13.68c0.16-0.2 0.24-0.4 0.24-0.64zM4.32 23.24l-2.44 0.48 0.52-2.4 10.56-10.56 1.92 1.92-10.56 10.56zM16.080 11.52l-1.92-1.92 1.2-1.2 1.92 1.92-1.2 1.2z"
      />
    ),
  });

  if (isAuthenticated) {
    const questionString = LocalStorageHandler.getMatchData()?.question;
    return (
      <Box>
        <NavigationBar index={1} />
        <Grid height='100%' templateColumns='repeat(2, 1fr)' gap='10px' padding='20px' paddingTop='70px'>
          <GridItem colSpan={1}>
            <QuestionDetails
              id={questionString?.id || ""}
              title={questionString?.title || ""}
              complexity={questionString?.complexity || ""}
              categories={questionString?.categories || []}
              description={questionString?.description || ""}
              link={questionString?.link || ""}
              onFilter={handleFilterPreferences}
              onQuestionChange={handleQuestionChange}
            />
          </GridItem>
          <GridItem colSpan={1} m='15px'>
            <Flex gap='10px' pb='15px'>
              <Box flex='4'>
                <Select
                  value={languageOptions.find(option => option.value === language)}
                  onChange={handleLanguageChange}
                  options={languageOptions}
                  styles={{
                    ...selectorStyles,
                    ...singleSelectStyles,
                  }}
                  components={{
                    IndicatorSeparator: () => null
                  }}
                />
              </Box>
              <Box>
                <IconButton
                  aria-label="Chat"
                  icon={<ChatIcon />}
                  bg={isChatOpen ? '#90CDF4' : 'gray.800'}
                  color={isChatOpen && 'primary.blue2'}
                  onClick={() => {
                    if (isCanvasOpen) {
                      toggleCanvas();
                    }
                    toggleChat();
                  }}
                /></Box>
              <Box>
                <IconButton
                  aria-label="Canvas"
                  icon={<CanvasIcon boxSize={7} />}
                  bg={isCanvasOpen ? '#90CDF4' : 'gray.800'}
                  color={isCanvasOpen && 'primary.blue2'}
                  onClick={() => {
                    if (isChatOpen) {
                      toggleChat();
                    }
                    toggleCanvas();
                  }}
                /></Box>
              <Box>
                <Button
                  colorScheme='red'
                  onClick={() => handleDisconnect()}

                >
                  Disconnect
                </Button>
              </Box>
            </Flex>
            <VStack gap='1rem'>
              <CodeMirror
                value={code}
                height='77vh'
                width='50vw'
                overflowY='auto'
                extensions={[
                  language === 'java'
                    ? java()
                    : language === 'python'
                      ? python()
                      : language === 'cpp'
                        ? cpp()
                        : javascript({ jsx: true }),
                ]}
                onChange={handleCodeChange}
                theme={okaidia}
              />

            </VStack>
          </GridItem>
        </Grid>

        <Slide direction='left' in={isChatOpen} style={{
          zIndex: 10, height: "100vh",
          width: "30vw",
        }}>

          <Box
            p="00px"
            color="white"
            bg="primary.blue1"
            shadow="md"
            h='calc(100vh)'
            w='30vw'
          >
            <Chat
              messages={chatHistory}
              newMessage={newMessage}
              onNewMessageChange={handleNewMessageChange}
              onSendMessage={handleSendMessage}
            />
          </Box>
        </Slide>

        <Slide direction='left' in={isCanvasOpen} style={{
          zIndex: 10, height: "100vh",
          width: "45vw",
        }}>
          <Box
            color="white"
            bg="primary.boxBorder"
            rounded="md"
            shadow="md"
            h='calc(100vh)'
            w='45vw'
            overflowY='auto'
          >
            <Canvas
              socket={socket}
            />
          </Box>
        </Slide>


      </Box>
    );
  } else {
    return <LoadingPage />
  }
};

export default CodingPage;
