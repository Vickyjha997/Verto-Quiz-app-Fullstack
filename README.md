# 🎯 Quiz Application with Timer

A full-stack quiz application built with Node.js, Express, SQLite3, and Vanilla JavaScript. Features include timed quizzes with individual question timers, real-time countdown, score tracking, and leaderboards.

---
## ✨ Features

### Core Features
- ⏱️ **Dual Timer System**
  - Overall quiz timer (based on quiz timeframe)
  - Individual question timers (auto-advance when time expires)
  - Persistent timer state (resumes on navigation)

- 📝 **Question Management**
  - Multiple choice questions (A, B, C, D)
  - Dynamic question loading
  - Answer persistence across navigation

- 🏆 **Scoring & Leaderboard**
  - Automatic score calculation
  - Real-time leaderboard
  - Top 10 rankings with medals

- 🎨 **User Interface**
  - Responsive design
  - Progress tracking
  - Visual timer warnings
  - Loading states

- 🔒 **Security**
  - Questions served without correct answers
  - Time validation on submission
  - CORS enabled

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** SQLite3
- **Additional:** CORS, Nodemon

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Vanilla JS with async/await

---

## 📁 Project Structure

```

quiz-app/
├── backend/
│   ├── config/
│   │   └── db.js                 \# Database connection
│   ├── controllers/
│   │   └── quizController.js     \# Business logic
│   ├── routes/
│   │   └── quiz.js               \# API routes
│   ├── utils/
│   │   ├── initDB.js             \# Database schema creation
│   │   ├── initData.js           \# Sample data insertion
│   │   └── checkData.js          \# Data verification
│   ├── app.js                    \# Express app configuration
│   ├── package.json              \# Dependencies
│   └── quiz_app.db               \# SQLite database (auto-generated)
│
└── frontend/
├── index.html                \# Home page - quiz listing
├── quiz.html                 \# Quiz page - question display
├── quiz.js                   \# Quiz logic \& API calls
└── styles.css                \# Styling

```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### Check Your Versions

```

node --version    \# Should be v14.0.0 or higher
npm --version     \# Should be 6.0.0 or higher

```

---

## 🚀 Installation

### Step 1: Clone or Download the Project

```


# Option A: Clone with Git

git clone https://github.com/yourusername/quiz-app.git
cd quiz-app

# Option B: Download ZIP

# Extract the ZIP file and navigate to the folder

cd quiz-app

```

### Step 2: Install Backend Dependencies

```

cd backend
npm install

```

This will install:
- `express` - Web framework
- `sqlite3` - Database
- `cors` - Cross-origin resource sharing
- `nodemon` - Auto-restart on changes (dev)

### Step 3: Verify Installation

```

npm list

```

You should see all dependencies listed without errors.

---

## 💾 Database Setup

### Step 1: Initialize Database Tables

Create the database schema (tables and indexes):

```

cd backend
node utils/initDB.js

```

**Expected Output:**
```

🔧 Initializing database...

✅ Quizzes table ready
✅ Questions table ready
✅ Leaderboard table ready
✅ Quiz time index created
✅ Questions index created
✅ Leaderboard index created

✅ Database initialized successfully!
📁 Database file: quiz_app.db

```

### Step 2: Insert Sample Data

Populate the database with sample quizzes and questions:

```

node utils/initData.js

```

**Expected Output:**
```

📝 Inserting sample data...

✅ Quiz 1 added: General Knowledge Quiz (ID: 1)
✅ Question 1 added
✅ Question 2 added
✅ Question 3 added
✅ Question 4 added
✅ Question 5 added
✅ Quiz 2 added: Math Quiz (ID: 2)
...
✅ Sample data inserted successfully!
🎯 You can now start the server with: npm run dev

```

### Step 3: Verify Data

Check if data was inserted correctly:

```

node utils/checkData.js

```

**Expected Output:**
```

🔍 Checking database data...

📋 QUIZZES:
────────────────────────────────────────────────────────────────
ID: 1
Title: General Knowledge Quiz
Description: Test your general knowledge
Start: 2025-10-04T03:59:31.372Z
End: 2025-10-11T03:59:31.372Z
────────────────────────────────────────────────────────────────
Total: 4 quizzes

❓ QUESTIONS:
────────────────────────────────────────────────────────────────
[Quiz ID: 1]
Q1: What is the capital of India?
A) Delhi  B) Mumbai
C) Kolkata  D) Chennai
✓ Correct: A | Time: 20s
...
Total: 20 questions

🏆 LEADERBOARD:
────────────────────────────────────────────────────────────────
No leaderboard entries yet.
Total: 0 entries

✅ Database check complete!

```

