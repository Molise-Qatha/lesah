const fs = require('fs');
const path = require('path');

const TRAINING = path.join(__dirname, 'training-data.json');
const existing = JSON.parse(fs.readFileSync(TRAINING, 'utf-8'));
const seen = new Set(existing.map(e => (e.text || '').toLowerCase()));

const newFiles = fs.readdirSync(__dirname)
  .filter(f => f.startsWith('new-') && f.endsWith('.json'));

let totalAdded = 0;
for (const file of newFiles) {
  const items = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf-8'));
  let added = 0;
  for (const item of items) {
    const key = item.text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    existing.push(item);
    added++;
  }
  console.log(file + ': added ' + added);
  totalAdded += added;
}

fs.writeFileSync(TRAINING, JSON.stringify(existing, null, 2));
console.log('\nTotal new:', totalAdded);
console.log('Total examples now:', existing.length);