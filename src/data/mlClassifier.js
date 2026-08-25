// ML Intent Classifier for LeSAH Financial Literacy
// Loads the trained model and knowledge base

let trainedModel = null;
let knowledgeBase = null;

// Load ML model
export const loadMLModel = async () => {
  if (trainedModel) return trainedModel;
  try {
    const response = await fetch('/ml/trained-model.json');
    trainedModel = await response.json();
    return trainedModel;
  } catch (error) {
    console.warn('Could not load ML model');
    return null;
  }
};

// Load knowledge base
export const loadKnowledgeBase = async () => {
  if (knowledgeBase) return knowledgeBase;
  try {
    const response = await fetch('/ml/knowledge-rich.json');
    knowledgeBase = await response.json();
    return knowledgeBase;
  } catch (error) {
    console.warn('Could not load knowledge base');
    return null;
  }
};

// Stop words for classification
const STOP_WORDS = [
  'what', 'is', 'are', 'the', 'a', 'an', 'to', 'do', 'does', 'how',
  'can', 'i', 'you', 'we', 'they', 'it', 'of', 'in', 'on', 'at',
  'ke', 'eng', 'le', 'ka', 'ea', 'ho', 'na', 'se', 'e',
  'why', 'when', 'where', 'who', 'which', 'for', 'with', 'from'
];

// Sesotho words for auto-detection
const SESOTHO_WORDS = [
  'ke', 'eng', 'ho', 'boloka', 'chelete', 'phaello', 'kalimo', 'joang',
  'lumela', 'bokae', 'le', 'ka', 'ea', 'na', 'nka', 'batla', 'hloka',
  'fumana', 'tseba', 'rata', 'kena', 'jwang', 'mme', 'hobaneng',
  'nthuse', 'thusang', 'bala', 'reka', 'rekisa', 'sebedisa', 'alima',
  'boloke', 'poloko', 'keno', 'mokitlane', 'sekoloto', 'moputso',
  'tekanyetso', 'ditlhoko', 'ditakatso', 'dibanka', 'banka', 'akhaonto'
];

// Classify topic using ML model
function classifyTopic(text) {
  if (!trainedModel) return { topic: 'unknown', confidence: 0 };
  
  const words = text.toLowerCase().split(' ');
  const scores = {};
  let matched = 0;

  words.forEach(function(word) {
    if (STOP_WORDS.indexOf(word) !== -1) return;
    if (trainedModel[word]) {
      matched++;
      Object.keys(trainedModel[word]).forEach(function(intent) {
        scores[intent] = (scores[intent] || 0) + trainedModel[word][intent];
      });
    }
  });

  let bestIntent = 'unknown';
  let bestScore = 0;

  Object.keys(scores).forEach(function(intent) {
    if (scores[intent] > bestScore) {
      bestScore = scores[intent];
      bestIntent = intent;
    }
  });

  return { topic: bestIntent, confidence: matched > 0 ? Math.min(0.95, bestScore / 20) : 0 };
}

// Detect language — FIXED: balanced scoring, requires strong Sesotho signal
function detectLanguage(question, explicitLanguage) {
  // Respect explicit language selection
  if (explicitLanguage === 'sesotho') return 'sesotho';
  if (explicitLanguage === 'english') return 'english';
  
  // Auto-detect from question content
  const words = question.toLowerCase().split(' ');
  let sesothoScore = 0;
  let englishScore = 0;
  
  words.forEach(function(word) {
    if (SESOTHO_WORDS.indexOf(word) !== -1) {
      sesothoScore += 2;
    } else if (STOP_WORDS.indexOf(word) === -1 && /^[a-z]+$/.test(word) && word.length > 2) {
      englishScore += 1;
    }
  });
  
  // Require Sesotho score to be clearly dominant
  if (sesothoScore >= 4 && sesothoScore > englishScore * 2) {
    return 'sesotho';
  }
  
  return 'english';
}

// Get grade level
function getLevel(gradeId) {
  if (gradeId && gradeId.indexOf('uni_') === 0) return 'university';
  const num = parseInt(gradeId ? gradeId.replace('grade', '') : '1') || 1;
  if (num <= 3) return 'primary';
  if (num <= 9) return 'high_school';
  return 'university';
}

// Extract text from bilingual object
function getText(item, lang) {
  if (!item) return null;
  if (typeof item === 'string') return item;
  if (lang === 'sesotho' && item.sesotho) return item.sesotho;
  if (item.english) return item.english;
  return null;
}

// Pick random from array
function getRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

