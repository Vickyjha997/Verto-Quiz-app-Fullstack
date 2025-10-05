const express = require('express');
const router = express.Router();

const {
    addQuiz,
    addQuestion,
    getAllQuizzes,
    deleteQuiz,
    getActiveQuizzes,
    getQuizById,
    getQuizQuestions,
    submitQuiz,
    getLeaderboard
} = require('../Controllers/quizController');

// ==================== ADMIN ROUTES ====================
router.post('/add', addQuiz);                          // Create new quiz
router.post('/:quiz_id/question', addQuestion);        // Add question to quiz
router.get('/all', getAllQuizzes);                     // Get all quizzes
router.delete('/:quiz_id', deleteQuiz);                // Delete quiz

// ==================== USER ROUTES ====================
router.get('/active', getActiveQuizzes);               // Get active quizzes
router.get('/:quiz_id', getQuizById);                  // Get quiz details
router.get('/:quiz_id/questions', getQuizQuestions);   // Get quiz questions (START QUIZ)
router.post('/submit', submitQuiz);                    // Submit quiz answers
router.get('/:quiz_id/leaderboard', getLeaderboard);   // Get leaderboard

module.exports = router;
