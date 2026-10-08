// ============================================================
//  LeSAH · Analytics
//  Logs events to the Supabase `analytics` table.
//  Table schema: id, event_type, page, metadata (jsonb), created_at
//  Never throws — analytics must not break the app.
// ============================================================

import { supabase } from '../lib/supabaseClient';

const SESSION_KEY = 'lesah_session_id';
const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 min idle = new session

function getSessionId() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const now = Date.now();
      if (data.id && data.ts && (now - data.ts) < SESSION_EXPIRY_MS) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ id: data.id, ts: now }));
        return data.id;
      }
    }
    const id = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id, ts: Date.now() }));
    return id;
  } catch (e) {
    return 'sess_unknown';
  }
}

function getDevice() {
  const ua = navigator.userAgent || '';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

// --- Internal insert (never throws) ---
async function insertEvent(eventType, page, metadata) {
  try {
    await supabase.from('analytics').insert({
      event_type: eventType,
      page: page || null,
      metadata: metadata || null,
    });
  } catch (err) {
    // silent — analytics must never break the app
  }
}

// --- Public API ---

let lastLoggedPath = null;

export async function logPageVisit(path) {
  if (path === lastLoggedPath) return;
  lastLoggedPath = path;

  await insertEvent('page_view', path, {
    session_id: getSessionId(),
    device: getDevice(),
    referrer: document.referrer ? document.referrer.slice(0, 200) : null,
  });
}

export async function logAIQuestion(question, answeredBy, topic, language, confidence) {
  await insertEvent('ai_question', null, {
    session_id: getSessionId(),
    question: question ? question.slice(0, 500) : null,
    answered_by: answeredBy || 'unknown',
    topic: topic || null,
    language: language || null,
    confidence: typeof confidence === 'number' ? confidence : null,
    device: getDevice(),
  });
}

export async function logScamDetected(question, risk, flags) {
  await insertEvent('scam_detected', null, {
    session_id: getSessionId(),
    question: question ? question.slice(0, 500) : null,
    risk: risk,
    flags: flags || [],
    device: getDevice(),
  });
}

// --- Aggregated stats for the dashboard ---

export async function fetchStats(days) {
  const since = new Date(Date.now() - (days || 30) * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(10000);

  if (error) throw error;
  return data || [];
}