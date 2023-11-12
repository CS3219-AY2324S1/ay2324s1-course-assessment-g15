import { QuestionString } from "../Commons";
import { mockQuestions } from "../MockData";

const QUESTION_DATA_KEY = "questionData";
const QUESTION_ID_KEY = "questionId";

class LocalStorageHandler {

  static getQuestions(): string | null {
    return localStorage.getItem(QUESTION_DATA_KEY);
  }

  static saveQuestions(question: QuestionString[]) {
    localStorage.setItem(QUESTION_DATA_KEY, JSON.stringify(question));
  }

  static loadQuestion(): QuestionString[] {
    const questions = this.getQuestions()
    if (questions === null) {
      return mockQuestions;
    }
    return JSON.parse(questions);
  }

  static addQuestion(question: QuestionString): void {
    const currentQuestions = this.loadQuestion();
    const newQuestion: QuestionString = { ...question, id: this.getQuestionId() };
    this.advanceQuestionId();
    const updatedQuestions = [...currentQuestions, newQuestion];
    this.saveQuestions(updatedQuestions);
  }

  static deleteQuestion(id: string): void {
    const questions: QuestionString[] = JSON.parse(this.getQuestions()!);
    const updatedQuestions = questions.filter(qn => qn.id !== id);
    this.saveQuestions(updatedQuestions);
  }

  static updateQuestion(updatedQuestion: QuestionString) {
    const currentQuestions = this.loadQuestion();
    const indexToUpdate = currentQuestions.findIndex(qn => qn.id === updatedQuestion.id);
    if (indexToUpdate === -1) {
      return
    }
    currentQuestions[indexToUpdate] = updatedQuestion;
    this.saveQuestions(currentQuestions);
  }

  // Newly added question ID starts from 100
  static advanceQuestionId(): void {
    const id = localStorage.getItem(QUESTION_ID_KEY)!;
    const newId = (parseInt(id) + 1).toString()
    localStorage.setItem(QUESTION_ID_KEY, newId);
  }

  static getQuestionId(): string {
    const id = localStorage.getItem(QUESTION_ID_KEY);
    if (id === null) {
      localStorage.setItem(QUESTION_ID_KEY, '100');
      return '100';
    }
    return id;
  }
}

export default LocalStorageHandler;
