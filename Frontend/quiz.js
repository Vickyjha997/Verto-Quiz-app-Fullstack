// ==================== CONFIGURATION ====================
const API_BASE = 'http://localhost:5000/api/quiz';

// ==================== STATE VARIABLES ====================
let currentQuiz = null;
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let questionTimer = null;
let overallTimer = null;
let questionTimeRemaining = {}; // Tracks remaining time for each question
let questionVisited = {}; // Tracks if question was visited before

// ==================== INITIALIZATION ====================

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    if (!quizId) {
        alert('No quiz ID provided!');
        window.location.href = 'index.html';
        return;
    }

    console.log('Starting quiz with ID:', quizId);
    loadQuiz(quizId);
});

// ==================== QUIZ LOADING ====================

// Load quiz data and questions from API
async function loadQuiz(quizId) {
    showLoading(true, 'Loading quiz...');

    try {
        console.log('Fetching from:', `${API_BASE}/${quizId}/questions`);
        
        const response = await fetch(`${API_BASE}/${quizId}/questions`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data);

        if (!data.success) {
            throw new Error(data.error || 'Failed to load quiz');
        }

        if (!data.questions || data.questions.length === 0) {
            throw new Error('No questions found for this quiz');
        }

        currentQuiz = data.quiz;
        questions = data.questions;

        // Initialize time remaining for all questions
        questions.forEach(q => {
            questionTimeRemaining[q.id] = q.time_limit;
            questionVisited[q.id] = false;
        });

        console.log(`Loaded ${questions.length} questions for "${currentQuiz.title}"`);
        console.log('Time remaining initialized:', questionTimeRemaining);

        // Update UI with quiz info
        document.getElementById('quiz-title').textContent = currentQuiz.title;
        document.getElementById('quiz-description').textContent = currentQuiz.description || '';

        showLoading(false);

        // Start overall timer
        startOverallTimer();

        // Display first question
        displayQuestion(0);

    } catch (error) {
        console.error('Error loading quiz:', error);
        showLoading(false);
        alert(`Error: ${error.message}\n\nPlease check:\n1. Backend is running on port 8080\n2. Quiz has questions in database\n\nReturning to home...`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// ==================== TIMERS ====================

// Overall quiz timer based on quiz end_time
function startOverallTimer() {
    const endTime = new Date(currentQuiz.end_time).getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            clearInterval(overallTimer);
            document.getElementById('overall-timer').textContent = 'TIME UP!';
            document.getElementById('overall-timer').classList.add('expired');
            autoSubmitQuiz('Overall quiz time has expired!');
            return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('overall-timer').textContent = 
            `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

        // Warning when less than 5 minutes
        if (distance < 5 * 60 * 1000) {
            document.getElementById('overall-timer').classList.add('warning');
        }
    }

    updateTimer(); // Initial call
    overallTimer = setInterval(updateTimer, 1000);
}

// Individual question timer with persistent state
function startQuestionTimer(questionId, initialTimeLimit) {
    clearInterval(questionTimer);
    
    // Use remaining time for this specific question
    let timeLeft = questionTimeRemaining[questionId];
    
    console.log(`Timer for Q${questionId}: ${timeLeft}s remaining (original: ${initialTimeLimit}s)`);

    updateQuestionTimerDisplay(timeLeft);

    questionTimer = setInterval(() => {
        timeLeft--;
        questionTimeRemaining[questionId] = timeLeft; // Save remaining time
        updateQuestionTimerDisplay(timeLeft);

        // Auto-advance when time runs out
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            questionTimeRemaining[questionId] = 0;
            console.log(`Time expired for question ${questionId}`);
            setTimeout(() => autoMoveToNext(), 500);
        }
    }, 1000);
}

// Stop timer when navigating away from question
function stopQuestionTimer() {
    if (questionTimer) {
        clearInterval(questionTimer);
        console.log('Question timer paused');
    }
}

// Update question timer display with visual feedback
function updateQuestionTimerDisplay(seconds) {
    const timerEl = document.getElementById('question-timer');
    
    if (seconds <= 0) {
        timerEl.textContent = 'TIME UP!';
        timerEl.classList.add('expired');
    } else {
        timerEl.textContent = `${seconds}s`;
        timerEl.classList.remove('expired');
    }

    // Remove all warning classes first
    timerEl.classList.remove('warning', 'critical');

    // Add appropriate warning class
    if (seconds <= 5 && seconds > 3) {
        timerEl.classList.add('warning');
    } else if (seconds <= 3 && seconds > 0) {
        timerEl.classList.add('critical');
    }
}

// ==================== QUESTION DISPLAY ====================

// Display a question by index
function displayQuestion(index) {
    if (index < 0 || index >= questions.length) {
        console.warn('Invalid question index:', index);
        return;
    }

    // Stop timer for previous question
    stopQuestionTimer();

    const question = questions[index];
    currentQuestionIndex = index;

    console.log(`Displaying question ${index + 1}/${questions.length}:`, question.question_text);

    // Mark question as visited
    questionVisited[question.id] = true;

    // Update question text
    document.getElementById('question-text').textContent = question.question_text;

    // Update question counter
    document.getElementById('question-counter').textContent = 
        `Question ${index + 1} of ${questions.length}`;

    // Update progress bar
    const progress = ((index + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;

    // Update answered count
    updateAnsweredCount();

    // Display options and restore previous selection
    displayOptions(question);

    // Start/resume timer with remaining time
    startQuestionTimer(question.id, question.time_limit);

    // Update navigation buttons
    updateNavigation();

    // Scroll to top of question
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Display answer options for a question
function displayOptions(question) {
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    const options = ['A', 'B', 'C', 'D'];
    let optionsRendered = 0;

    options.forEach(option => {
        const optionKey = `option_${option.toLowerCase()}`;
        const optionText = question[optionKey];

        // Skip if option doesn't exist
        if (!optionText || optionText.trim() === '') return;

        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';

        // Check if this option was previously selected
        const isSelected = userAnswers[question.id] === option;
        if (isSelected) {
            optionDiv.classList.add('selected');
        }

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = option;
        radio.id = `option-${option}`;
        radio.checked = isSelected;

        const label = document.createElement('label');
        label.htmlFor = `option-${option}`;
        label.innerHTML = `
            <span class="option-letter">${option}</span>
            <span class="option-text">${optionText}</span>
        `;

        // Click handler for entire option div
        optionDiv.onclick = (e) => {
            // Prevent double-triggering if clicking on radio button
            if (e.target !== radio) {
                radio.checked = true;
            }
            saveAnswer(question.id, option);
            
            // Visual feedback - highlight selected option
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionDiv.classList.add('selected');
        };

        // Radio button change handler
        radio.onchange = () => {
            saveAnswer(question.id, option);
        };

        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
        optionsRendered++;
    });

    console.log(`Rendered ${optionsRendered} options for question ${question.id}`);
}

// ==================== ANSWER MANAGEMENT ====================

// Save user's answer for a question
function saveAnswer(questionId, selectedOption) {
    userAnswers[questionId] = selectedOption;
    updateAnsweredCount();
    console.log('Answer saved:', { questionId, selectedOption, total: Object.keys(userAnswers).length });
}

// Update the answered count display
function updateAnsweredCount() {
    const answeredCount = Object.keys(userAnswers).length;
    document.getElementById('answered-count').textContent = 
        `Answered: ${answeredCount}/${questions.length}`;
}

// ==================== NAVIGATION ====================

// Update navigation button states
function updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    // Disable previous button on first question
    prevBtn.disabled = currentQuestionIndex === 0;

    // Show submit button on last question, otherwise show next button
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Auto-move to next question (when timer expires)
function autoMoveToNext() {
    if (currentQuestionIndex < questions.length - 1) {
        console.log('Auto-advancing to next question');
        displayQuestion(currentQuestionIndex + 1);
    } else {
        console.log('Last question reached, highlighting submit button');
        document.getElementById('submit-btn').classList.add('pulse');
        document.getElementById('submit-btn').focus();
    }
}

// Navigation button event listeners
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        console.log('Moving to previous question');
        displayQuestion(currentQuestionIndex - 1);
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        console.log('Moving to next question');
        displayQuestion(currentQuestionIndex + 1);
    }
});

document.getElementById('submit-btn').addEventListener('click', () => {
    const answeredCount = Object.keys(userAnswers).length;
    const unanswered = questions.length - answeredCount;

    if (unanswered > 0) {
        const confirmMessage = `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}.\n\nAre you sure you want to submit?`;
        if (!confirm(confirmMessage)) {
            console.log('Submission cancelled by user');
            return;
        }
    }

    console.log('User confirmed submission');
    submitQuiz();
});

// ==================== QUIZ SUBMISSION ====================

// Submit quiz answers to backend
async function submitQuiz() {
    // Stop all timers
    stopQuestionTimer();
    clearInterval(overallTimer);

    showLoading(true, 'Submitting your answers...');

    // Prepare answers array
    const answers = Object.entries(userAnswers).map(([question_id, selected_option]) => ({
        question_id: parseInt(question_id),
        selected_option
    }));

    console.log('Submitting quiz:', {
        quiz_id: currentQuiz.id,
        answered: answers.length,
        total: questions.length,
        answers
    });

    try {
        const response = await fetch(`${API_BASE}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quiz_id: currentQuiz.id,
                answers
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Submission failed');
        }

        console.log('Quiz submitted successfully:', result);
        showLoading(false);
        displayResults(result);

    } catch (error) {
        console.error('Error submitting quiz:', error);
        showLoading(false);
        alert(`Error submitting quiz: ${error.message}\n\nPlease try again.`);
        
        // Restart timers if submission failed
        startOverallTimer();
        const currentQuestion = questions[currentQuestionIndex];
        startQuestionTimer(currentQuestion.id, currentQuestion.time_limit);
    }
}

