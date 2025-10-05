const db = require('../config/db');

console.log('📝 Inserting sample data...\n');

// Sample quizzes with future times
const quizzes = [
    {
        title: "General Knowledge Quiz",
        description: "Test your general knowledge",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    },
    {
        title: "Math Quiz",
        description: "Basic math problems",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        title: "Science Quiz",
        description: "Science questions for all",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        title: "History Quiz",
        description: "World history questions",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Sample questions for each quiz
const sampleQuestions = {
    1: [ // General Knowledge
        {
            question_text: "What is the capital of India?",
            option_a: "Delhi",
            option_b: "Mumbai",
            option_c: "Kolkata",
            option_d: "Chennai",
            correct_option: "A",
            time_limit: 20
        },
        {
            question_text: "Which planet is known as the Red Planet?",
            option_a: "Earth",
            option_b: "Mars",
            option_c: "Jupiter",
            option_d: "Venus",
            correct_option: "B",
            time_limit: 20
        },
        {
            question_text: "Who wrote 'Romeo and Juliet'?",
            option_a: "Charles Dickens",
            option_b: "William Shakespeare",
            option_c: "Mark Twain",
            option_d: "Jane Austen",
            correct_option: "B",
            time_limit: 25
        },
        {
            question_text: "What is the largest ocean on Earth?",
            option_a: "Atlantic Ocean",
            option_b: "Indian Ocean",
            option_c: "Pacific Ocean",
            option_d: "Arctic Ocean",
            correct_option: "C",
            time_limit: 20
        },
        {
            question_text: "How many continents are there?",
            option_a: "5",
            option_b: "6",
            option_c: "7",
            option_d: "8",
            correct_option: "C",
            time_limit: 15
        }
    ],
    2: [ // Math Quiz
        {
            question_text: "What is 2 + 2?",
            option_a: "3",
            option_b: "4",
            option_c: "5",
            option_d: "6",
            correct_option: "B",
            time_limit: 15
        },
        {
            question_text: "What is 15 × 3?",
            option_a: "35",
            option_b: "40",
            option_c: "45",
            option_d: "50",
            correct_option: "C",
            time_limit: 20
        },
        {
            question_text: "What is 100 ÷ 4?",
            option_a: "20",
            option_b: "25",
            option_c: "30",
            option_d: "35",
            correct_option: "B",
            time_limit: 20
        },
        {
            question_text: "What is the square root of 64?",
            option_a: "6",
            option_b: "7",
            option_c: "8",
            option_d: "9",
            correct_option: "C",
            time_limit: 25
        },
        {
            question_text: "What is 50% of 200?",
            option_a: "50",
            option_b: "75",
            option_c: "100",
            option_d: "150",
            correct_option: "C",
            time_limit: 20
        }
    ],
    3: [ // Science Quiz
        {
            question_text: "What is the chemical formula for water?",
            option_a: "H2O",
            option_b: "CO2",
            option_c: "O2",
            option_d: "H2",
            correct_option: "A",
            time_limit: 20
        },
        {
            question_text: "What is the speed of light?",
            option_a: "300,000 km/s",
            option_b: "150,000 km/s",
            option_c: "450,000 km/s",
            option_d: "600,000 km/s",
            correct_option: "A",
            time_limit: 30
        },
        {
            question_text: "What gas do plants absorb from the atmosphere?",
            option_a: "Oxygen",
            option_b: "Nitrogen",
            option_c: "Carbon Dioxide",
            option_d: "Hydrogen",
            correct_option: "C",
            time_limit: 25
        },
        {
            question_text: "How many bones are in the human body?",
            option_a: "186",
            option_b: "206",
            option_c: "226",
            option_d: "246",
            correct_option: "B",
            time_limit: 30
        },
        {
            question_text: "What is the center of an atom called?",
            option_a: "Electron",
            option_b: "Proton",
            option_c: "Neutron",
            option_d: "Nucleus",
            correct_option: "D",
            time_limit: 25
        }
    ],
    4: [ // History Quiz
        {
            question_text: "Who was the first President of the United States?",
            option_a: "Thomas Jefferson",
            option_b: "George Washington",
            option_c: "Abraham Lincoln",
            option_d: "John Adams",
            correct_option: "B",
            time_limit: 25
        },
        {
            question_text: "In which year did World War II end?",
            option_a: "1943",
            option_b: "1944",
            option_c: "1945",
            option_d: "1946",
            correct_option: "C",
            time_limit: 30
        },
        {
            question_text: "Who wrote the Mahabharata?",
            option_a: "Valmiki",
            option_b: "Vyasa",
            option_c: "Kalidasa",
            option_d: "Tulsidas",
            correct_option: "B",
            time_limit: 25
        },
        {
            question_text: "When did India gain independence?",
            option_a: "1945",
            option_b: "1946",
            option_c: "1947",
            option_d: "1948",
            correct_option: "C",
            time_limit: 20
        },
        {
            question_text: "Who built the Taj Mahal?",
            option_a: "Akbar",
            option_b: "Shah Jahan",
            option_c: "Aurangzeb",
            option_d: "Jahangir",
            correct_option: "B",
            time_limit: 25
        }
    ]
};

db.serialize(() => {
    // Insert quizzes
    const insertQuiz = db.prepare("INSERT INTO quizzes (title, description, start_time, end_time) VALUES (?, ?, ?, ?)");

    quizzes.forEach((quiz, index) => {
        insertQuiz.run(quiz.title, quiz.description, quiz.start_time, quiz.end_time, function(err) {
            if (err) {
                console.error(`❌ Error inserting quiz ${index + 1}:`, err.message);
            } else {
                console.log(`✅ Quiz ${index + 1} added: ${quiz.title} (ID: ${this.lastID})`);

                // Insert questions for this quiz
                const quizId = this.lastID;
                const questions = sampleQuestions[quizId] || [];

                if (questions.length > 0) {
                    const insertQuestion = db.prepare(`
                        INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, time_limit) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    questions.forEach((q, qIndex) => {
                        insertQuestion.run(
                            quizId,
                            q.question_text,
                            q.option_a,
                            q.option_b,
                            q.option_c,
                            q.option_d,
                            q.correct_option,
                            q.time_limit,
                            (err) => {
                                if (err) {
                                    console.error(`   ❌ Error inserting question ${qIndex + 1}:`, err.message);
                                } else {
                                    console.log(`   ✅ Question ${qIndex + 1} added`);
                                }
                            }
                        );
                    });

                    insertQuestion.finalize();
                }
            }
        });
    });

    insertQuiz.finalize();
});

// Close database after operations
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('\n❌ Error closing database:', err.message);
        } else {
            console.log('\n✅ Sample data inserted successfully!');
            console.log('🎯 You can now start the server with: npm run dev');
        }
    });
}, 2000);
