/**
 * Utility Functions - Ближе App
 */

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array
 * @returns {Array} Shuffled copy
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get correct Russian word form for questions count
 * @param {number} n
 * @returns {string}
 */
function getQuestionWord(n) {
    const lastTwo = n % 100;
    const lastOne = n % 10;
    
    if (lastTwo >= 11 && lastTwo <= 19) return 'вопросов';
    if (lastOne === 1) return 'вопрос';
    if (lastOne >= 2 && lastOne <= 4) return 'вопроса';
    return 'вопросов';
}

/**
 * Format date for display
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Get target display name
 * @param {string} target
 * @returns {string}
 */
function getTargetName(target) {
    const names = {
        couple: '💑 Пара',
        family: '👨‍👩‍👧 Семья',
        parentAdultChild: '👩‍🦳 Родитель и ребёнок'
    };
    return names[target] || target;
}

/**
 * Generate unique key for favorites storage
 * @returns {string}
 */
function getFavoritesKey() {
    const date = new Date().toISOString().split('T')[0];
    return `${state.session.target}_${date}`;
}

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get random item from array
 * @param {Array} array
 * @returns {*}
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Calculate session duration in minutes
 * @param {number} startTime - Timestamp
 * @returns {number}
 */
function getSessionDuration(startTime) {
    return Math.round((Date.now() - startTime) / 60000);
}

// Export
if (typeof window !== 'undefined') {
    window.shuffleArray = shuffleArray;
    window.getQuestionWord = getQuestionWord;
    window.formatDate = formatDate;
    window.getTargetName = getTargetName;
    window.getFavoritesKey = getFavoritesKey;
    window.debounce = debounce;
    window.getRandomItem = getRandomItem;
    window.getSessionDuration = getSessionDuration;
}
