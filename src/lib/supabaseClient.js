import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
//  LeSAH · Supabase Connection
// ─────────────────────────────────────────────
// The anon key is SAFE to include here — it's designed to be public.
// Row Level Security (RLS) on the database enforces real protection.

const SUPABASE_URL = 'https://tsflnvmfioscjlffgwgx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZLCe55l4OQ4k7VBSYQLIXQ_7veDWNp9';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);