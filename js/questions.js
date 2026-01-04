/**
 * Questions Management - Ближе App
 * Загрузка и фильтрация вопросов
 */

// Questions Database
let questionsDB = [];

/**
 * Load questions from JSON file
 */
async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        if (response.ok) {
            const data = await response.json();
            questionsDB = data.questions;
            console.log(`Loaded ${questionsDB.length} questions from JSON`);
        } else {
            throw new Error('JSON not found');
        }
    } catch (error) {
        console.log('Using embedded questions (JSON not available)');
        questionsDB = getEmbeddedQuestions();
    }
}

/**
 * Filter questions based on session parameters
 * @returns {Array} Filtered questions
 */
function filterQuestions() {
    return questionsDB.filter(q => {
        // Exclude premium questions (for future)
        if (q.isPremium) return false;
        
        // Target filter
        if (q.target !== 'any' && q.target !== state.session.target) return false;
        
        // Stage filter (allow adjacent stages)
        if (q.stage !== 'any' && q.stage !== state.session.stage) {
            const stages = ['early', 'middle', 'long'];
            const qStageIdx = stages.indexOf(q.stage);
            const sStageIdx = stages.indexOf(state.session.stage);
            if (Math.abs(qStageIdx - sStageIdx) > 1) return false;
        }
        
        // Category filter
        if (!state.session.categories.includes('random')) {
            if (!state.session.categories.includes(q.category)) return false;
        }
        
        // Depth filter
        if (state.session.depth === 'easy' && q.depth !== 'easy') return false;
        if (state.session.depth === 'mixed' && q.depth === 'deep') return false;
        
        // Crisis filter
        if (state.session.crisis) {
            if (!q.isCrisisSuitable) return false;
            if (q.crisisAllowed && !q.crisisAllowed.includes(state.session.crisisLevel)) return false;
        }
        
        return true;
    });
}

/**
 * Select questions for session
 * @param {number} count - Number of questions to select
 * @returns {Array} Selected questions
 */
function selectSessionQuestions(count) {
    const filtered = filterQuestions();
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, count);
}

/**
 * Get question by ID
 * @param {number} id
 * @returns {Object|null}
 */
function getQuestionById(id) {
    return questionsDB.find(q => q.id === id) || null;
}

/**
 * Embedded questions fallback
 * @returns {Array}
 */
