const fs = require('fs');
const path = require('path');

const TRAINING = path.join(__dirname, 'training-data.json');
const NEW = path.join(__dirname, 'new-greetings.json');

const existing = JSON.parse(fs.readFileSync(TRAINING, 'utf-8'));
const fresh = JSON.parse(fs.readFileSync(NEW, 'utf-8'));

const seen = new Set(existing.map(e => (e.text || '').toLowerCase()));
let added = 0;

for (const item of fresh) {
  const key = item.text.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  existing.push(item);
  added++;
}

fs.writeFileSync(TRAINING, JSON.stringify(existing, null, 2));
console.log('Added', added, 'new examples. Total:', existing.length);