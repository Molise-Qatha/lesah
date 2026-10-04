// ============================================================
//  LeSAH · External AI Provider (Google Gemini)
//  Model: gemini-3.8-flash (GA, current as of 2026)
//  Legacy generateContent endpoint still supported for 3.x
//  Free tier: limited daily requests (verify in AI Studio)
// ============================================================

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY || '';

// Working models (generateContent endpoint):
//   gemini-3.8-flash        — GA, most capable Flash (current default)
//   gemini-3.5-flash-lite   — lighter, cheaper, more generous free tier
//   gemini-3.1-flash-lite   — lightest free option
const GEMINI_MODEL = 'gemini-3.8-flash';

const SYSTEM_PROMPT = `You are a friendly financial literacy tutor for students in Lesotho, Southern Africa.
Rules:
- Keep answers SHORT (2-4 sentences max unless the user asks for detail).
- Use simple English (or Sesotho if the user writes in Sesotho).
- Reference "M" for Maloti (the Lesotho currency), not "$".
- Give practical advice suited to students with little money.
- Never promise profits or investments.
- Never ask for personal info.
- If the question is not about money, saving, budgeting, loans, banking, or personal finance, politely redirect.`;

// ---------- Gemini ----------
async function callGemini(question, history) {
  if (!GEMINI_API_KEY) throw new Error('Gemini key missing');

  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];

  // Legacy generateContent endpoint — still works for 3.x models
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 500,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? text.trim() : null;
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