const db = require('../config/db');

// ==================== ADMIN FUNCTIONS ====================

// Insert a new quiz
exports.addQuiz = (req, res) => {
    const { title, description, start_time, end_time } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    // Use current timestamp as default if not provided
    const startTime = start_time || new Date().toISOString();
    const endTime = end_time || new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(); // default +1 hour

    const sql = "INSERT INTO quizzes (title, description, start_time, end_time) VALUES (?, ?, ?, ?)";

    db.run(sql, [title, description, startTime, endTime], function (err) {
        if (err) {
            console.error('Error adding quiz:', err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Quiz added successfully",
            quizId: this.lastID,
            quiz: {
                id: this.lastID,
                title,
                description,
                start_time: startTime,
                end_time: endTime
            }
        });
    });
};

// Insert a question into a quiz
exports.addQuestion = (req, res) => {
    const quiz_id = req.params.quiz_id;
    const { question_text, option_a, option_b, option_c, option_d, correct_option, time_limit } = req.body;

    if (!question_text || !correct_option) {
        return res.status(400).json({ error: 'Question text and correct option are required' });
    }

    const timeLimit = time_limit || 30; // default 30 seconds per question

    const sql = `INSERT INTO questions 
                 (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, time_limit) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, timeLimit], function (err) {
        if (err) {
            console.error('Error adding question:', err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Question added successfully",
            questionId: this.lastID
        });
    });
};

// Get all quizzes (admin view)
exports.getAllQuizzes = (req, res) => {
    const sql = `SELECT * FROM quizzes ORDER BY start_time DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching quizzes:', err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json({
            success: true,
            count: rows.length,
            quizzes: rows
        });
    });
};

// Delete a quiz (admin only)
exports.deleteQuiz = (req, res) => {
    const quizId = req.params.quiz_id;

    const sql = `DELETE FROM quizzes WHERE id = ?`;

    db.run(sql, [quizId], function (err) {
        if (err) {
            console.error('Error deleting quiz:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json({
            success: true,
            message: 'Quiz deleted successfully',
            deletedId: quizId
        });
    });
};

// ==================== USER FUNCTIONS ====================

