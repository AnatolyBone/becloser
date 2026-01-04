/**
 * Setup Wizard - Ближе App
 * Мастер настройки сессии
 */

/**
 * Initialize setup wizard
 */
function initSetup() {
    resetSetup();
    showSetupStep(1);
    updateSetupProgress();
    
    // Reset all option buttons
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.category-chip').forEach(btn => btn.classList.remove('selected'));
    
    // Select random category by default
    const randomBtn = document.querySelector('[onclick*="random"]');
    if (randomBtn) randomBtn.classList.add('selected');
    
    // Reset crisis toggle
    const crisisToggle = document.getElementById('crisisToggle');
    if (crisisToggle) crisisToggle.classList.remove('active');
}

/**
 * Show specific setup step
 * @param {number} step
 */
function showSetupStep(step) {
    document.querySelectorAll('.setup-step').forEach(s => s.classList.add('hidden'));
    const stepEl = document.querySelector(`.setup-step[data-step="${step}"]`);
    if (stepEl) {
        stepEl.classList.remove('hidden');
    }
    
    // Back button visibility
    const backBtn = document.getElementById('setupBackBtn');
    if (backBtn) {
        backBtn.style.opacity = step > 1 ? '1' : '0';
    }
    
    // Update stage labels based on target type
    if (step === 2) {
        updateStageLabels();
    }
    
    // Show/hide category buttons based on target
    if (step === 6) {
        updateCategoryVisibility();
    }
}

/**
 * Update stage labels based on target type
 */
function updateStageLabels() {
    const target = state.session.target;
    
    const labels = {
        couple: {
            early: { title: '🌱 Мы только начинаем такие разговоры', desc: 'Ещё учимся открываться друг другу' },
            middle: { title: '🌿 Мы уже какое-то время вместе', desc: 'Хотим стать ещё ближе' },
            long: { title: '🌳 Мы давно вместе', desc: 'У нас уже большая история' }
        },
        family: {
            early: { title: '🌱 Мы только начинаем такие разговоры', desc: 'Ещё учимся открываться друг другу' },
            middle: { title: '🌿 Мы общаемся время от времени', desc: 'Хотим стать ещё ближе' },
            long: { title: '🌳 Мы всегда на связи', desc: 'У нас крепкие семейные традиции' }
        },
        parentAdultChild: {
            early: { title: '🌱 Мы только начинаем такие разговоры', desc: 'Учимся общаться по-взрослому' },
            middle: { title: '🌿 Мы общаемся время от времени', desc: 'Хотим лучше понимать друг друга' },
            long: { title: '🌳 Мы всегда на связи', desc: 'У нас уже большая история' }
        }
    };
    
    const currentLabels = labels[target] || labels.couple;
    
    const elements = {
        early: { title: '.stage-title-early', desc: '.stage-desc-early' },
        middle: { title: '.stage-title-middle', desc: '.stage-desc-middle' },
        long: { title: '.stage-title-long', desc: '.stage-desc-long' }
    };
    
    for (const [stage, selectors] of Object.entries(elements)) {
        const titleEl = document.querySelector(selectors.title);
        const descEl = document.querySelector(selectors.desc);
        if (titleEl) titleEl.textContent = currentLabels[stage].title;
        if (descEl) descEl.textContent = currentLabels[stage].desc;
    }
}

/**
 * Update category visibility based on target
 */
function updateCategoryVisibility() {
    const sexCat = document.getElementById('sexCategory');
    const parentCat = document.getElementById('parentingCategory');
    const pastChildhoodCat = document.getElementById('pastChildhoodCategory');
    
    // Sex/intimacy - couples only
    if (sexCat) {
        sexCat.classList.toggle('hidden', state.session.target !== 'couple');
    }
    
    // Parenting - for families
    if (parentCat) {
        parentCat.classList.toggle('hidden', state.session.target === 'couple');
    }
    
    // Past/childhood - hide for families with children
    if (pastChildhoodCat) {
        pastChildhoodCat.classList.toggle('hidden', state.session.target === 'family');
    }
}

/**
 * Update progress dots
 */
function updateSetupProgress() {
    document.querySelectorAll('.progress-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i < state.setupStep);
    });
}

/**
 * Go to next setup step
 */
function nextSetupStep() {
    if (state.setupStep < 6) {
        state.setupStep++;
        showSetupStep(state.setupStep);
        updateSetupProgress();
        hapticFeedback('selection');
    }
}

/**
 * Go to previous setup step
 */
function prevSetupStep() {
    if (state.setupStep > 1) {
        state.setupStep--;
        showSetupStep(state.setupStep);
        updateSetupProgress();
    }
}

/**
 * Select an option in setup
 * @param {string} field - Field name in session
 * @param {*} value - Selected value
 * @param {HTMLElement} btn - Button element
 */
function selectOption(field, value, btn) {
    state.session[field] = value;
    
    // Visual feedback
    const container = btn.parentElement;
    container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    hapticFeedback('selection');
    
    // Auto advance for most steps
    if (field !== 'crisis') {
        setTimeout(nextSetupStep, 300);
    }
}

/**
 * Toggle crisis mode
 * @param {HTMLElement} btn
 */
function toggleCrisis(btn) {
    state.session.crisis = !state.session.crisis;
    state.session.crisisLevel = state.session.crisis ? 'high' : 'low';
    btn.classList.toggle('active');
    hapticFeedback('selection');
}

/**
 * Toggle category selection
 * @param {string} category
 * @param {HTMLElement} btn
 */
function toggleCategory(category, btn) {
    const isRandom = category === 'random';
    const randomBtn = document.querySelector('[onclick*="toggleCategory(\'random\'"]');
    
    if (isRandom) {
        state.session.categories = ['random'];
        document.querySelectorAll('.category-chip').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    } else {
        if (state.session.categories.includes('random')) {
            state.session.categories = [];
            if (randomBtn) randomBtn.classList.remove('selected');
        }
        
        const idx = state.session.categories.indexOf(category);
        if (idx > -1) {
            state.session.categories.splice(idx, 1);
            btn.classList.remove('selected');
        } else {
            state.session.categories.push(category);
            btn.classList.add('selected');
        }
        
        if (state.session.categories.length === 0) {
            state.session.categories = ['random'];
            if (randomBtn) randomBtn.classList.add('selected');
        }
    }
    
    hapticFeedback('selection');
}

// Export
if (typeof window !== 'undefined') {
    window.initSetup = initSetup;
    window.showSetupStep = showSetupStep;
    window.updateSetupProgress = updateSetupProgress;
    window.nextSetupStep = nextSetupStep;
    window.prevSetupStep = prevSetupStep;
    window.selectOption = selectOption;
    window.toggleCrisis = toggleCrisis;
    window.toggleCategory = toggleCategory;
}