// Extract amount from question — FIXED: more patterns
function extractAmount(question) {
  const patterns = [
    /m\s*(\d+)/i,
    /(\d+)\s*maloti/i,
    /(\d+)\s*loti/i,
    /(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = question.match(pattern);
    if (match) {
      const amount = parseInt(match[1]);
      if (amount >= 1 && amount <= 100000) {
        return amount;
      }
    }
  }
  return null;
}

// Personalize saving advice — FIXED: simpler and more direct
function personalizeSavingAdvice(amount, lang, level) {
  if (!amount) return null;
  
  const saveAmount = Math.round(amount * 0.2);
  const spendAmount = amount - saveAmount;
  
  if (lang === 'sesotho') {
    return `U na le M${amount}. Boloka M${saveAmount} (20%) 'me u sebelise M${spendAmount}.`;
  } else {
    return `You have M${amount}. Save M${saveAmount} (20%) and use M${spendAmount}.`;
  }
}

// Personalize budgeting advice
function personalizeBudgetAdvice(amount, lang, level) {
  if (!amount) return null;
  
  const needs = Math.round(amount * 0.5);
  const wants = Math.round(amount * 0.3);
  const savings = Math.round(amount * 0.2);
  
  if (lang === 'sesotho') {
    return `U na le M${amount}. Arola: 50% litlhoko (M${needs}), 30% litakatso (M${wants}), 20% poloko (M${savings}).`;
  } else {
    return `You have M${amount}. Split: 50% needs (M${needs}), 30% wants (M${wants}), 20% savings (M${savings}).`;
  }
}

// Main reasoning function
export function getAIResponse(question, gradeId, language) {
  if (!trainedModel || !knowledgeBase) {
    return language === 'sesotho' 
      ? 'AI e ntse e qala. Ka kopo leka hape.' 
      : 'AI is still loading. Please try again.';
  }

  const amount = extractAmount(question);
  const result = classifyTopic(question);
  const level = getLevel(gradeId);
  const lang = detectLanguage(question, language);

  // Fallback topic detection from keywords
  let topicId = result.topic;
  if (topicId === 'unknown' || result.confidence < 0.1) {
    const q = question.toLowerCase();
    if (/bolok|save|saving|poloko/.test(q)) topicId = 'saving';
    else if (/chelete|money|maloti|lisente/.test(q)) topicId = 'money';
    else if (/tekanyetso|budget|moralo/.test(q)) topicId = 'budgeting';
    else if (/phaello|interest|tswala/.test(q)) topicId = 'interest';
    else if (/kalimo|loan|sekoloto|alima|borrow/.test(q)) topicId = 'loans';
    else if (/moputso|income|fumana|earn/.test(q)) topicId = 'income';
    else if (/banka|bank|akhaonto|deposit|withdraw/.test(q)) topicId = 'banking';
    else if (/tlhoko|takatso|need|want/.test(q)) topicId = 'needs_wants';
    else if (/lumela|hello|hi|dumela/.test(q)) topicId = 'greeting';
  }

  const topicData = knowledgeBase[topicId];
  if (!topicData) {
    return lang === 'sesotho' 
      ? 'Ke utloisisa potso ea hau. Na u botsa ka ho boloka, tekanyetso, kapa chelete?' 
      : 'I understand your question. Are you asking about saving, budgeting, or money?';
  }

  // Detect intent
  let intent = 'definition';
  if (/how do|how can|how to|how should|how does|joang|kamoo|jwang/i.test(question)) intent = 'how_to';
  else if (/why|hobaneng|ke hobane/i.test(question)) intent = 'why';
  else if (/should|advice|recommend|keletso|nka etsa eng/i.test(question)) intent = 'advice';

  // PERSONALIZATION: Check FIRST for amount-based responses
  if (amount && topicId === 'saving') {
    const personalized = personalizeSavingAdvice(amount, lang, level);
    if (personalized) {
      return personalized;
    }
  }

  if (amount && topicId === 'budgeting') {
    const personalized = personalizeBudgetAdvice(amount, lang, level);
    if (personalized) {
      return personalized;
    }
  }

  let answer = '';

  // Standard responses
  if (intent === 'how_to' && topicData.how_to && topicData.how_to[level]) {
    const item = getRandom(topicData.how_to[level]);
    const text = getText(item, lang);
    if (text) answer = text;
  }

  if (!answer && intent === 'why' && topicData.why && topicData.why[level]) {
    const item = getRandom(topicData.why[level]);
    const text = getText(item, lang);
    if (text) answer = text;
  }

  if (!answer && intent === 'advice' && topicData.scenarios && topicData.scenarios[level]) {
    const scenario = getRandom(topicData.scenarios[level]);
    if (scenario) {
      const advice = getText(scenario.advice, lang);
      if (advice) answer = advice;
    }
  }

  if (!answer && topicData.definitions && topicData.definitions[level]) {
    const item = getRandom(topicData.definitions[level]);
    const text = getText(item, lang);
    if (text) answer = text;
  }

  // Add example with 50% probability (skip if amount was detected)
  if (!amount && topicData.examples && topicData.examples[level] && Math.random() < 0.5) {
    const item = getRandom(topicData.examples[level]);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + (lang === 'sesotho' ? 'Mohlala: ' : 'Example: ') + text;
    }
  }

  // Add misconception with 30% probability
  if (topicData.misconceptions && topicData.misconceptions[level] && Math.random() < 0.3) {
    const item = getRandom(topicData.misconceptions[level]);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + (lang === 'sesotho' ? 'Ntlha ea bohlokoa: ' : 'Important: ') + text;
    }
  }

  // Add follow-up with 40% probability
  if (topicData.follow_up_suggestions && Math.random() < 0.4) {
    const item = getRandom(topicData.follow_up_suggestions);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + text;
    }
  }

  return answer || (lang === 'sesotho' ? 'Ke utloisisa potso ea hau.' : 'I understand your question.');
}

// Initialize
loadMLModel();
loadKnowledgeBase();