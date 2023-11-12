export interface QuestionString {
  id: string,
  title: string,
  complexity: string,
  categories: string[],
  description: string,
  link: string
}

export const emptyQuestionString: QuestionString = {
  id: '',
  title: '',
  categories: [],
  complexity: '',
  description: '',
  link: ''
}

export interface NotificationOptions {
  message: string;
  type: 'success' | 'error'
}
