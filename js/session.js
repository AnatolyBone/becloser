/**
 * Session Logic - Ближе App
 * Управление игровой сессией
 */

/**
 * Start a new session
 */
function startSession() {
    // Validate parameters
    if (!state.session.target || !state.session.stage || !state.session.depth) {
        alert('Пожалуйста, завершите настройку сессии');
        return;
    }
    
    // Select questions
    state.sessionQuestions = selectSessionQuestions(state.session.count);
    state.currentQuestionIndex = 0;
    state.sessionFavorites = [];
    state.answeredQuestions = [];
    state.skippedQuestions = [];
    
    if (state.sessionQuestions.length === 0) {
        alert('К сожалению, не нашлось подходящих вопросов. Попробуйте изменить параметры.');
        return;
    }
    
    // Show pre-session screen
    const crisisReminder = document.getElementById('crisisReminder');
    if (crisisReminder) {
        crisisReminder.classList.toggle('hidden', !state.session.crisis);
    }
    
    showScreen('preSessionScreen');
}

/**
 * Begin questions after pre-session screen
 */
function beginQuestions() {
    state.sessionStartTime = Date.now();
    showScreen('questionScreen');
    displayQuestion();
    hapticFeedback('notification');
}

/**
 * Display current question
 */
function displayQuestion() {
    const q = state.sessionQuestions[state.currentQuestionIndex];
    
    // Update question text
    document.getElementById('questionText').textContent = q.text;
    document.getElementById('hintText').textContent = q.hint;
    document.getElementById('questionCounter').textContent = 
        `Вопрос ${state.currentQuestionIndex + 1} из ${state.sessionQuestions.length}`;
    
    // Update progress bar
    const progress = ((state.currentQuestionIndex + 1) / state.sessionQuestions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Trigger warning
    const warningEl = document.getElementById('triggerWarning');
    if (q.triggerWarning) {
        document.getElementById('triggerText').textContent = q.triggerWarning;
        warningEl.classList.remove('hidden');
    } else {
        warningEl.classList.add('hidden');
    }
    
    // Reset hint
    const hintBox = document.getElementById('hintBox');
    hintBox.classList.remove('open');
    if (state.settings.autoHints) {
        hintBox.classList.add('open');
    }
    
    // Update favorite button
    const isFav = state.sessionFavorites.includes(q.id);
    updateFavoriteButton(isFav);
    
    // Animate card
    const card = document.getElementById('questionCard');
    card.classList.remove('question-card');
    void card.offsetWidth; // Force reflow
    card.classList.add('question-card');
}

/**
 * Go to next question
 */
function nextQuestion() {
    const currentQ = state.sessionQuestions[state.currentQuestionIndex];
    
    // Mark as answered if not already
    if (!state.answeredQuestions.includes(currentQ.id) && !state.skippedQuestions.includes(currentQ.id)) {
        state.answeredQuestions.push(currentQ.id);
    }
    
    hapticFeedback('impact');
    
    if (state.currentQuestionIndex < state.sessionQuestions.length - 1) {
        state.currentQuestionIndex++;
        displayQuestion();
    } else {
        showResults();
    }
}

/**
 * Skip current question
 */
function skipQuestion() {
    const currentQ = state.sessionQuestions[state.currentQuestionIndex];
    
    // Mark as skipped
    if (!state.skippedQuestions.includes(currentQ.id)) {
        state.skippedQuestions.push(currentQ.id);
        const idx = state.answeredQuestions.indexOf(currentQ.id);
        if (idx > -1) state.answeredQuestions.splice(idx, 1);
    }
    
    if (state.currentQuestionIndex < state.sessionQuestions.length - 1) {
        state.currentQuestionIndex++;
        displayQuestion();
    } else {
        showResults();
    }
}

/**
 * Toggle hint visibility
 */
function toggleHint() {
    document.getElementById('hintBox').classList.toggle('open');
}

/**
 * Toggle favorite status for current question
 */
function toggleFavorite() {
    const q = state.sessionQuestions[state.currentQuestionIndex];
    const idx = state.sessionFavorites.indexOf(q.id);
    
    if (idx > -1) {
        state.sessionFavorites.splice(idx, 1);
        updateFavoriteButton(false);
    } else {
        state.sessionFavorites.push(q.id);
        updateFavoriteButton(true);
        
        // Save to persistent favorites
        const key = getFavoritesKey();
        if (!state.allFavorites[key]) {
            state.allFavorites[key] = [];
        }
        if (!state.allFavorites[key].includes(q.text)) {
            state.allFavorites[key].push(q.text);
            saveFavorites();
        }
    }
    
    hapticFeedback('selection');
}

/**
 * Update favorite button appearance
 * @param {boolean} isFav
 */
function updateFavoriteButton(isFav) {
    const icon = document.getElementById('favoriteIcon');
    if (isFav) {
        icon.setAttribute('fill', 'currentColor');
        icon.classList.remove('text-gray-400');
        icon.classList.add('text-red-500');
    } else {
        icon.setAttribute('fill', 'none');
        icon.classList.remove('text-red-500');
        icon.classList.add('text-gray-400');
    }
}

/**
 * End session early
 */
function endSessionEarly() {
    if (confirm('Завершить сессию?')) {
        showResults();
    }
}

/**
 * Repeat session with same settings
 */
function repeatSession() {
    startSession();
}

/**
 * Load favorites from storage
 */
function loadFavorites() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.favorites);
        if (saved) {
            state.allFavorites = JSON.parse(saved);
        } else {
            state.allFavorites = {};
        }
    } catch (e) {
        state.allFavorites = {};
    }
}

/**
 * Save favorites to storage
 */
function saveFavorites() {
    try {
        localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(state.allFavorites));
    } catch (e) {
        console.error('Failed to save favorites', e);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.startSession = startSession;
    window.beginQuestions = beginQuestions;
    window.displayQuestion = displayQuestion;
    window.nextQuestion = nextQuestion;
    window.skipQuestion = skipQuestion;
    window.toggleHint = toggleHint;
    window.toggleFavorite = toggleFavorite;
    window.updateFavoriteButton = updateFavoriteButton;
    window.endSessionEarly = endSessionEarly;
    window.repeatSession = repeatSession;
    window.loadFavorites = loadFavorites;
    window.saveFavorites = saveFavorites;
}
