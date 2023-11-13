import express from 'express';
import { getAllQuestions, addQuestion, updateQuestion, deleteQuestion, getQuestionCount, getFilteredQuestion, getRandomFilteredQuestion, checkCategoryAndComplexity } from '../controllers/questions';
import { requireAdmin, requireAuth } from '../utils/middleware';

export default (router: express.Router) => {
    router.get('/questions', requireAuth, getAllQuestions);
    router.post('/questions', requireAuth, requireAdmin, addQuestion);
    router.patch('/questions/:id', requireAuth, requireAdmin, updateQuestion);
    router.delete('/questions/:id', requireAuth, requireAdmin, deleteQuestion);
}