---

## ▶️ Running the Application

### Development Mode (with auto-restart)

```

cd backend
npm run dev

```

### Production Mode

```

cd backend
npm start

```

**Expected Console Output:**
```

✅ Connected to SQLite database
✅ Foreign keys enabled
🚀 Server running on http://localhost:5000
📊 API available at http://localhost:5000/api/quiz

```

### Access the Application

Open your web browser and navigate to:
```

http://localhost:5000

```

You should see the quiz listing page with 4 sample quizzes.

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api/quiz`

### Admin Endpoints

#### 1. Create Quiz

**POST** `/api/quiz/add`

Create a new quiz with title, description, and time window.

**Request Body:**
```

{
"title": "JavaScript Quiz",
"description": "Test your JS knowledge",
"start_time": "2025-10-05T00:00:00.000Z",
"end_time": "2025-10-12T00:00:00.000Z"
}

```

**Response:**
```

{
"message": "Quiz added successfully",
"quizId": 5,
"quiz": {
"id": 5,
"title": "JavaScript Quiz",
"description": "Test your JS knowledge",
"start_time": "2025-10-05T00:00:00.000Z",
"end_time": "2025-10-12T00:00:00.000Z"
}
}

```

**cURL Example:**
```

curl -X POST http://localhost:5000/api/quiz/add \
-H "Content-Type: application/json" \
-d '{
"title": "JavaScript Quiz",
"description": "Test your JS knowledge",
"start_time": "2025-10-05T00:00:00.000Z",
"end_time": "2025-10-12T00:00:00.000Z"
}'

```

---

#### 2. Add Question to Quiz

**POST** `/api/quiz/:quiz_id/question`

Add a multiple-choice question to a specific quiz.

**URL Parameters:**
- `quiz_id` (integer) - The ID of the quiz

**Request Body:**
```

{
"question_text": "What is the output of 2 + 2?",
"option_a": "3",
"option_b": "4",
"option_c": "22",
"option_d": "undefined",
"correct_option": "B",
"time_limit": 30
}

```

**Response:**
```

{
"message": "Question added successfully",
"questionId": 21
}

```

**cURL Example:**
```

curl -X POST http://localhost:5000/api/quiz/1/question \
-H "Content-Type: application/json" \
-d '{
"question_text": "What is the output of 2 + 2?",
"option_a": "3",
"option_b": "4",
"option_c": "22",
"option_d": "undefined",
"correct_option": "B",
"time_limit": 30
}'

```

---

#### 3. Get All Quizzes (Admin)

**GET** `/api/quiz/all`

Retrieve all quizzes (including expired ones).

**Response:**
```

{
"success": true,
"count": 4,
"quizzes": [
{
"id": 1,
"title": "General Knowledge Quiz",
"description": "Test your general knowledge",
"start_time": "2025-10-04T03:59:31.372Z",
"end_time": "2025-10-11T03:59:31.372Z"
}
]
}

```

**cURL Example:**
```

curl http://localhost:5000/api/quiz/all

```

---

#### 4. Delete Quiz

**DELETE** `/api/quiz/:quiz_id`

Delete a quiz and all associated questions.

**URL Parameters:**
- `quiz_id` (integer) - The ID of the quiz to delete

**Response:**
```

{
"success": true,
"message": "Quiz deleted successfully",
"deletedId": "5"
}

```

**cURL Example:**
```

curl -X DELETE http://localhost:5000/api/quiz/5

```

---

### User Endpoints

#### 5. Get Active Quizzes

**GET** `/api/quiz/active`

Get all quizzes currently within their time window.

**Response:**
```

{
"success": true,
"count": 3,
"quizzes": [
{
"id": 1,
"title": "General Knowledge Quiz",
"description": "Test your general knowledge",
"start_time": "2025-10-04T03:59:31.372Z",
"end_time": "2025-10-11T03:59:31.372Z"
}
]
}

```

**cURL Example:**
```

curl http://localhost:5000/api/quiz/active

```

---

#### 6. Get Quiz Details

**GET** `/api/quiz/:quiz_id`

Get detailed information about a specific quiz.

**URL Parameters:**
- `quiz_id` (integer) - The ID of the quiz

**Response:**
```

{
"success": true,
"quiz": {
"id": 1,
"title": "General Knowledge Quiz",
"description": "Test your general knowledge",
"start_time": "2025-10-04T03:59:31.372Z",
"end_time": "2025-10-11T03:59:31.372Z",
"question_count": 5
}
}

