import { useEffect, useState } from 'react';
import { Center, Flex, useToast } from '@chakra-ui/react';
import QuestionDetailsModal from '../components/question/modals/QuestionDetailsModal';
import EditQuestionModal from '../components/question/modals/EditQuestionModal';
import AddQuestionModal from '../components/question/modals/AddQuestionModal';
import QuestionTable from '../components/question/QuestionTable';
import { QuestionCacheContext } from '../contexts/QuestionCacheContext';
import QuestionValidator from '../models/question/QuestionValidator';
import LocalStorageHandler from '../handlers/LocalStorageHandler';
import { QuestionString, emptyQuestionString } from '../Commons';
import { showError, showSuccess } from '../Util';

let currentQuestion = emptyQuestionString;

const QuestionPage = () => {
  const [addModalIsVisible, setAddModalIsVisible] = useState(false);
  const [viewModalIsVisible, setViewModalIsVisible] = useState(false);
  const [editModalIsVisible, setEditModalIsVisible] = useState(false);
  const [questions, setQuestions] = useState<QuestionString[]>([]);
  const [questionCache, setQuestionCache] = useState<QuestionString>(emptyQuestionString);
  const ctxValue = { questionCache, setQuestionCache };
  const toast = useToast();

  useEffect(() => {
    setQuestions(LocalStorageHandler.loadQuestion());
  }, []);

  function validateNewQuestion() {
    let validator = new QuestionValidator();
    validator.validateEmptyFields(questionCache);
    validator.checkDuplicates(questionCache, questions);
  }

  function renderAddQuestionModal() {
    const addQuestionHandler = () => {
      try {
        validateNewQuestion();
        setQuestions([...questions, { ...questionCache, id: LocalStorageHandler.getQuestionId() }]);
        LocalStorageHandler.addQuestion(questionCache);
        setAddModalIsVisible(false);
        showSuccess("Question successfully added!", toast);
      } catch (e) {
        showError((e as Error).message, toast);
      }
    }

    return (
      <AddQuestionModal
        isVisible={addModalIsVisible}
        closeHandler={() => setAddModalIsVisible(false)}
        submitHandler={addQuestionHandler}
      />
    );
  }

  function renderQuestionDetailsModal() {
    const handleEdit = () => {
      setViewModalIsVisible(false);
      setEditModalIsVisible(true);
    }

    const handleDelete = (id: string) => {
      try {
        LocalStorageHandler.deleteQuestion(id);
        setQuestions(questions.filter(qn => qn.id !== id));
        showSuccess('Question deleted!', toast)
        setViewModalIsVisible(false);
      } catch (error) {
        showError('delete fail', toast);
      }
    }

    return (
      <QuestionDetailsModal
        isVisible={viewModalIsVisible}
        data={questionCache}
        closeHandler={() => { setViewModalIsVisible(false); }}
        editModalHandler={handleEdit}
        deleteHandler={(id: string) => handleDelete(id)}
      />
    );
  }

  function renderEditQuestionModal() {
    const updateQuestionHandler = (question: QuestionString) => {
      try {
        let validator = new QuestionValidator();
        validator.validateEmptyFields(questionCache);
        LocalStorageHandler.updateQuestion(questionCache);
        setQuestions(questions.map((q) => (q.id === questionCache.id ? questionCache : q)!));
        setEditModalIsVisible(false);
        showSuccess(`Question ${question.id} updated!`, toast)
      } catch (e) {
        showError((e as Error).message, toast);
      }
    }

    return (
      <EditQuestionModal
        isVisible={editModalIsVisible}
        questionToEdit={currentQuestion}
        closeHandler={() => setEditModalIsVisible(false)}
        submitUpdateHandler={updateQuestionHandler}
      />
    );
  }

  function renderQuestionTable() {
    const viewQuestionHandler = (id: string) => {
      const selectedQuestion = questions.filter(i => i.id.toString() === id)[0];
      if (selectedQuestion !== undefined) {
        setQuestionCache(selectedQuestion);
      }
      setViewModalIsVisible(true);
    }

    return (
      <QuestionTable
        data={questions.sort((a, b) => parseInt(a.id) - parseInt(b.id))}
        viewDescriptionHandler={viewQuestionHandler}
        addBtnOnClick={() => {
          setQuestionCache(emptyQuestionString)
          setAddModalIsVisible(true);
        }}
      />
    );
  }

  function renderPageContent() {
    return (
      <>
        <Center pt={50}>
          <Flex flexDirection="column" alignItems="center">
            {renderAddQuestionModal()}
            {renderQuestionDetailsModal()}
            {renderEditQuestionModal()}
            {renderQuestionTable()}
          </Flex>
        </Center>
      </>
    );
  }

  function renderQuestionPage() {
    return (
      <QuestionCacheContext.Provider value={ctxValue}>
        {renderPageContent()}
      </QuestionCacheContext.Provider>
    );
  }

  return renderQuestionPage();
};

export default QuestionPage;
