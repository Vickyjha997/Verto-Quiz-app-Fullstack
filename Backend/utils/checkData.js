const db = require('../config/db');

console.log('🔍 Checking database data...\n');

// Check quizzes
db.all("SELECT * FROM quizzes", (err, rows) => {
    if (err) {
        console.error('❌ Error fetching quizzes:', err.message);
    } else {
        console.log('📋 QUIZZES:');
        console.log('─'.repeat(80));
        if (rows.length === 0) {
            console.log('No quizzes found.');
        } else {
            rows.forEach(quiz => {
                console.log(`ID: ${quiz.id}`);
                console.log(`Title: ${quiz.title}`);
                console.log(`Description: ${quiz.description}`);
                console.log(`Start: ${quiz.start_time}`);
                console.log(`End: ${quiz.end_time}`);
                console.log(`Created: ${quiz.created_at}`);
                console.log('─'.repeat(80));
            });
        }
        console.log(`Total: ${rows.length} quizzes\n`);
    }
});

// Check questions
setTimeout(() => {
    db.all("SELECT * FROM questions", (err, rows) => {
        if (err) {
            console.error('❌ Error fetching questions:', err.message);
        } else {
            console.log('❓ QUESTIONS:');
            console.log('─'.repeat(80));
            if (rows.length === 0) {
                console.log('No questions found.');
            } else {
                let currentQuizId = null;
                rows.forEach(q => {
                    if (currentQuizId !== q.quiz_id) {
                        currentQuizId = q.quiz_id;
                        console.log(`\n[Quiz ID: ${q.quiz_id}]`);
                    }
                    console.log(`  Q${q.id}: ${q.question_text}`);
                    console.log(`     A) ${q.option_a}  B) ${q.option_b}`);
                    console.log(`     C) ${q.option_c}  D) ${q.option_d}`);
                    console.log(`     ✓ Correct: ${q.correct_option} | Time: ${q.time_limit}s`);
                });
            }
            console.log('\n' + '─'.repeat(80));
            console.log(`Total: ${rows.length} questions\n`);
        }
    });
}, 500);

// Check leaderboard
setTimeout(() => {
    db.all("SELECT * FROM leaderboard ORDER BY quiz_id, score DESC", (err, rows) => {
        if (err) {
            console.error('❌ Error fetching leaderboard:', err.message);
        } else {
            console.log('🏆 LEADERBOARD:');
            console.log('─'.repeat(80));
            if (rows.length === 0) {
                console.log('No leaderboard entries yet.');
            } else {
                let currentQuizId = null;
                rows.forEach(entry => {
                    if (currentQuizId !== entry.quiz_id) {
                        currentQuizId = entry.quiz_id;
                        console.log(`\n[Quiz ID: ${entry.quiz_id}]`);
                    }
                    console.log(`  Score: ${entry.score} | Submitted: ${entry.submitted_at}`);
                });
            }
            console.log('\n' + '─'.repeat(80));
            console.log(`Total: ${rows.length} entries\n`);
        }

        // Close database
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
            } else {
                console.log('✅ Database check complete!');
            }
        });
    });
}, 1000);
