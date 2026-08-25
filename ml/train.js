const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'training-data.json'), 'utf-8')
);

const wordToIntent = {};

data.forEach((item) => {
  const words = item.text.toLowerCase().split(' ');
  words.forEach((word) => {
    if (!wordToIntent[word]) {
      wordToIntent[word] = {};
    }
    wordToIntent[word][item.intent] = (wordToIntent[word][item.intent] || 0) + 1;
  });
});

fs.writeFileSync(
  path.join(__dirname, 'trained-model.json'),
  JSON.stringify(wordToIntent, null, 2)
);

console.log('Model trained!');
console.log('Training examples:', data.length);