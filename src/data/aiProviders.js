// ============================================================
//  LeSAH · External AI Provider (Google Gemini)
//  Model: gemini-2.0-flash
//  Free tier limits (as of 2025): 15 requests/min, 20 requests/day
//  No credit card required for free tier.
// ============================================================

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY || '';

// Working models (v1beta endpoint):
//   gemini-2.0-flash    — stable, current default (free tier: 20 req/day)
//   gemini-2.5-flash    — newer, higher quality, tighter limits
const GEMINI_MODEL = 'gemini-2.0-flash';

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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 300,
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