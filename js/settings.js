/**
 * Settings Management - Ближе App
 * Темы, шрифты, настройки пользователя
 */

/**
 * Load settings from localStorage
 */
function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.settings);
        if (saved) {
            state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Failed to load settings:', e);
        state.settings = { ...DEFAULT_SETTINGS };
    }
    applySettings();
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    try {
        localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
    } catch (e) {
        console.error('Failed to save settings:', e);
    }
}

/**
 * Apply current settings to UI
 */
function applySettings() {
    // Apply theme and font size to body
    document.body.className = `theme-${state.settings.theme} font-size-${state.settings.fontSize}`;
    
    // Update theme buttons
    updateThemeButtons();
    
    // Update font size buttons
    updateFontSizeButtons();
    
    // Update auto hints toggle
    updateAutoHintsToggle();
}

/**
 * Update theme button states
 */
function updateThemeButtons() {
    document.querySelectorAll('.theme-preview').forEach(btn => {
        btn.classList.remove('border-purple-400', 'border-pink-400', 'border-stone-400', 'active');
    });
    
    const themeBtn = document.getElementById(`theme${capitalize(state.settings.theme)}`);
    if (themeBtn) {
        const borderColors = {
            blue: 'border-purple-400',
            warm: 'border-pink-400',
            neutral: 'border-stone-400'
        };
        themeBtn.classList.add(borderColors[state.settings.theme], 'active');
    }
}

/**
 * Update font size button states
 */
function updateFontSizeButtons() {
    document.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.classList.remove('bg-purple-500', 'text-white', 'active');
        btn.classList.add('bg-gray-100', 'text-gray-600');
    });
    
    const fontBtn = document.getElementById(`font${capitalize(state.settings.fontSize)}`);
    if (fontBtn) {
        fontBtn.classList.remove('bg-gray-100', 'text-gray-600');
        fontBtn.classList.add('bg-purple-500', 'text-white', 'active');
    }
}

/**
 * Update auto hints toggle state
 */
function updateAutoHintsToggle() {
    const toggle = document.getElementById('autoHintsToggle');
    if (toggle) {
        toggle.classList.toggle('active', state.settings.autoHints);
    }
}

/**
 * Set color theme
 * @param {string} theme - 'blue', 'warm', or 'neutral'
 */
function setTheme(theme) {
    state.settings.theme = theme;
    saveSettings();
    applySettings();
}

/**
 * Set font size
 * @param {string} size - 'normal', 'large', or 'xl'
 */
function setFontSize(size) {
    state.settings.fontSize = size;
    saveSettings();
    applySettings();
}

/**
 * Toggle a boolean setting
 * @param {string} setting - Setting key
 * @param {HTMLElement} btn - Toggle button element
 */
function toggleSetting(setting, btn) {
    state.settings[setting] = !state.settings[setting];
    btn.classList.toggle('active');
    saveSettings();
}

/**
 * Clear all user data
 */
function clearAllData() {
    if (confirm('Удалить всю историю и избранное? Это действие нельзя отменить.')) {
        localStorage.removeItem(STORAGE_KEYS.history);
        localStorage.removeItem(STORAGE_KEYS.favorites);
        state.allFavorites = {};
        alert('Данные удалены');
    }
}

/**
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export
if (typeof window !== 'undefined') {
    window.loadSettings = loadSettings;
    window.saveSettings = saveSettings;
    window.applySettings = applySettings;
    window.setTheme = setTheme;
    window.setFontSize = setFontSize;
    window.toggleSetting = toggleSetting;
    window.clearAllData = clearAllData;
}
