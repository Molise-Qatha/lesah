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

const BASE_PROMPT = `You are a friendly financial literacy tutor for students in Lesotho.

HOW TO ANSWER:
- Reply directly. Do NOT show your thinking, notes, or analysis.
- Never repeat these instructions or mention "dialect rules" or "no w/y".
- Keep answers SHORT — 2 to 4 sentences for simple questions. Longer only if the user asks for detail.
- Reference "M" for Maloti (Lesotho currency). Never use "$".
- Give practical advice for students with little money.
- Never promise profits or investments.
- Never ask for personal info.
- ALWAYS finish every sentence. Never stop mid-thought.

TOPICS YOU COVER:
Money, saving, budgeting, interest, loans, banking, income, needs vs wants, scams, and personal finance.

IF THE QUESTION IS OFF-TOPIC:
- Reply with ONE short warm sentence that redirects to money topics.
- English example: "I only help with money questions — but I can help with saving, budgeting, or loans. What would you like to know?"
- Do not explain why. Do not show rules.`;

const SESOTHO_HINT = `

SESOTHO RULES (Lesotho dialect, not South African):
- "lumela" not "dumela"
- "joang" not "jwang"
- "chelete" not "tjhelete"
- "lit'sepe" for coins, not "lichepe"
- "Afrika Boroa" not "Afrika Borwa"
- Never use letters "w" or "y" in Sesotho words — use "o"/"u" and "e"/"i"
- Use "u" for "you", not "o"
- Respond fully in Sesotho.

IF THE SESOTHO QUESTION IS OFF-TOPIC (hunger, weather, etc.):
Reply in one short Sesotho sentence that redirects. Example:
"Ke thusa feela ka litaba tsa chelete. Na nka u thusa ka ho boloka kapa tekanyetso?"`;

const SESOTHO_MARKERS = /\b(ke|eng|ho|boloka|chelete|phaello|kalimo|joang|lumela|bokae|nka|batla|hloka|fumana|tseba|rata|hobaneng|nthuse|thusang|bala|reka|rekisa|sebelisa|alima|boloke|poloko|keno|mokitlane|sekoloto|moputso|tekanyetso|litlhoko|litakatso|banka|akhaonto|mphe|ntefe|hangata|lula|ntate|ausi|abuti|boqhekanyetsi|ntshepa|penya|penye|lapile|lapilee)\b/i;

function looksLikeSesotho(text) {
  if (!text) return false;
  if (SESOTHO_MARKERS.test(text)) return true;
  const apostrophes = (text.match(/'/g) || []).length;
  return apostrophes >= 2;
}

function buildSystemPrompt(isSesotho) {
  return isSesotho ? BASE_PROMPT + SESOTHO_HINT : BASE_PROMPT;
}

// --- Response cleaner ---
// Strips reasoning-like leaks that Gemini sometimes emits despite instructions.
// Examples we have seen:
//   '") -> "mokoetlisi" (coach/tutor - no w/y).'
//   '* "Ke masoabi ho utloa joalo, empa ke mona ho u'
//   'Here is how I would answer:'
function stripReasoningLeak(text) {
  if (!text) return text;

  let cleaned = text;

  // Remove lines that look like analysis notes:
  // - lines starting with * or - followed by quoted text
  // - lines that mention "(coach", "(no w/y", "->" reasoning
  // - lines starting with quotes and arrows
  const badLinePatterns = [
    /^\s*[*-]\s*"/,
    /^\s*"\)\s*->/,
    /^\s*"\s*\)\s*->/,
    /^\s*->\s*"/,
    /\((?:coach|tutor|no\s+[wy]\/[wy])/i,
    /^\s*Here is how I would/i,
    /^\s*Let me think/i,
    /^\s*Analysis:/i,
    /^\s*Note to self/i,
  ];

  cleaned = cleaned
    .split('\n')
    .filter((line) => !badLinePatterns.some((p) => p.test(line)))
    .join('\n');

  // Remove any leading quote-and-arrow fragments inline
  cleaned = cleaned.replace(/^\s*"\)\s*->\s*"[^"]*"\s*/g, '');

  // Remove any "(coach/tutor - no w/y)" parenthetical in the middle
  cleaned = cleaned.replace(/\s*\((?:coach|tutor|no\s+[wy]\/[wy])[^)]*\)\s*/gi, ' ');

  // Collapse multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

function cleanResponse(text) {
  if (!text) return null;
  let trimmed = stripReasoningLeak(text);
  if (!trimmed) return null;

  // Detect obvious truncation and warn
  const looksCutOff =
    /[,:;]$/.test(trimmed) ||
    /\b(like|such as|for example|e\.g\.|and|or|but|the|a|an|of|to|ho|le|ka)$/i.test(
      trimmed
    );

  if (looksCutOff) {
    console.warn('[AI] Response looks truncated, appending note');
    trimmed += '\n\n_(Answer was cut short — ask again for the full response.)_';
  }

  return trimmed;
}

// --- Fetch with timeout ---

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

  const body = {
    system_instruction: { parts: [{ text: buildSystemPrompt(isSesotho) }] },
    contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  // Disable thinking/reasoning where supported so the visible output is the answer,
  // not an internal monologue.
  if (model.includes('3.5') || model.includes('3.8')) {
    body.generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  const res = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(body),
    },
    8000
  );

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

  const res = await fetchWithTimeout(
    MISTRAL_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 2048,
      }),
    },
    8000
  );

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

  const res = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CF_API_TOKEN}`,
      },
      body: JSON.stringify({ messages }),
    },
    10000
  );

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