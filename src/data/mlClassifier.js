// ML Intent Classifier for LeSAH Financial Literacy
// Loads trained model + per-topic knowledge files

let trainedModel = null;
let knowledgeBase = null;

const TOPIC_FILES = [
  'saving', 'money', 'budgeting', 'interest', 'loans', 'income',
  'banking', 'needs_wants', 'greeting', 'comparisons',
  'learning_paths', 'emergency_scenarios'
];

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

export const loadKnowledgeBase = async () => {
  if (knowledgeBase) return knowledgeBase;
  try {
    const responses = await Promise.all(
      TOPIC_FILES.map(function (t) { return fetch('/ml/knowledge/' + t + '.json'); })
    );
    const data = await Promise.all(responses.map(function (r) { return r.json(); }));
    const merged = {};
    TOPIC_FILES.forEach(function (t, i) { merged[t] = data[i]; });
    knowledgeBase = merged;
    return knowledgeBase;
  } catch (error) {
    console.warn('Could not load knowledge base', error);
    return null;
  }
};

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

const STOP_WORDS = [
  'what', 'is', 'are', 'the', 'a', 'an', 'to', 'do', 'does', 'how',
  'can', 'i', 'you', 'we', 'they', 'it', 'of', 'in', 'on', 'at',
  'ke', 'eng', 'le', 'ka', 'ea', 'ho', 'na', 'se', 'e',
  'why', 'when', 'where', 'who', 'which', 'for', 'with', 'from'
];

const SESOTHO_WORDS = [
  'ke', 'eng', 'ho', 'boloka', 'chelete', 'phaello', 'kalimo', 'joang',
  'lumela', 'bokae', 'le', 'ka', 'ea', 'na', 'nka', 'batla', 'hloka',
  'fumana', 'tseba', 'rata', 'kena', 'jwang', 'mme', 'hobaneng',
  'nthuse', 'thusang', 'bala', 'reka', 'rekisa', 'sebedisa', 'alima',
  'boloke', 'poloko', 'keno', 'mokitlane', 'sekoloto', 'moputso',
  'tekanyetso', 'ditlhoko', 'ditakatso', 'dibanka', 'banka', 'akhaonto'
];

function classifyTopic(text) {
  if (!trainedModel) return { topic: 'unknown', confidence: 0 };

  const words = tokenize(text);
  const scores = {};
  let matched = 0;

  words.forEach(function (word) {
    if (STOP_WORDS.indexOf(word) !== -1) return;
    if (trainedModel[word]) {
      matched++;
      Object.keys(trainedModel[word]).forEach(function (intent) {
        scores[intent] = (scores[intent] || 0) + trainedModel[word][intent];
      });
    }
  });

  let bestIntent = 'unknown';
  let bestScore = 0;

  Object.keys(scores).forEach(function (intent) {
    if (scores[intent] > bestScore) {
      bestScore = scores[intent];
      bestIntent = intent;
    }
  });

  return { topic: bestIntent, confidence: matched > 0 ? Math.min(0.95, bestScore / 20) : 0 };
}

function detectLanguage(question, explicitLanguage) {
  if (explicitLanguage === 'sesotho') return 'sesotho';
  if (explicitLanguage === 'english') return 'english';

  const words = tokenize(question);
  let sesothoScore = 0;
  let englishScore = 0;

  words.forEach(function (word) {
    if (SESOTHO_WORDS.indexOf(word) !== -1) {
      sesothoScore += 2;
    } else if (STOP_WORDS.indexOf(word) === -1 && /^[a-z]+$/.test(word) && word.length > 2) {
      englishScore += 1;
    }
  });

  if (sesothoScore >= 4 && sesothoScore > englishScore * 2) {
    return 'sesotho';
  }
  return 'english';
}

function getText(item, lang) {
  if (!item) return null;
  if (typeof item === 'string') return item;
  if (lang === 'sesotho' && item.sesotho) return item.sesotho;
  if (item.english) return item.english;
  return null;
}

function getRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

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

function personalizeSavingAdvice(amount, lang) {
  if (!amount) return null;
  const saveAmount = Math.round(amount * 0.2);
  const spendAmount = amount - saveAmount;

  if (lang === 'sesotho') {
    return `U na le M${amount}. Boloka M${saveAmount} (20%) 'me u sebelise M${spendAmount}.`;
  }
  return `You have M${amount}. Save M${saveAmount} (20%) and use M${spendAmount}.`;
}

function personalizeBudgetAdvice(amount, lang) {
  if (!amount) return null;
  const needs = Math.round(amount * 0.5);
  const wants = Math.round(amount * 0.3);
  const savings = Math.round(amount * 0.2);

  if (lang === 'sesotho') {
    return `U na le M${amount}. Arola: 50% litlhoko (M${needs}), 30% litakatso (M${wants}), 20% poloko (M${savings}).`;
  }
  return `You have M${amount}. Split: 50% needs (M${needs}), 30% wants (M${wants}), 20% savings (M${savings}).`;
}

export function getAIResponse(question, language) {
  if (!trainedModel || !knowledgeBase) {
    return language === 'sesotho'
      ? 'AI e ntse e qala. Ka kopo leka hape.'
      : 'AI is still loading. Please try again.';
  }

  const amount = extractAmount(question);
  const result = classifyTopic(question);
  const lang = detectLanguage(question, language);

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

  let intent = 'definition';
  if (/how do|how can|how to|how should|how does|joang|kamoo|jwang/i.test(question)) intent = 'how_to';
  else if (/why|hobaneng|ke hobane/i.test(question)) intent = 'why';
  else if (/should|advice|recommend|keletso|nka etsa eng/i.test(question)) intent = 'advice';

  if (amount && topicId === 'saving') {
    const personalized = personalizeSavingAdvice(amount, lang);
    if (personalized) return personalized;
  }

  if (amount && topicId === 'budgeting') {
    const personalized = personalizeBudgetAdvice(amount, lang);
    if (personalized) return personalized;
  }

  let answer = '';

  if (intent === 'how_to' && topicData.how_to && topicData.how_to.length) {
    const text = getText(getRandom(topicData.how_to), lang);
    if (text) answer = text;
  }

  if (!answer && intent === 'why' && topicData.why && topicData.why.length) {
    const text = getText(getRandom(topicData.why), lang);
    if (text) answer = text;
  }

  if (!answer && intent === 'advice' && topicData.scenarios && topicData.scenarios.length) {
    const scenario = getRandom(topicData.scenarios);
    if (scenario) {
      const advice = getText(scenario.advice, lang);
      if (advice) answer = advice;
    }
  }

  if (!answer && topicData.definitions && topicData.definitions.length) {
    const text = getText(getRandom(topicData.definitions), lang);
    if (text) answer = text;
  }

  if (!amount && topicData.examples && topicData.examples.length && Math.random() < 0.5) {
    const text = getText(getRandom(topicData.examples), lang);
    if (text) {
      answer += '\n\n' + (lang === 'sesotho' ? 'Mohlala: ' : 'Example: ') + text;
    }
  }

  if (topicData.misconceptions && topicData.misconceptions.length && Math.random() < 0.3) {
    const text = getText(getRandom(topicData.misconceptions), lang);
    if (text) {
      answer += '\n\n' + (lang === 'sesotho' ? 'Ntlha ea bohlokoa: ' : 'Important: ') + text;
    }
  }

  if (topicData.follow_up_suggestions && topicData.follow_up_suggestions.length && Math.random() < 0.4) {
    const text = getText(getRandom(topicData.follow_up_suggestions), lang);
    if (text) {
      answer += '\n\n' + text;
    }
  }

  return answer || (lang === 'sesotho' ? 'Ke utloisisa potso ea hau.' : 'I understand your question.');
}

loadMLModel();
loadKnowledgeBase();