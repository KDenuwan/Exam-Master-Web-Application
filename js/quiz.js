// quiz.js
let currentStage = 1;
let currentQuestion = 0;
let score = 0;
let timer;
let soundEnabled = true;

// Debug function to check if everything is loaded
function debugInit() {
    console.log('Quiz initialization started');
    console.log('Current stage:', currentStage);
    console.log('Questions loaded:', questions !== undefined);
    console.log('Welcome screen:', document.getElementById('welcome-screen') !== null);
    console.log('Quiz screen:', document.getElementById('quiz-screen') !== null);
}

// Get questions for current stage
function getCurrentStageQuestions() {
    console.log('Getting questions for stage:', currentStage);
    return questions[`stage${currentStage}`];
}

// Start quiz function
function startQuiz() {
    console.log('Starting quiz...');
    try {
        const welcomeScreen = document.getElementById('welcome-screen');
        const quizScreen = document.getElementById('quiz-screen');
        
        if (!welcomeScreen || !quizScreen) {
            console.error('Required screens not found');
            return;
        }

        welcomeScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        
        const currentStageElement = document.getElementById('current-stage');
        if (currentStageElement) {
            currentStageElement.textContent = currentStage;
        }

        showStageTransition();
        setTimeout(() => {
            loadQuestion();
            startTimer();
        }, 1500);
    } catch (error) {
        console.error('Error starting quiz:', error);
    }
}

// Load question function
function loadQuestion() {
    console.log('Loading question:', currentQuestion);
    try {
        const currentQuestions = getCurrentStageQuestions();
        if (!currentQuestions) {
            console.error('No questions found for current stage');
            return;
        }

        const question = currentQuestions[currentQuestion];
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.querySelector('.options-container');

        if (!questionText || !optionsContainer) {
            console.error('Question elements not found');
            return;
        }

        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => checkAnswer(index);
            optionsContainer.appendChild(button);
        });

        updateProgress();
    } catch (error) {
        console.error('Error loading question:', error);
    }
}


// Check answer function
function checkAnswer(selectedIndex) {
    const questions = getCurrentStageQuestions();
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(button => button.style.pointerEvents = 'none');
    
    if (selectedIndex === question.correct) {
        buttons[selectedIndex].classList.add('correct');
        showFeedback(true);
        updateScore(10);
        playSound('correct-sound');
        createConfetti();
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[question.correct].classList.add('correct');
        showFeedback(false);
        playSound('wrong-sound');
    }

    setTimeout(() => nextQuestion(), 1500);
}

// Next question function
function nextQuestion() {
    currentQuestion++;
    const questions = getCurrentStageQuestions();
    
    if (currentQuestion >= questions.length) {
        showStageResults();
    } else {
        const questionElement = document.getElementById('question-text');
        questionElement.style.transform = 'translateX(-100%)';
        questionElement.style.opacity = '0';
        
        setTimeout(() => {
            loadQuestion();
            questionElement.style.transform = 'translateX(0)';
            questionElement.style.opacity = '1';
        }, 500);
    }
}

// Update progress
function updateProgress() {
    const questions = getCurrentStageQuestions();
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-bar-fill').style.width = `${progress}%`;
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('score-display').textContent = `Score: ${score}/100`;
}

// Show feedback
function showFeedback(isCorrect) {
    const overlay = document.querySelector('.feedback-overlay');
    const content = overlay.querySelector('.feedback-content');
    
    content.querySelector('h2').textContent = isCorrect ? 'Correct!' : 'Wrong!';
    content.querySelector('p').textContent = isCorrect ? 
        'Great job! Keep going!' : 'Don\'t worry, keep trying!';
    
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 1500);
}

// Update score
function updateScore(points) {
    score += points;
    const scoreElements = document.querySelectorAll('.current-score');
    scoreElements.forEach(element => {
        element.textContent = score;
        element.parentElement.classList.add('score-update');
        setTimeout(() => element.parentElement.classList.remove('score-update'), 500);
    });
    updateProgress();
}

// Create confetti effect
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`;
        confetti.style.animation = `confetti ${1 + Math.random() * 2}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Show stage transition
function showStageTransition() {
    const transition = document.querySelector('.stage-transition');
    transition.querySelector('.stage-number').textContent = currentStage;
    transition.classList.add('active');
    setTimeout(() => transition.classList.remove('active'), 1500);
}

// Show stage results
function showStageResults() {
    clearInterval(timer);
    const modal = document.querySelector('.celebration-modal');
    modal.querySelector('.stage-number').textContent = currentStage;
    modal.classList.add('active');
    playSound('success-sound');
    createConfetti();
}

// Timer functions
function startTimer() {
    let time = 600; // 10 minutes
    timer = setInterval(() => {
        time--;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('time-remaining').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (time <= 0) {
            clearInterval(timer);
            showStageResults();
        }
    }, 1000);
}

// Start next stage
function startNextStage() {
    if (currentStage < 3) {
        currentStage++;
        currentQuestion = 0;
        score = 0;
        document.querySelector('.celebration-modal').classList.remove('active');
        document.getElementById('current-stage').textContent = currentStage;
        showStageTransition();
        setTimeout(() => {
            loadQuestion();
            startTimer();
        }, 1500);
    } else {
        // Handle quiz completion
        alert('Congratulations! You have completed all stages!');
        window.location.reload();
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Sound control
    document.getElementById('sound-control').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        const icon = document.querySelector('#sound-control i');
        icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    });

    // Next stage button
    document.querySelector('.next-stage-btn').addEventListener('click', startNextStage);
});

// Play sound function
function playSound(soundId) {
    if (soundEnabled) {
        const sound = document.getElementById(soundId);
        sound.currentTime = 0;
        sound.play().catch(error => console.log('Sound play failed:', error));
    }
}

// Initialize quiz
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    debugInit();

    // Add click event listener to start button
    const startButton = document.querySelector('.start-btn');
    if (startButton) {
        console.log('Start button found');
        startButton.addEventListener('click', startQuiz);
    } else {
        console.error('Start button not found');
    }

    // Sound control
    const soundControl = document.getElementById('sound-control');
    if (soundControl) {
        soundControl.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            const icon = soundControl.querySelector('i');
            if (icon) {
                icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            }
        });
    }

    // Next stage button
    const nextStageBtn = document.querySelector('.next-stage-btn');
    if (nextStageBtn) {
        nextStageBtn.addEventListener('click', startNextStage);
    }
});