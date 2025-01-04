let currentStage = 1;
let currentQuestion = 0;
let score = 0;
let canProceed = false;
let timer;
let timeLeft;

// Initialize the quiz
function initializeQuiz() {
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('certificate-screen').classList.add('hidden');
}

// Start the quiz for a specific stage
function startQuiz(stage) {
    currentStage = stage;
    currentQuestion = 0;
    score = 0;
    hideAllScreens();
    document.getElementById('quiz-screen').classList.remove('hidden');
    loadQuestion();
    updateProgressBar();
    startTimer();
}

// Load question
function loadQuestion() {
    // Clear previous feedback
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.style.display = 'none';
    }

    const questionData = quizQuestions[`stage${currentStage}`][currentQuestion];
    document.getElementById('current-stage').textContent = currentStage;
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('question-text').textContent = `${currentQuestion + 1}. ${questionData.question}`;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = `${['a', 'b', 'c', 'd'][index]}) ${option}`;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('next-btn').classList.add('hidden');
    canProceed = false;
}

// Handle answer selection
function selectAnswer(selectedIndex) {
    if (canProceed) return;
    
    const questionData = quizQuestions[`stage${currentStage}`][currentQuestion];
    const correct = questionData.correct;
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === correct) {
        buttons[selectedIndex].classList.add('correct');
        showFeedback('Correct! 🎉', 'success');
        playSound('correct');
        score++;
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[correct].classList.add('correct');
        showFeedback('Wrong! The correct answer is: ' + 
            questionData.options[correct], 'error');
        playSound('wrong');
    }
    
    document.getElementById('next-btn').classList.remove('hidden');
    canProceed = true;
    updateProgressBar();
}

// Move to next question
function nextQuestion() {
    if (!canProceed) return;
    
    currentQuestion++;
    if (currentQuestion >= 10) {
        showResults();
    } else {
        loadQuestion();
    }
}

// Show feedback
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    feedback.style.display = 'block';
}

// Update progress bar
function updateProgressBar() {
    const progress = (currentQuestion / 10) * 100;
    document.getElementById('progress-bar-fill').style.width = `${progress}%`;
    document.getElementById('score-display').textContent = `Score: ${score}/10`;
}

// Show results
function showResults() {
    clearInterval(timer);
    hideAllScreens();
    const resultScreen = document.getElementById('result-screen');
    resultScreen.classList.remove('hidden');
    document.getElementById('score').textContent = score;

    const resultMessage = document.getElementById('result-message');
    const nextStageBtn = document.getElementById('next-stage-btn');
    const retryBtn = document.getElementById('retry-btn');
    const certificateBtn = document.getElementById('get-certificate-btn');

    if (score >= 5) {
        resultMessage.textContent = `Congratulations! You passed Stage ${currentStage} with a score of ${score}/10`;
        playSound('success');
        
        if (currentStage === 3) {
            certificateBtn.classList.remove('hidden');
            nextStageBtn.classList.add('hidden');
        } else {
            nextStageBtn.classList.remove('hidden');
            certificateBtn.classList.add('hidden');
        }
        retryBtn.classList.add('hidden');
    } else {
        resultMessage.textContent = `You need to score at least 5 to pass. Your score: ${score}/10`;
        retryBtn.classList.remove('hidden');
        nextStageBtn.classList.add('hidden');
        certificateBtn.classList.add('hidden');
    }
}

// Timer functions
function startTimer() {
    timeLeft = 300; // 5 minutes per stage
    updateTimerDisplay();
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResults();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('time-remaining').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Sound effects
function playSound(type) {
    const sound = document.getElementById(`${type}-sound`);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.log('Sound play failed:', error));
    }
}

// Navigation functions
function startNextStage() {
    startQuiz(currentStage + 1);
}

function retryStage() {
    startQuiz(currentStage);
}

function generateCertificate() {
    hideAllScreens();
    document.getElementById('certificate-screen').classList.remove('hidden');
    document.getElementById('certificate-date').textContent = new Date().toLocaleDateString();
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
}

// Initialize the quiz when the page loads
window.onload = initializeQuiz;