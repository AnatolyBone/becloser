/**
 * Results Screen - Ближе App
 * Экран результатов сессии
 */

// Tips for results screen
let tipsDB = [];

/**
 * Load tips from JSON
 */
async function loadTips() {
    try {
        const response = await fetch('data/tips.json');
        if (response.ok) {
            const data = await response.json();
            tipsDB = data.tips;
        }
    } catch (e) {
        tipsDB = getDefaultTips();
    }
}

/**
 * Get default tips
 * @returns {Array}
 */
function getDefaultTips() {
    return [
        'Попробуйте проводить такие сессии регулярно — например, раз в неделю. Это укрепляет связь и создаёт традицию открытого общения.',
        'После разговора можно обняться или просто побыть рядом в тишине. Иногда молчание — тоже часть близости.',
        'Если какой-то вопрос затронул важную тему, можно вернуться к ней позже в спокойной обстановке.',
        'Записывайте избранные вопросы — к ним можно возвращаться и наблюдать, как меняются ответы со временем.',
        'Не обязательно обсуждать всё за один раз. Маленькие, но регулярные разговоры — залог близости.'
    ];
}

/**
 * Show results screen
 */
function showResults() {
    // Save to history
    saveSessionToHistory();
    
    const total = state.sessionQuestions.length;
    const answered = state.answeredQuestions.length;
    const skipped = state.skippedQuestions.length;
    const favCount = state.sessionFavorites.length;
    
    // Determine emoji and title based on completion
    let emoji = '🎉';
    let title = 'Отлично!';
    
    if (answered >= total) {
        emoji = '🏆';
        title = 'Вы молодцы!';
    } else if (answered >= total / 2) {
        emoji = '👏';
        title = 'Хорошая сессия!';
    } else {
        emoji = '💙';
        title = 'Спасибо за разговор';
    }
    
    // Update UI
    document.getElementById('resultsEmoji').textContent = emoji;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsText').textContent = 
        `Вы обсудили ${answered} ${getQuestionWord(answered)} из ${total}`;
    
    document.getElementById('summaryAnswered').textContent = answered;
    document.getElementById('summarySkipped').textContent = skipped;
    document.getElementById('summaryFavorites').textContent = favCount;
    
    // Session duration
    const duration = getSessionDuration(state.sessionStartTime);
    document.getElementById('summaryTime').textContent = duration > 0 ? `${duration} мин` : '< 1 мин';
    
    // Reflection questions based on target
    updateReflectionQuestions();
    
    // Random tip
    const tips = tipsDB.length > 0 ? tipsDB : getDefaultTips();
    document.getElementById('tipText').textContent = getRandomItem(tips);
    
    // Favorites section
    updateFavoritesSection();
    
    showScreen('resultsScreen');
    hapticFeedback('notification');
}

/**
 * Update reflection questions based on target type
 */
function updateReflectionQuestions() {
    const reflections = {
        couple: {
            q1: '💬 Что из сегодняшнего разговора тебя удивило или порадовало?',
            q2: '🤗 За что ты благодарен(на) партнёру после этого разговора?'
        },
        family: {
            q1: '💬 Что нового ты узнал(а) о ком-то из семьи сегодня?',
            q2: '🤗 Что тебе понравилось в нашем разговоре?'
        },
        parentAdultChild: {
            q1: '💬 Что из сегодняшнего разговора было для тебя важным?',
            q2: '🤗 Что ты хочешь сказать друг другу напоследок?'
        }
    };
    
    const ref = reflections[state.session.target] || reflections.couple;
    document.getElementById('reflectionQ1').textContent = ref.q1;
    document.getElementById('reflectionQ2').textContent = ref.q2;
}

/**
 * Update favorites section in results
 */
function updateFavoritesSection() {
    const favsSection = document.getElementById('favoritesSection');
    const favsList = document.getElementById('favoritesList');
    
    if (state.sessionFavorites.length > 0) {
        favsSection.classList.remove('hidden');
        favsList.innerHTML = state.sessionFavorites.map(id => {
            const q = getQuestionById(id);
            return q ? `<div class="bg-white/60 p-3 rounded-xl text-sm text-gray-700">${q.text}</div>` : '';
        }).filter(html => html).join('');
    } else {
        favsSection.classList.add('hidden');
    }
}

/**
 * Save session to history
 */
function saveSessionToHistory() {
    try {
        let history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
        
        const sessionData = {
            id: Date.now(),
            date: new Date().toISOString(),
            target: state.session.target,
            answered: state.answeredQuestions.length,
            skipped: state.skippedQuestions.length,
            total: state.sessionQuestions.length,
            favorites: state.sessionFavorites.map(id => {
                const q = getQuestionById(id);
                return q ? q.text : '';
            }).filter(t => t),
            duration: getSessionDuration(state.sessionStartTime)
        };
        
        history.unshift(sessionData);
        
        // Keep only last 50 sessions
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        
        localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    } catch (e) {
        console.error('Failed to save history', e);
    }
}

/**
 * Load and display session history
 */
function loadHistory() {
    const historyList = document.getElementById('historyList');
    const historyEmpty = document.getElementById('historyEmpty');
    const allFavsSection = document.getElementById('allFavoritesSection');
    const allFavsList = document.getElementById('allFavoritesList');
    
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]');
        
        if (history.length === 0) {
            historyList.classList.add('hidden');
            historyEmpty.classList.remove('hidden');
        } else {
            historyList.classList.remove('hidden');
            historyEmpty.classList.add('hidden');
            
            historyList.innerHTML = history.slice(0, 20).map(s => `
                <div class="card p-4 rounded-xl shadow-sm history-card">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-sm font-medium text-gray-800">${getTargetName(s.target)}</span>
                        <span class="text-xs text-gray-400">${formatDate(s.date)}</span>
                    </div>
                    <div class="text-sm text-gray-600">
                        Обсуждено: ${s.answered} из ${s.total}
                        ${s.favorites && s.favorites.length > 0 ? `<span class="ml-2">❤️ ${s.favorites.length}</span>` : ''}
                    </div>
                </div>
            `).join('');
        }
        
        // Show all favorites
        const allFavs = Object.values(state.allFavorites || {}).flat();
        if (allFavs.length > 0) {
            allFavsSection.classList.remove('hidden');
            allFavsList.innerHTML = [...new Set(allFavs)].map(text => `
                <div class="bg-white/60 p-3 rounded-xl text-sm text-gray-700">${text}</div>
            `).join('');
        } else {
            allFavsSection.classList.add('hidden');
        }
        
    } catch (e) {
        historyList.classList.add('hidden');
        historyEmpty.classList.remove('hidden');
    }
}

// Export
if (typeof window !== 'undefined') {
    window.loadTips = loadTips;
    window.showResults = showResults;
    window.saveSessionToHistory = saveSessionToHistory;
    window.loadHistory = loadHistory;
}
