const db = require('../config/db');

console.log('🔧 Initializing database...\n');

db.serialize(() => {
    //Drop existing tables (for fresh start)
    db.run(`DROP TABLE IF EXISTS leaderboard`);
    db.run(`DROP TABLE IF EXISTS questions`);
    db.run(`DROP TABLE IF EXISTS quizzes`);

    // Quizzes table
    db.run(`CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating quizzes table:', err.message);
        } else {
            console.log('✅ Quizzes table ready');
        }
    });

    // Questions table
    db.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_option TEXT CHECK(correct_option IN ('A','B','C','D')),
        time_limit INTEGER DEFAULT 30,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating questions table:', err.message);
        } else {
            console.log('✅ Questions table ready');
        }
    });

    // Leaderboard table
    db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating leaderboard table:', err.message);
        } else {
            console.log('✅ Leaderboard table ready');
        }
    });

    // Create indexes for better performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_quiz_time 
            ON quizzes(start_time, end_time)`, (err) => {
        if (err) {
            console.error('❌ Error creating quiz time index:', err.message);
        } else {
            console.log('✅ Quiz time index created');
        }
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_questions_quiz 
            ON questions(quiz_id)`, (err) => {
        if (err) {
            console.error('❌ Error creating questions index:', err.message);
        } else {
            console.log('✅ Questions index created');
        }
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_leaderboard_quiz 
            ON leaderboard(quiz_id, score DESC)`, (err) => {
        if (err) {
            console.error('❌ Error creating leaderboard index:', err.message);
        } else {
            console.log('✅ Leaderboard index created');
        }
    });
});

// Close database after operations
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('\n❌ Error closing database:', err.message);
        } else {
            console.log('\n✅ Database initialized successfully!');
            console.log('📁 Database file: quiz_app.db');
        }
    });
}, 1000);
