const fs = require('fs');
const path = require('path');

const model = JSON.parse(fs.readFileSync(path.join(__dirname, 'trained-model.json'), 'utf-8'));
const knowledge = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledge-rich.json'), 'utf-8'));

const STOP_WORDS = [
  'what', 'is', 'are', 'the', 'a', 'an', 'to', 'do', 'does', 'how',
  'can', 'i', 'you', 'we', 'they', 'it', 'of', 'in', 'on', 'at',
  'ke', 'eng', 'le', 'ka', 'ea', 'ho', 'na', 'se', 'e',
  'why', 'when', 'where', 'who', 'which', 'for', 'with', 'from'
];

const SESOTHO_WORDS = ['ke', 'eng', 'ho', 'boloka', 'chelete', 'phaello', 'kalimo', 'joang', 'lumela', 'bokae', 'le', 'ka', 'ea', 'na', 'nka', 'batla', 'hloka', 'fumana', 'tseba', 'rata'];

function classify(text) {
  const words = text.toLowerCase().split(' ');
  const scores = {};
  let matched = 0;

  words.forEach(function(word) {
    if (STOP_WORDS.indexOf(word) !== -1) return;
    if (model[word]) {
      matched++;
      Object.keys(model[word]).forEach(function(intent) {
        scores[intent] = (scores[intent] || 0) + model[word][intent];
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

function getLevel(gradeId) {
  if (gradeId.indexOf('uni_') === 0) return 'university';
  const num = parseInt(gradeId.replace('grade', '')) || 1;
  if (num <= 3) return 'primary';
  if (num <= 9) return 'high_school';
  return 'university';
}

function detectLanguage(question, explicitLanguage) {
  if (explicitLanguage === 'sesotho') return 'sesotho';
  if (explicitLanguage === 'english') return 'english';
  
  const words = question.toLowerCase().split(' ');
  let sesothoScore = 0;
  
  words.forEach(function(word) {
    if (SESOTHO_WORDS.indexOf(word) !== -1) sesothoScore++;
  });
  
  return sesothoScore > 0 ? 'sesotho' : 'english';
}

// CRITICAL FIX: Extract the correct language text from bilingual object
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

function reason(question, gradeId, language) {
  const result = classify(question);
  const level = getLevel(gradeId);
  const lang = detectLanguage(question, language);

  const topicData = knowledge[result.topic];
  if (!topicData) {
    return lang === 'sesotho' ? 'Ke utloisisa potso ea hau.' : 'I understand your question.';
  }

  const definitions = topicData.definitions && topicData.definitions[level];
  const examples = topicData.examples && topicData.examples[level];
  const misconceptions = topicData.misconceptions && topicData.misconceptions[level];
  const followUps = topicData.follow_up_suggestions;

  let answer = '';

  // Get definition text
  if (definitions && definitions.length > 0) {
    const item = getRandom(definitions);
    const text = getText(item, lang);
    if (text) answer += text;
  }

  // Get example text
  if (examples && examples.length > 0 && Math.random() < 0.6) {
    const item = getRandom(examples);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + (lang === 'sesotho' ? 'Mohlala: ' : 'Example: ') + text;
    }
  }

  // Get misconception text
  if (misconceptions && misconceptions.length > 0 && Math.random() < 0.3) {
    const item = getRandom(misconceptions);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + (lang === 'sesotho' ? 'Ntlha ea bohlokoa: ' : 'Important: ') + text;
    }
  }

  // Get follow-up text
  if (followUps && followUps.length > 0 && Math.random() < 0.4) {
    const item = getRandom(followUps);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + text;
    }
  }

  return answer || (lang === 'sesotho' ? 'Ke utloisisa potso ea hau.' : 'I understand your question.');
}

const tests = [
  { q: 'what is saving', grade: 'grade1', lang: 'english' },
  { q: 'what is saving', grade: 'grade1', lang: 'english' },
  { q: 'how can i save money', grade: 'grade4', lang: 'english' },
  { q: 'what is interest', grade: 'grade8', lang: 'english' },
  { q: 'what is a loan', grade: 'grade10', lang: 'english' },
  { q: 'ho boloka ke eng', grade: 'grade1', lang: 'sesotho' },
  { q: 'chelete ke eng', grade: 'grade1', lang: 'sesotho' },
  { q: 'lumela', grade: 'grade1', lang: 'sesotho' }
];

console.log('=== Testing Reasoning Engine ===');
console.log('');
tests.forEach(function(t) {
  const answer = reason(t.q, t.grade, t.lang);
  console.log('Q: ' + t.q);
  console.log('A: ' + answer);
  console.log('---');
});