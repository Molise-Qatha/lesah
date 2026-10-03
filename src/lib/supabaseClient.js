import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
//  LeSAH · Supabase Connection
// ─────────────────────────────────────────────
// The anon key is SAFE to include here — it's designed to be public.
// Row Level Security (RLS) on the database enforces real protection.

const SUPABASE_URL = 'https://tsfnvmfioscjlffgwgx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZmxudm1maW9zY2psZmZnd2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NzQ5MTMsImV4cCI6MjEwNjU1MDkxM30.DOCrUOUHVEcUVNJpzv85HyzqOkAe2aDaVo1DX__J2lw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);