// Auto-submit when overall time expires
function autoSubmitQuiz(message) {
    console.log('Auto-submitting quiz:', message);
    alert(message);
    submitQuiz();
}

// ==================== RESULTS DISPLAY ====================

// Display quiz results
function displayResults(result) {
    // Hide quiz container, show results
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';

    const percentage = parseFloat(result.percentage || ((result.score / result.total) * 100).toFixed(2));
    
    // Update score display
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    document.getElementById('score-text').textContent = 
        `You scored ${result.score} out of ${result.total}`;

    // Color score circle based on percentage
    const scoreCircle = document.querySelector('.score-circle');
    if (percentage >= 80) {
        scoreCircle.style.borderColor = '#28a745';
        scoreCircle.style.color = '#28a745';
    } else if (percentage >= 60) {
        scoreCircle.style.borderColor = '#ffc107';
        scoreCircle.style.color = '#ffc107';
    } else {
        scoreCircle.style.borderColor = '#dc3545';
        scoreCircle.style.color = '#dc3545';
    }

    // Display detailed results summary
    const correctCount = result.results.filter(r => r.correct).length;
    const incorrectCount = result.total - correctCount;

    document.getElementById('detailed-results').innerHTML = `
        <div class="results-summary">
            <div class="summary-item correct">
                <span class="summary-icon">✓</span>
                <span class="summary-label">Correct</span>
                <span class="summary-value">${correctCount}</span>
            </div>
            <div class="summary-item incorrect">
                <span class="summary-icon">✗</span>
                <span class="summary-label">Incorrect</span>
                <span class="summary-value">${incorrectCount}</span>
            </div>
        </div>
    `;

    // Load and display leaderboard
    loadLeaderboard(currentQuiz.id);

    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('Results displayed:', {
        score: result.score,
        total: result.total,
        percentage: percentage
    });
}

