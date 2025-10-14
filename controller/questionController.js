const { StatusCodes } = require('http-status-codes');

async function createQuestion(req, res) {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ msg: 'Create question not implemented yet' });
}

async function getAllQuestions(req, res) {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ msg: 'Get all questions not implemented yet' });
}

async function getQuestionById(req, res) {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ msg: 'Get question by id not implemented yet' });
}

async function updateQuestion(req, res) {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ msg: 'Update question not implemented yet' });
}

async function deleteQuestion(req, res) {
  res.status(StatusCodes.NOT_IMPLEMENTED).json({ msg: 'Delete question not implemented yet' });
}

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};