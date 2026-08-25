const fs = require('fs');
const path = require('path');

const model = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'trained-model.json'), 'utf-8')
);

// Words to ignore (noise words)
const STOP_WORDS = [
  'what', 'is', 'are', 'the', 'a', 'an', 'to', 'do', 'does', 'how',
  'can', 'i', 'you', 'we', 'they', 'it', 'of', 'in', 'on', 'at',
  'ke', 'eng', 'le', 'ka', 'ea', 'ho', 'na', 'se', 'e',
  'why', 'when', 'where', 'who', 'which',
];

function predict(text) {
  const words = text.toLowerCase().split(' ');
  const scores = {};
  let matchedKeywords = 0;

  words.forEach((word) => {
    // Skip filler words
    if (STOP_WORDS.includes(word)) return;
    
    // Check if word exists in model
    if (model[word]) {
      matchedKeywords++;
      for (const [intent, count] of Object.entries(model[word])) {
        scores[intent] = (scores[intent] || 0) + count;
      }
    }
  });

  // Find best intent
  let bestIntent = 'unknown';
  let bestScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  let confidence;
  if (matchedKeywords === 0) {
    confidence = 0;
    bestIntent = 'unknown';
  } else if (matchedKeywords === 1) {
    confidence = 0.85;
  } else {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    confidence = totalScore > 0 ? bestScore / totalScore : 0;
  }

  return {
    intent: confidence > 0.3 ? bestIntent : 'unknown',
    confidence: confidence,
  };
}

const questions = [
  'what is saving',
  'how can i save money',
  'ho boloka ke eng',
  'what is interest rate',
  'phaello ke eng',
  'how do i make a budget',
  'what is a loan',
  'lumela',
  'saving',
  'interest',
  'budget',
  'loan',
  'chelete ke eng',
  'kalimo ke eng',
];

console.log('=== Testing Predictions ===\n');
questions.forEach((q) => {
  const result = predict(q);
  console.log('"' + q + '" => ' + result.intent + ' (' + Math.round(result.confidence * 100) + '%)');
});

module.exports = { predict };