// Load leaderboard from backend
async function loadLeaderboard(quizId) {
    const leaderboardEl = document.getElementById('leaderboard');
    leaderboardEl.innerHTML = '<p class="loading-text">Loading leaderboard...</p>';

    try {
        console.log('Fetching leaderboard for quiz:', quizId);
        
        const response = await fetch(`${API_BASE}/${quizId}/leaderboard?limit=10`);
        const data = await response.json();

        if (!data.success || !data.leaderboard || data.leaderboard.length === 0) {
            leaderboardEl.innerHTML = '<p class="no-data">No leaderboard entries yet. You\'re the first!</p>';
            return;
        }

        console.log('Leaderboard loaded:', data.leaderboard.length, 'entries');

        leaderboardEl.innerHTML = data.leaderboard.map((entry, index) => {
            let medal = '';
            if (index === 0) medal = '🥇';
            else if (index === 1) medal = '🥈';
            else if (index === 2) medal = '🥉';

            return `
                <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}">
                    <span class="entry-rank">${medal || `#${entry.rank}`}</span>
                    <span class="entry-score">Score: ${entry.score}</span>
                    <span class="entry-date">${formatDate(entry.submitted_at)}</span>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading leaderboard:', error);
        leaderboardEl.innerHTML = '<p class="error">Failed to load leaderboard. Please refresh the page.</p>';
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Show/hide loading overlay
function showLoading(show, message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.querySelector('p').textContent = message;
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

// Pad number with leading zero
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ==================== PAGE UNLOAD PROTECTION ====================

// Warn user before leaving page during active quiz
window.addEventListener('beforeunload', (e) => {
    const resultsVisible = document.getElementById('results-container').style.display === 'block';
    
    if (currentQuiz && questions.length > 0 && !resultsVisible) {
        e.preventDefault();
        e.returnValue = 'You have an active quiz in progress. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// ==================== DEBUG HELPERS ====================

// Debug function to check quiz state (call from browser console)
window.debugQuizState = function() {
    console.log('=== QUIZ STATE DEBUG ===');
    console.log('Current Quiz:', currentQuiz);
    console.log('Questions:', questions);
    console.log('Current Question Index:', currentQuestionIndex);
    console.log('User Answers:', userAnswers);
    console.log('Time Remaining:', questionTimeRemaining);
    console.log('Questions Visited:', questionVisited);
    console.log('========================');
};

// Log that script is loaded
console.log('Quiz.js loaded successfully');
console.log('Tip: Type debugQuizState() in console to see current state');
