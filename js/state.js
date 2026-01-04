/**
 * Global State - Ближе App
 * Централизованное управление состоянием приложения
 */

// Storage Keys
const STORAGE_KEYS = {
    settings: 'blizhe_settings',
    favorites: 'blizhe_favorites',
    history: 'blizhe_history'
};

// Default Settings
const DEFAULT_SETTINGS = {
    theme: 'blue',
    fontSize: 'normal',
    autoHints: false
};

// Default Session Config
const DEFAULT_SESSION = {
    target: null,
    stage: null,
    crisis: false,
    crisisLevel: 'low',
    depth: null,
    count: 5,
    categories: ['random']
};

// Application State
const state = {
    // Current screen
    currentScreen: 'loadingScreen',
    
    // Setup wizard
    setupStep: 1,
    
    // Session configuration
    session: { ...DEFAULT_SESSION },
    
    // Current game state
    currentQuestionIndex: 0,
    sessionQuestions: [],
    answeredQuestions: [],
    skippedQuestions: [],
    sessionFavorites: [],
    sessionStartTime: null,
    
    // Persistent data
    allFavorites: {},
    
    // Settings
    settings: { ...DEFAULT_SETTINGS }
};

/**
 * Reset session to defaults
 */
function resetSession() {
    state.session = { ...DEFAULT_SESSION };
    state.currentQuestionIndex = 0;
    state.sessionQuestions = [];
    state.answeredQuestions = [];
    state.skippedQuestions = [];
    state.sessionFavorites = [];
    state.sessionStartTime = null;
}

/**
 * Reset setup wizard
 */
function resetSetup() {
    state.setupStep = 1;
    resetSession();
    state.session.categories = ['random'];
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
    window.DEFAULT_SESSION = DEFAULT_SESSION;
    window.state = state;
    window.resetSession = resetSession;
    window.resetSetup = resetSetup;
}