```

**cURL Example:**
```

curl http://localhost:5000/api/quiz/1

```

---

#### 7. Get Quiz Questions (Start Quiz)

**GET** `/api/quiz/:quiz_id/questions`

Get all questions for a quiz (without correct answers).

**URL Parameters:**
- `quiz_id` (integer) - The ID of the quiz

**Response:**
```

{
"success": true,
"quiz": {
"id": 1,
"title": "General Knowledge Quiz",
"description": "Test your general knowledge",
"start_time": "2025-10-04T03:59:31.372Z",
"end_time": "2025-10-11T03:59:31.372Z"
},
"questions": [
{
"id": 1,
"quiz_id": 1,
"question_text": "What is the capital of India?",
"option_a": "Delhi",
"option_b": "Mumbai",
"option_c": "Kolkata",
"option_d": "Chennai",
"time_limit": 20
}
]
}

```

**Error Responses:**
- `403` - Quiz has not started yet or has ended
- `404` - Quiz not found

**cURL Example:**
```

curl http://localhost:5000/api/quiz/1/questions

```

---

#### 8. Submit Quiz

**POST** `/api/quiz/submit`

Submit quiz answers and get results.

**Request Body:**
```

{
"quiz_id": 1,
"answers": [
{
"question_id": 1,
"selected_option": "A"
},
{
"question_id": 5,
"selected_option": "B"
}
]
}

```

**Response:**
```

{
"success": true,
"score": 4,
"total": 5,
"percentage": "80.00",
"results": [
{
"question_id": 1,
"correct": true,
"user_answer": "A",
"correct_option": "A"
},
{
"question_id": 5,
"correct": false,
"user_answer": "B",
"correct_option": "B"
}
],
"leaderboard_id": 15
}

```

**cURL Example:**
```

curl -X POST http://localhost:5000/api/quiz/submit \
-H "Content-Type: application/json" \
-d '{
"quiz_id": 1,
"answers": [
{"question_id": 1, "selected_option": "A"},
{"question_id": 5, "selected_option": "B"}
]
}'

```

---

#### 9. Get Leaderboard

**GET** `/api/quiz/:quiz_id/leaderboard`

Get top scores for a quiz.

**URL Parameters:**
- `quiz_id` (integer) - The ID of the quiz

**Query Parameters:**
- `limit` (integer, optional) - Number of entries (default: 10)

**Response:**
```

{
"success": true,
"quiz_id": 1,
"leaderboard": [
{
"rank": 1,
"score": 5,
"submitted_at": "2025-10-05T10:30:00.000Z"
},
{
"rank": 2,
"score": 4,
"submitted_at": "2025-10-05T10:25:00.000Z"
}
]
}

```

**cURL Example:**
```

curl "http://localhost:5000/api/quiz/1/leaderboard?limit=5"

```

---

## 🎨 Frontend Usage

### Home Page (`index.html`)

**URL:** `http://localhost:5000/`

**Features:**
- Displays all active quizzes
- Shows quiz metadata (title, description, time window)
- "Start Quiz" button for each quiz

**User Flow:**
1. Page loads and fetches active quizzes
2. User browses available quizzes
3. User clicks "Start Quiz" button
4. Redirects to `quiz.html?id={quiz_id}`

---

### Quiz Page (`quiz.html`)

**URL:** `http://localhost:5000/quiz.html?id=1`

**Features:**
- Question display with multiple choice options
- Dual timer system (overall + per question)
- Navigation (Previous/Next buttons)
- Progress bar
- Auto-save answers
- Auto-advance on timer expiry
- Submit quiz functionality

**User Flow:**
1. Page loads quiz and questions from API
2. Displays first question with timer
3. User selects answer (saved immediately)
4. User navigates between questions
   - Timer state persists (resumes from remaining time)
   - Selected answers are restored
5. User submits quiz (or auto-submits on timeout)
6. Results are displayed with leaderboard

---

### Key Features Explained

#### Timer System
```

// Overall Timer: Based on quiz end_time
// Shows: "00:45:30" (hours:minutes:seconds)
// Warning: Yellow when < 5 minutes
// Expired: Red and auto-submits

// Question Timer: Based on question time_limit
// Shows: "20s"
// Warning: Yellow when <= 5s, Red when <= 3s
// Expired: Auto-advances to next question

```

#### Answer Persistence
```

// Answers are saved in memory immediately when selected
// When revisiting a question:
// 1. Selected option is highlighted
// 2. Radio button is checked
// 3. Timer resumes from remaining time

```

