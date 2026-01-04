/**
 * Telegram Web App Integration - Ближе App
 */

/**
 * Initialize Telegram Web App
 */
function initTelegram() {
    if (!window.Telegram || !window.Telegram.WebApp) {
        console.log('Telegram WebApp not available, running in browser mode');
        return;
    }
    
    const tg = window.Telegram.WebApp;
    
    // Tell Telegram that app is ready
    tg.ready();
    
    // Expand to full height
    tg.expand();
    
    // Setup back button handler
    tg.BackButton.onClick(handleTelegramBack);
    
    // Update back button visibility
    updateTelegramBackButton();
    
    console.log('Telegram WebApp initialized');
}

/**
 * Handle Telegram back button press
 */
function handleTelegramBack() {
    switch (state.currentScreen) {
        case 'questionScreen':
            if (state.answeredQuestions.length > 0) {
                endSessionEarly();
            } else {
                showScreen('welcomeScreen');
            }
            break;
            
        case 'preSessionScreen':
            showScreen('setupScreen');
            break;
            
        case 'setupScreen':
            if (state.setupStep > 1) {
                prevSetupStep();
            } else {
                showScreen('welcomeScreen');
            }
            break;
            
        case 'resultsScreen':
        case 'historyScreen':
        case 'settingsScreen':
        case 'aboutScreen':
            showScreen('welcomeScreen');
            break;
            
        default:
            // Do nothing on welcome screen
            break;
    }
}

/**
 * Update Telegram back button visibility
 */
function updateTelegramBackButton() {
    if (!window.Telegram || !window.Telegram.WebApp) return;
    
    const tg = window.Telegram.WebApp;
    const hideOnScreens = ['welcomeScreen', 'loadingScreen'];
    
    if (hideOnScreens.includes(state.currentScreen)) {
        tg.BackButton.hide();
    } else {
        tg.BackButton.show();
    }
}

/**
 * Send haptic feedback (if available)
 * @param {string} type - 'impact', 'notification', or 'selection'
 */
function hapticFeedback(type = 'impact') {
    if (!window.Telegram || !window.Telegram.WebApp) return;
    
    const tg = window.Telegram.WebApp;
    if (!tg.HapticFeedback) return;
    
    switch (type) {
        case 'impact':
            tg.HapticFeedback.impactOccurred('light');
            break;
        case 'notification':
            tg.HapticFeedback.notificationOccurred('success');
            break;
        case 'selection':
            tg.HapticFeedback.selectionChanged();
            break;
    }
}

/**
 * Close the Mini App
 */
function closeMiniApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
    }
}

/**
 * Check if running inside Telegram
 * @returns {boolean}
 */
function isTelegramWebApp() {
    return !!(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData);
}

// Export
if (typeof window !== 'undefined') {
    window.initTelegram = initTelegram;
    window.updateTelegramBackButton = updateTelegramBackButton;
    window.hapticFeedback = hapticFeedback;
    window.closeMiniApp = closeMiniApp;
    window.isTelegramWebApp = isTelegramWebApp;
}
