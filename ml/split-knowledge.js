const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'ml', 'knowledge-rich.json');
const OUT = path.join(__dirname, '..', 'public', 'ml', 'knowledge');

const LEVELED_ARRAY_FIELDS = ['definitions', 'examples', 'misconceptions', 'how_to', 'why', 'scenarios'];
const LEVEL_KEYS = ['primary', 'high_school', 'university'];

function flattenArrayLevels(obj) {
  const merged = [];
  for (const level of LEVEL_KEYS) {
    if (Array.isArray(obj[level])) merged.push(...obj[level]);
  }
  return merged;
}

function processStandardTopic(topic) {
  const out = { ...topic };
  for (const field of LEVELED_ARRAY_FIELDS) {
    const v = out[field];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[field] = flattenArrayLevels(v);
    }
  }
  return out;
}

function processComparisons(topic) {
  const out = {};
  for (const key in topic) {
    const item = topic[key];
    if (item && typeof item === 'object' &&
        (item.primary || item.high_school || item.university)) {
      const merged = { english: '', sesotho: '' };
      for (const level of LEVEL_KEYS) {
        if (item[level]) {
          if (item[level].english) merged.english += (merged.english ? ' ' : '') + item[level].english;
          if (item[level].sesotho) merged.sesotho += (merged.sesotho ? ' ' : '') + item[level].sesotho;
        }
      }
      out[key] = merged;
    } else {
      out[key] = item;
    }
  }
  return out;
}

const raw = JSON.parse(fs.readFileSync(SRC, 'utf-8'));

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const topics = Object.keys(raw);
for (const topicId of topics) {
  let data;
  if (topicId === 'comparisons') data = processComparisons(raw[topicId]);
  else if (topicId === 'learning_paths' || topicId === 'emergency_scenarios') data = raw[topicId];
  else data = processStandardTopic(raw[topicId]);

  const filePath = path.join(OUT, topicId + '.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Wrote', topicId + '.json');
}

console.log('\nDone. Split into', topics.length, 'files.');