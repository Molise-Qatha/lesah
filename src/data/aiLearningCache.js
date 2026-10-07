// ============================================================
//  LeSAH · AI Learning Cache
//  Caches Gemini/Mistral/Cloudflare answers in localStorage.
//  When a similar question comes again, the cached answer is
//  returned instantly — no network, no quota consumed.
//
//  This is NOT training. It is retrieval of past good answers.
//  The knowledge base in public/ml/knowledge/*.json stays curated
//  by a human. This cache is a runtime speed layer only.
// ============================================================

const CACHE_KEY = 'lesah_ai_cache';
const CACHE_MAX = 200;
const CACHE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ---------- Normalisation ----------

function normalise(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(function (w) { return w.length > 2; })
    .sort();
}

// Similarity: Jaccard on word sets.
// "what is saving?" vs "saving what is" → 1.0
// "what is saving?" vs "how to save money" → ~0.33
function similarity(a, b) {
  const setA = new Set(normalise(a));
  const setB = new Set(normalise(b));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersect = 0;
  setA.forEach(function (w) {
    if (setB.has(w)) intersect++;
  });

  const union = new Set([...setA, ...setB]).size;
  return intersect / union;
}

// ---------- Storage ----------

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    const now = Date.now();
    return data.filter(function (e) {
      return e && e.ts && (now - e.ts) < CACHE_EXPIRY_MS;
    });
  } catch (e) {
    return [];
  }
}

function saveCache(cache) {
  try {
    const trimmed = cache
      .sort(function (a, b) { return b.ts - a.ts; })
      .slice(0, CACHE_MAX);
    localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    // storage full — drop half the oldest entries and try again
    try {
      const trimmed = cache
        .sort(function (a, b) { return b.ts - a.ts; })
        .slice(0, Math.floor(CACHE_MAX / 2));
      localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
    } catch (e2) {
      // give up
    }
  }
}

// ---------- Public API ----------

const SIMILARITY_THRESHOLD = 0.75;

export function findCachedAnswer(question) {
  if (!question) return null;
  const cache = loadCache();

  let best = null;
  let bestScore = 0;

  for (const entry of cache) {
    const score = similarity(question, entry.q);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore >= SIMILARITY_THRESHOLD) {
    console.log('[AI cache] Hit (score ' + bestScore.toFixed(2) + '):', best.q);
    return best.a;
  }

  return null;
}

export function storeCachedAnswer(question, answer) {
  if (!question || !answer) return;
  if (answer.length < 20) return;
  if (answer.length > 2000) return;
  if (answer.indexOf('(Answer was cut short') !== -1) return;
  if (answer.indexOf('I understand your question') !== -1) return;

  const cache = loadCache();

  const existing = cache.findIndex(function (e) {
    return similarity(e.q, question) >= SIMILARITY_THRESHOLD;
  });
  if (existing >= 0) {
    cache[existing].ts = Date.now();
    cache[existing].a = answer;
    saveCache(cache);
    return;
  }

  cache.push({ q: question, a: answer, ts: Date.now() });
  saveCache(cache);
}

export function clearAICache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {}
}

export function getAICacheStats() {
  const cache = loadCache();
  return {
    count: cache.length,
    oldest: cache.length > 0 ? new Date(Math.min.apply(null, cache.map(function (e) { return e.ts; }))) : null,
    newest: cache.length > 0 ? new Date(Math.max.apply(null, cache.map(function (e) { return e.ts; }))) : null,
  };
}