// ============================================================
//  LeSAH · External AI Provider
//  Chain: Gemini (4 models) → Mistral → Cloudflare Workers AI
//  Each provider has a short timeout so a slow one cannot hang us
// ============================================================

// --- Gemini ---
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY || '';
const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

// --- Mistral ---
const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY || '';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-small-latest';

// --- Cloudflare Workers AI ---
const CF_ACCOUNT_ID = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.REACT_APP_CLOUDFLARE_API_TOKEN || '';
const CF_MODEL = '@cf/meta/llama-3.1-8b-instruct';

// --- Prompts ---

const BASE_PROMPT = `You are a friendly financial literacy tutor for students in Lesotho, Southern Africa.
Rules:
- Keep answers SHORT (2-4 sentences max unless the user asks for detail).
- Use simple English (or Sesotho if the user writes in Sesotho).
- Reference "M" for Maloti (the Lesotho currency), not "$".
- Give practical advice suited to students with little money.
- Never promise profits or investments.
- Never ask for personal info.
- If the question is not about money, saving, budgeting, loans, banking, or personal finance, politely redirect.
- ALWAYS finish your sentences. Never stop mid-thought.`;

const SESOTHO_HINT = `

SESOTHO — DIALECT RULES (CRITICAL):
The user is writing in Lesotho Sesotho, NOT South African Sesotho.
- Use "lumela" not "dumela"
- Use "joang" not "jwang"
- Use "chelete" not "tjhelete"
- Use "lit'sepe" for coins, not "lichepe"
- Use "Afrika Boroa" not "Afrika Borwa"
- Never use letters "w" or "y" in Sesotho words — replace with "o"/"u" and "e"/"i"
- Use "u" for "you" (subject and object), not "o"
- Respond fully in Sesotho, not mixed with English.`;

const SESOTHO_MARKERS = /\b(ke|eng|ho|boloka|chelete|phaello|kalimo|joang|lumela|bokae|nka|batla|hloka|fumana|tseba|rata|hobaneng|nthuse|thusang|bala|reka|rekisa|sebelisa|alima|boloke|poloko|keno|mokitlane|sekoloto|moputso|tekanyetso|litlhoko|litakatso|banka|akhaonto|mphe|ntefe|hangata|lula|ntate|ausi|abuti|boqhekanyetsi|ntshepa|penya|penye)\b/i;

function looksLikeSesotho(text) {
  if (!text) return false;
  if (SESOTHO_MARKERS.test(text)) return true;
  const apostrophes = (text.match(/'/g) || []).length;
  return apostrophes >= 2;
}

function buildSystemPrompt(isSesotho) {
  return isSesotho ? BASE_PROMPT + SESOTHO_HINT : BASE_PROMPT;
}

// --- Helpers ---

function cleanResponse(text) {
  if (!text) return null;
  const trimmed = text.trim();

  // Detect obvious truncation and warn
  const looksCutOff = /[,:;]$/.test(trimmed) ||
    /\b(like|such as|for example|e\.g\.|and|or|but|the|a|an|of|to)$/i.test(trimmed);

  if (looksCutOff) {
    console.warn('[AI] Response looks truncated, appending note');
    return trimmed + '\n\n_(Answer was cut short — ask again for the full response.)_';
  }
  return trimmed;
}

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(`timeout after ${ms / 1000}s`);
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
//  Gemini
// ============================================================

async function tryGeminiModel(model, question, history) {
  const isSesotho = looksLikeSesotho(question);

  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystemPrompt(isSesotho) }] },
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  }, 8000);

  if (!res.ok) {
    const errText = await res.text();
    const err = new Error(`${model} → ${res.status}: ${errText.slice(0, 140)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const finishReason = candidate?.finishReason;
  const text = candidate?.content?.parts?.[0]?.text;

  if (finishReason && finishReason !== 'STOP') {
    console.warn(`[AI] ${model} finishReason: ${finishReason}`);
  }
  if (finishReason === 'SAFETY') return null;

  return cleanResponse(text);
}

async function tryGemini(question, history) {
  let lastErr = null;
  for (const model of GEMINI_MODELS) {
    try {
      const answer = await tryGeminiModel(model, question, history);
      if (answer) {
        console.log(`[AI] Gemini answered via ${model}`);
        return answer;
      }
    } catch (err) {
      lastErr = err;
      if (err.status === 400 || err.status === 401 || err.status === 403) throw err;
      console.warn(`[AI] ${model} failed (${err.status || 'unknown'}), trying next…`);
    }
  }
  throw lastErr || new Error('All Gemini models failed');
}

// ============================================================
//  Mistral
// ============================================================

async function tryMistral(question, history) {
  const isSesotho = looksLikeSesotho(question);

  const messages = [
    { role: 'system', content: buildSystemPrompt(isSesotho) },
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.content,
    })),
    { role: 'user', content: question },
  ];

  const res = await fetchWithTimeout(MISTRAL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 1024,
    }),
  }, 8000);

  if (!res.ok) {
    const errText = await res.text();
    const err = new Error(`Mistral → ${res.status}: ${errText.slice(0, 140)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return cleanResponse(text);
}

// ============================================================
//  Cloudflare Workers AI
// ============================================================

async function tryCloudflare(question, history) {
  const isSesotho = looksLikeSesotho(question);

  const messages = [
    { role: 'system', content: buildSystemPrompt(isSesotho) },
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.content,
    })),
    { role: 'user', content: question },
  ];

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`;

  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CF_API_TOKEN}`,
    },
    body: JSON.stringify({ messages }),
  }, 10000);

  if (!res.ok) {
    const errText = await res.text();
    const err = new Error(`Cloudflare → ${res.status}: ${errText.slice(0, 140)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const text = data?.result?.response;
  return cleanResponse(text);
}

// ============================================================
//  Fallback chain
// ============================================================

async function callAI(question, history) {
  const providers = [];

  if (GEMINI_API_KEY) {
    providers.push({ name: 'Gemini', fn: () => tryGemini(question, history) });
  }
  if (MISTRAL_API_KEY) {
    providers.push({ name: 'Mistral', fn: () => tryMistral(question, history) });
  }
  if (CF_API_TOKEN && CF_ACCOUNT_ID) {
    providers.push({ name: 'Cloudflare', fn: () => tryCloudflare(question, history) });
  }

  if (providers.length === 0) {
    console.warn('[AI] No external providers configured');
    return null;
  }

  let lastErr = null;
  for (const provider of providers) {
    try {
      console.log(`[AI] Trying ${provider.name}...`);
      const answer = await provider.fn();
      if (answer) {
        console.log(`[AI] ${provider.name} answered successfully`);
        return answer;
      }
    } catch (err) {
      lastErr = err;
      console.warn(`[AI] ${provider.name} failed: ${err.message}`);
    }
  }

  throw lastErr || new Error('All AI providers failed');
}

// ============================================================
//  Public API
// ============================================================

export async function callExternalAI(question, history = []) {
  try {
    return await callAI(question, history);
  } catch (err) {
    console.warn('[AI] All external providers failed:', err.message);
    return null;
  }
}

export function hasExternalAI() {
  return Boolean(GEMINI_API_KEY || MISTRAL_API_KEY || (CF_API_TOKEN && CF_ACCOUNT_ID));
}