#### Navigation Rules
```

// Previous Button: Disabled on first question
// Next Button: Hidden on last question
// Submit Button: Shown only on last question
// Auto-advance: When question timer expires

```

---

## 🧪 Testing

### Manual Testing

#### 1. Test Quiz Loading

```


# Start the server

cd backend
npm run dev

# Open browser

http://localhost:5000

# Expected: See 4 quizzes listed

```

#### 2. Test Quiz Taking

```


# Click "Start Quiz" on any quiz

# Expected:

# - Quiz title and description displayed

# - First question shown with 4 options

# - Both timers counting down

# - Progress bar at 20% (1 of 5)

```

#### 3. Test Timer Persistence

```


# On Question 1:

# 1. Wait 10 seconds (timer shows 10s remaining)

# 2. Click "Next"

# 3. Click "Previous"

# Expected: Timer shows 10s (not 20s)

```

#### 4. Test Answer Persistence

```


# On Question 1:

# 1. Select option "A"

# 2. Click "Next"

# 3. Click "Previous"

# Expected: Option "A" is still selected and highlighted

```

#### 5. Test Submission

```


# Answer all 5 questions

# Click "Submit Quiz"

# Expected:

# - Results page shown

# - Score displayed (e.g., "80%")

# - Correct/Incorrect breakdown

# - Leaderboard with rankings

```

---

### API Testing with cURL

#### Test 1: Get Active Quizzes

```

curl http://localhost:5000/api/quiz/active

```

**Expected Response:**
```

{
"success": true,
"count": 4,
"quizzes": [...]
}

```

---

#### Test 2: Get Quiz Questions

```

curl http://localhost:5000/api/quiz/1/questions

```

**Expected Response:**
```

{
"success": true,
"quiz": {...},
"questions": [...]
}

```

---

#### Test 3: Submit Quiz

```

curl -X POST http://localhost:5000/api/quiz/submit \
-H "Content-Type: application/json" \
-d '{
"quiz_id": 1,
"answers": [
{"question_id": 1, "selected_option": "A"},
{"question_id": 5, "selected_option": "B"},
{"question_id": 9, "selected_option": "B"},
{"question_id": 13, "selected_option": "C"},
{"question_id": 17, "selected_option": "C"}
]
}'

```

**Expected Response:**
```

{
"success": true,
"score": 5,
"total": 5,
"percentage": "100.00",
"results": [...],
"leaderboard_id": 1
}

```

---

#### Test 4: Get Leaderboard

```

curl "http://localhost:5000/api/quiz/1/leaderboard?limit=3"

```

**Expected Response:**
```

{
"success": true,
"quiz_id": 1,
"leaderboard": [
{"rank": 1, "score": 5, "submitted_at": "..."}
]
}

```

---

### API Testing with Postman

#### Import Collection

Create a new Postman collection with these requests:

**1. GET Active Quizzes**
```

GET http://localhost:5000/api/quiz/active

```

**2. GET Quiz Questions**
```

GET http://localhost:5000/api/quiz/1/questions

```

**3. POST Submit Quiz**
```

POST http://localhost:5000/api/quiz/submit
Headers: Content-Type: application/json
Body (raw JSON):
{
"quiz_id": 1,
"answers": [
{"question_id": 1, "selected_option": "A"}
]
}

```

**4. GET Leaderboard**
```

GET http://localhost:5000/api/quiz/1/leaderboard?limit=10

```
---

## 📊 Database Schema

### Quizzes Table

```

CREATE TABLE quizzes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
description TEXT,
start_time TEXT NOT NULL,
end_time TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### Questions Table

```

CREATE TABLE questions (
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
);

```

### Leaderboard Table

```

CREATE TABLE leaderboard (
id INTEGER PRIMARY KEY AUTOINCREMENT,
quiz_id INTEGER NOT NULL,
score INTEGER NOT NULL,
submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

```

---

## 📝 Available npm Scripts

```

{
"start": "node app.js",              // Production server
"dev": "nodemon app.js",             // Development with auto-restart
"init-db": "node utils/initDB.js",   // Create database schema
"init-data": "node utils/initData.js", // Insert sample data
"check-data": "node utils/checkData.js", // Verify database
"setup": "npm run init-db \&\& npm run init-data" // Full setup
}

```
## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## 👨‍💻 Author

Your Name
- GitHub: [@vickyjha997](https://github.com/vickyjha997)
- Email: vickyjha997@gmail.com

---


**Made with ❤️ by Vicky Jha**


