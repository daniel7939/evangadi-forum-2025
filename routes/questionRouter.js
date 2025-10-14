const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');

// Controller functions
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require('../controller/questionController');

// Protected routes
router.post('/', authMiddleware, createQuestion);
router.get('/', authMiddleware, getAllQuestions);
router.get('/:id', authMiddleware, getQuestionById);
router.put('/:id', authMiddleware, updateQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);

module.exports = router;