// Get all active quizzes (within time frame)
exports.getActiveQuizzes = (req, res) => {
    const currentTime = new Date().toISOString();

    const sql = `SELECT * FROM quizzes 
                 WHERE start_time <= ? AND end_time >= ? 
                 ORDER BY start_time DESC`;

    db.all(sql, [currentTime, currentTime], (err, rows) => {
        if (err) {
            console.error('Error fetching active quizzes:', err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json({
            success: true,
            count: rows.length,
            quizzes: rows
        });
    });
};

// Get quiz by ID with full details
exports.getQuizById = (req, res) => {
    const quizId = req.params.quiz_id;

    const sql = `SELECT * FROM quizzes WHERE id = ?`;

    db.get(sql, [quizId], (err, quiz) => {
        if (err) {
            console.error('Error fetching quiz:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Get question count
        db.get('SELECT COUNT(*) as count FROM questions WHERE quiz_id = ?', [quizId], (err, result) => {
            if (err) {
                console.error('Error counting questions:', err.message);
            }

            quiz.question_count = result ? result.count : 0;
            res.json({ success: true, quiz });
        });
    });
};

// Get quiz questions (without correct answers for security)
exports.getQuizQuestions = (req, res) => {
    const quizId = req.params.quiz_id;

    console.log('📝 Fetching questions for quiz ID:', quizId);

    // First check if quiz exists
    const quizSql = `SELECT * FROM quizzes WHERE id = ?`;

    db.get(quizSql, [quizId], (err, quiz) => {
        if (err) {
            console.error('❌ Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!quiz) {
            console.error('❌ Quiz not found:', quizId);
            return res.status(404).json({ error: 'Quiz not found' });
        }

        console.log('✅ Quiz found:', quiz.title);

        // Check if quiz is within timeframe
        const currentTime = new Date().toISOString();
        
        if (currentTime < quiz.start_time) {
            console.log('⏰ Quiz has not started yet');
            return res.status(403).json({ 
                error: 'Quiz has not started yet', 
                start_time: quiz.start_time 
            });
        }

        if (currentTime > quiz.end_time) {
            console.log('⏰ Quiz has ended');
            return res.status(403).json({ 
                error: 'Quiz has ended', 
                end_time: quiz.end_time 
            });
        }

        // Get questions without correct answers (for security)
        const sql = `SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d, time_limit 
                     FROM questions 
                     WHERE quiz_id = ? 
                     ORDER BY id ASC`;

        db.all(sql, [quizId], (err, rows) => {
            if (err) {
                console.error('❌ Error fetching questions:', err.message);
                return res.status(500).json({ error: err.message });
            }

            console.log(`✅ Found ${rows.length} questions`);

            res.json({
                success: true,
                quiz: {
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description,
                    start_time: quiz.start_time,
                    end_time: quiz.end_time
                },
                questions: rows
            });
        });
    });
};

// Submit quiz and calculate score
exports.submitQuiz = (req, res) => {
    const { quiz_id, answers } = req.body;

    if (!quiz_id || !Array.isArray(answers)) {
        return res.status(400).json({ 
            error: 'Invalid submission format. Required: quiz_id and answers array' 
        });
    }

    console.log(`📤 Submitting quiz ${quiz_id} with ${answers.length} answers`);

    // Verify quiz exists and is still active
    const quizSql = `SELECT * FROM quizzes WHERE id = ?`;

    db.get(quizSql, [quiz_id], (err, quiz) => {
        if (err) {
            console.error('Error fetching quiz:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const currentTime = new Date().toISOString();
        if (currentTime > quiz.end_time) {
            return res.status(403).json({ error: 'Quiz submission time has expired' });
        }

        // Get all correct answers
        const sql = `SELECT id, correct_option FROM questions WHERE quiz_id = ?`;

        db.all(sql, [quiz_id], (err, questions) => {
            if (err) {
                console.error('Error fetching questions:', err.message);
                return res.status(500).json({ error: err.message });
            }

            let score = 0;
            const results = questions.map(q => {
                const userAnswer = answers.find(a => a.question_id === q.id);
                const isCorrect = userAnswer && userAnswer.selected_option === q.correct_option;

                if (isCorrect) score++;

                return {
                    question_id: q.id,
                    correct: isCorrect,
                    user_answer: userAnswer ? userAnswer.selected_option : null,
                    correct_option: q.correct_option
                };
            });

            // Calculate percentage
            const percentage = ((score / questions.length) * 100).toFixed(2);

            console.log(`✅ Score: ${score}/${questions.length} (${percentage}%)`);

            // Save to leaderboard
            const leaderboardSql = `INSERT INTO leaderboard (quiz_id, score) VALUES (?, ?)`;

            db.run(leaderboardSql, [quiz_id, score], function (err) {
                if (err) {
                    console.error('Error saving to leaderboard:', err.message);
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    success: true,
                    score: score,
                    total: questions.length,
                    percentage: percentage,
                    results: results,
                    leaderboard_id: this.lastID
                });
            });
        });
    });
};

// Get leaderboard for a quiz
exports.getLeaderboard = (req, res) => {
    const quizId = req.params.quiz_id;
    const limit = parseInt(req.query.limit) || 10;

    const sql = `SELECT id, score, submitted_at 
                 FROM leaderboard 
                 WHERE quiz_id = ? 
                 ORDER BY score DESC, submitted_at ASC 
                 LIMIT ?`;

    db.all(sql, [quizId, limit], (err, rows) => {
        if (err) {
            console.error('Error fetching leaderboard:', err.message);
            return res.status(500).json({ error: err.message });
        }

        // Add rank to each entry
        const leaderboard = rows.map((entry, index) => ({
            rank: index + 1,
            score: entry.score,
            submitted_at: entry.submitted_at
        }));

        console.log(`🏆 Leaderboard: ${leaderboard.length} entries`);

        res.json({
            success: true,
            quiz_id: parseInt(quizId),
            leaderboard: leaderboard
        });
    });
};