function getEmbeddedQuestions() {
    return [
        { id: 1, text: "Какой момент за последнюю неделю принёс тебе больше всего радости?", goal: "Замечать позитив в повседневности", hint: "Расскажи, что именно сделало этот момент особенным", category: "everyday", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 2, text: "Что из мелочей делает твой день лучше?", goal: "Узнать о маленьких радостях партнёра", hint: "Может это кофе, музыка, прогулка?", category: "everyday", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 3, text: "Если бы завтра был выходной без обязательств, чем бы ты хотел(а) заняться?", goal: "Понять потребности в отдыхе", hint: "Мечтайте вместе, не ограничивайте фантазию", category: "everyday", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 4, text: "За что ты благодарен(на) сегодня?", goal: "Практика благодарности", hint: "Можно начать с самого простого", category: "everyday", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 5, text: "Какая песня отражает твоё настроение сегодня?", goal: "Творческий способ поделиться эмоциями", hint: "Можно включить и послушать вместе", category: "everyday", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 6, text: "Как я могу поддержать тебя прямо сейчас?", goal: "Научиться спрашивать о потребностях", hint: "Иногда нужны слова, иногда — объятия, иногда — тишина", category: "feelings_support", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 7, text: "Когда в последний раз ты чувствовал(а), что я тебя по-настоящему понимаю?", goal: "Найти моменты подлинного контакта", hint: "Опишите, что именно создало это ощущение", category: "feelings_support", target: "any", depth: "medium", stage: "middle", isCrisisSuitable: true, crisisAllowed: ["low", "medium"], isPremium: false },
        { id: 8, text: "Что помогает тебе успокоиться, когда ты переживаешь?", goal: "Узнать способы саморегуляции партнёра", hint: "Запомни это — сможешь помочь в будущем", category: "feelings_support", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 9, text: "Какие слова от меня для тебя особенно важны?", goal: "Найти язык любви партнёра", hint: "Это могут быть слова поддержки, благодарности, восхищения", category: "feelings_support", target: "couple", depth: "medium", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium"], isPremium: false },
        { id: 10, text: "Есть ли что-то, о чём тебе сложно со мной говорить?", goal: "Создать пространство для уязвимости", hint: "Выслушай без осуждения, поблагодари за честность", triggerWarning: "Ответ может быть неожиданным. Будьте готовы слушать без защитной реакции", category: "feelings_support", target: "any", depth: "deep", stage: "middle", isCrisisSuitable: false, crisisAllowed: ["low"], isPremium: false },
        { id: 11, text: "Какие мои слова или действия дают тебе ощущение безопасности?", goal: "Укрепить чувство защищённости", hint: "Это поможет понять, как создавать доверие", category: "feelings_support", target: "any", depth: "medium", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 12, text: "Какое твоё самое тёплое воспоминание из детства?", goal: "Узнать историю партнёра", hint: "Попроси рассказать детали — запахи, звуки, ощущения", category: "past_childhood", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 13, text: "Кто из взрослых в детстве дал тебе ощущение, что ты важен(на)?", goal: "Понять источники самоценности", hint: "Что именно делал этот человек?", category: "past_childhood", target: "any", depth: "medium", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium"], isPremium: false },
        { id: 14, text: "Какой урок из детства ты хотел бы передать дальше?", goal: "Ценности и опыт", hint: "Как этот урок влияет на тебя сегодня?", category: "past_childhood", target: "any", depth: "medium", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium"], isPremium: false },
        { id: 15, text: "Какое воспоминание о нас двоих ты хранишь как особенное?", goal: "Укрепить общую историю", hint: "Расскажите, почему именно это воспоминание", category: "past_childhood", target: "any", depth: "easy", stage: "middle", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 16, text: "Чего тебе не хватало в детстве, что ты хочешь дать себе сейчас?", goal: "Осознать незакрытые потребности", hint: "Будьте бережны — это может быть чувствительная тема", triggerWarning: "Вопрос может затронуть болезненные воспоминания", category: "past_childhood", target: "any", depth: "deep", stage: "long", isCrisisSuitable: false, crisisAllowed: ["low"], isPremium: false },
        { id: 17, text: "О чём ты мечтаешь в последнее время?", goal: "Узнать стремления партнёра", hint: "Не оценивай, просто интересуйся", category: "dreams_plans", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 18, text: "Какое совместное приключение ты хотел(а) бы пережить с нами?", goal: "Планировать общее будущее", hint: "Можно пофантазировать без ограничений", category: "dreams_plans", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 19, text: "Если бы ты мог(ла) освоить любой навык мгновенно, что бы это было?", goal: "Понять скрытые интересы", hint: "Почему именно это?", category: "dreams_plans", target: "any", depth: "easy", stage: "any", isCrisisSuitable: true, crisisAllowed: ["low", "medium", "high"], isPremium: false },
        { id: 20, text: "Как ты видишь нашу жизнь через 5 лет?", goal: "Сверить видение будущего", hint: "Говорите о желаниях, не о страхах", category: "dreams_plans", target: "any", depth: "medium", stage: "middle", isCrisisSuitable: true, crisisAllowed: ["low", "medium"], isPremium: false }
    ];
}

// Export
if (typeof window !== 'undefined') {
    window.questionsDB = questionsDB;
    window.loadQuestions = loadQuestions;
    window.filterQuestions = filterQuestions;
    window.selectSessionQuestions = selectSessionQuestions;
    window.getQuestionById = getQuestionById;
    window.getEmbeddedQuestions = getEmbeddedQuestions;
}
