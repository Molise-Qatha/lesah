// ============================================================
//  LeSAH · External AI Provider (Google Gemini)
//  Model fallback chain — tries each model in order until one works
//  Uses legacy generateContent endpoint (still supported for 3.x)
// ============================================================

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY || '';

// Fallback chain — tried in order.
// If one is overloaded (503) or missing (404), we move to the next.
const GEMINI_MODELS = [
  'gemini-3.8-flash',        // most capable, but most likely to be overloaded
  'gemini-3.5-flash',        // stable mid-tier
  'gemini-3.5-flash-lite',   // lighter, more available
  'gemini-3.1-flash-lite',   // lightest, most available
];

const SYSTEM_PROMPT = `You are a friendly financial literacy tutor for students in Lesotho, Southern Africa.
Rules:
- Keep answers SHORT (2-4 sentences max unless the user asks for detail).
- Use simple English (or Sesotho if the user writes in Sesotho).
- Reference "M" for Maloti (the Lesotho currency), not "$".
- Give practical advice suited to students with little money.
- Never promise profits or investments.
- Never ask for personal info.
- If the question is not about money, saving, budgeting, loans, banking, or personal finance, politely redirect.`;

// ---------- Single model attempt ----------
async function tryGeminiModel(model, question, history) {
  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 500,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    const err = new Error(`${model} → ${res.status}: ${errText.slice(0, 160)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? text.trim() : null;
}

// ---------- Fallback chain ----------
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
      // 404 = model doesn't exist / retired → try next
      // 503 = overloaded → try next
      // 429 = rate limited → try next (probably won't help, but no harm)
      // Other errors (400, 403) → key/config problem, no point retrying
      if (err.status === 400 || err.status === 401 || err.status === 403) {
        throw err;
      }
      console.warn(`[AI] ${model} failed (${err.status || 'unknown'}), trying next…`);
    }
  }

  throw lastErr || new Error('All Gemini models failed');
}

// ---------- Public API ----------
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