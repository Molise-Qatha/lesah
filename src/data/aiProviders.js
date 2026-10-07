// ============================================================
//  LeSAH · External AI Provider (Google Gemini)
//  Model fallback chain + Lesotho Sesotho dialect hint
//  Full response handling with finish-reason logging
// ============================================================

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY || '';

const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

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

const SESOTHO_MARKERS = /\b(ke|eng|ho|boloka|chelete|phaello|kalimo|joang|lumela|bokae|nka|batla|hloka|fumana|tseba|rata|hobaneng|nthuse|thusang|bala|reka|rekisa|sebelisa|alima|boloke|poloko|keno|mokitlane|sekoloto|moputso|tekanyetso|litlhoko|litakatso|banka|akhaonto|mphe|ntefe|hangata|lula|ntate|ausi|abuti)\b/i;

function looksLikeSesotho(text) {
  if (!text) return false;
  if (SESOTHO_MARKERS.test(text)) return true;
  const apostrophes = (text.match(/'/g) || []).length;
  return apostrophes >= 2;
}

function buildSystemPrompt(isSesotho) {
  return isSesotho ? BASE_PROMPT + SESOTHO_HINT : BASE_PROMPT;
}

async function tryGeminiModel(model, question, history) {
  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const isSesotho = looksLikeSesotho(question);

  const res = await fetch(url, {
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
  });

  if (!res.ok) {
    const errText = await res.text();
    const err = new Error(`${model} → ${res.status}: ${errText.slice(0, 160)}`);
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

  if (finishReason === 'SAFETY') {
    console.warn('[AI] Response blocked by safety filter');
    return null;
  }

  if (!text) {
    console.warn(`[AI] ${model} returned no text. Reason: ${finishReason || 'unknown'}`);
    return null;
  }

  const trimmed = text.trim();

  // Detect obviously-truncated responses and append a hint
  const looksCutOff = /[,:;]$/.test(trimmed) ||
                      /\b(like|such as|for example|e\.g\.|and|or|but|the|a|an|of|to)$/i.test(trimmed);

  if (finishReason === 'MAX_TOKENS' || looksCutOff) {
    console.warn(`[AI] ${model} response looks truncated: "${trimmed.slice(-40)}"`);
    return trimmed + '\n\n_(Answer was cut short — ask again for the full response.)_';
  }

  return trimmed;
}

async function callGemini(question, history) {
  if (!GEMINI_API_KEY) throw new Error('Gemini key missing');

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
      if (err.status === 400 || err.status === 401 || err.status === 403) {
        throw err;
      }
      console.warn(`[AI] ${model} failed (${err.status || 'unknown'}), trying next…`);
    }
  }

  throw lastErr || new Error('All Gemini models failed');
}

export async function callExternalAI(question, history = []) {
  try {
    const answer = await callGemini(question, history);
    if (answer) {
      console.log('[AI] Answered by Gemini');
      return answer;
    }
  } catch (err) {
    console.warn('[AI] Gemini failed:', err.message);
  }
  return null;
}

export function hasExternalAI() {
  return Boolean(GEMINI_API_KEY);
}