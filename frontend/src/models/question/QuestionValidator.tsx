import { QuestionString } from "../../Commons"

class QuestionValidator {
  public validateEmptyFields(input: QuestionString): void {
    if (!input.title) {
      throw new Error('Title cannot be empty')
    }
    if (!input.categories) {
      throw new Error('Categories cannot be empty')
    }
    if (!input.complexity) {
      throw new Error('Complexity cannot be empty')
    }
    if (!input.link) {
      throw new Error('Link cannot be empty')
    }
    if (!input.description) {
      throw new Error('Description cannot be empty')
    }
  }

  public checkDuplicates(newQuestion: QuestionString, questions: QuestionString[]) {
    if (questions.findIndex(qn => qn.title === newQuestion.title) !== -1) {
      throw new Error('Duplicate question title');
    }
  }
}

export default QuestionValidator;