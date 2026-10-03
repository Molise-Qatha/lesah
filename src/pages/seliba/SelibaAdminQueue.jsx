import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './selibaStyles.css';

const SUPABASE_URL = 'https://tsfnvmfioscjlffgwgx.supabase.co';

export default function SelibaAdminQueue() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [working, setWorking] = useState(null);
  const [expanded, setExpanded] = useState(null);

  // Check for existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadPending();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadPending();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadPending = async () => {
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('materials')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    setLoading(false);

    if (fetchError) {
      setError('Could not load pending materials: ' + fetchError.message);
      return;
    }
    setPending(data || []);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setPassword('');
    // Session state change triggers loadPending via the effect above
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setPending([]);
  };

  const handleApprove = async (id) => {
    setWorking(id);
    const { error: updateError } = await supabase
      .from('materials')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: session?.user?.email || 'admin',
      })
      .eq('id', id);

    setWorking(null);
    if (updateError) {
      alert('Approval failed: ' + updateError.message);
    } else {
      setPending((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):');
    if (reason === null) return; // cancelled
    setWorking(id);
    const { error: updateError } = await supabase
      .from('materials')
      .update({
        status: 'rejected',
        rejection_reason: reason || null,
        approved_at: new Date().toISOString(),
        approved_by: session?.user?.email || 'admin',
      })
      .eq('id', id);

    setWorking(null);
    if (updateError) {
      alert('Rejection failed: ' + updateError.message);
    } else {
      setPending((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const previewUrl = (filePath) =>
    `${SUPABASE_URL}/storage/v1/object/materials/${filePath}`;

  // ── Login Screen ──
  if (!session) {
    return (
      <div className="seliba-page">
        <div className="seliba-container">
          <div className="seliba-hero" style={{ maxWidth: 500, margin: '60px auto' }}>
            <h1>Admin Access</h1>
            <p className="sesotho-subtitle">Seliba sa Tsebo — Review Queue</p>
            <form onSubmit={handleLogin} style={{ marginTop: 24 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#0a0f1a',
                  border: '1px solid #2a2a4e',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 14,
                  marginBottom: 12,
                }}
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#0a0f1a',
                  border: '1px solid #2a2a4e',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 14,
                  marginBottom: 12,
                }}
                required
              />
              <button
                type="submit"
                className="seliba-download-btn"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              {error && <div className="seliba-form-error" style={{ marginTop: 12 }}>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Queue Screen ──
  return (
    <div className="seliba-page">
      <div className="seliba-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/student-zone/seliba-sa-tsebo" style={{ color: '#a0a0c0', fontSize: 14, textDecoration: 'none' }}>
            ← Back to Seliba sa Tsebo
          </Link>
          <button
            onClick={handleSignOut}
            style={{
              background: 'transparent',
              border: '1px solid #533483',
              color: '#a0a0c0',
              padding: '6px 14px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Sign Out
          </button>
        </div>

        <div className="seliba-hero" style={{ marginTop: 20 }}>
          <h1>Review Queue</h1>
          <p className="sesotho-subtitle">
            {pending.length} material{pending.length !== 1 ? 's' : ''} pending
          </p>
          <p>
            Signed in as <strong>{session.user.email}</strong>. Preview each
            submission and choose to approve or reject.
          </p>
        </div>

        {loading && <div className="seliba-loading">Loading queue…</div>}

        {!loading && pending.length === 0 && (
          <div className="seliba-empty">
            <h3>All caught up</h3>
            <p>No pending submissions right now.</p>
          </div>
        )}

        {!loading && pending.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {pending.map((m) => (
              <div key={m.id} className="seliba-card" style={{ padding: 24 }}>
                <div className="seliba-card-badges">
                  <span className={`seliba-badge ${m.subject === 'Law' ? 'subject-law' : m.subject === 'Science' ? 'subject-science' : 'subject-other'}`}>
                    {m.subject}
                  </span>
                  <span className="seliba-badge year">{m.year_level}</span>
                  {m.course_code && <span className="seliba-badge year">{m.course_code}</span>}
                </div>

                <h3>{m.title}</h3>
                {m.description && <p className="card-description">{m.description}</p>}

                <div className="card-meta">
                  <span>From: {m.uploader_name || 'Anonymous'}</span>
                  <span>{m.uploader_email}</span>
                </div>
                <div className="card-meta">
                  <span>{(m.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    className="test-btn"
                    onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                    style={{ flex: 1 }}
                  >
                    {expanded === m.id ? '⬇ Hide Preview' : '👁 Preview PDF'}
                  </button>
                  <button
                    className="seliba-download-btn"
                    onClick={() => handleApprove(m.id)}
                    disabled={working === m.id}
                    style={{ flex: 1, background: '#2e7d32' }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="seliba-download-btn"
                    onClick={() => handleReject(m.id)}
                    disabled={working === m.id}
                    style={{ flex: 1, background: '#c62828' }}
                  >
                    ❌ Reject
                  </button>
                </div>

                {expanded === m.id && (
                  <div style={{ marginTop: 16, borderTop: '1px solid #2a2a4e', paddingTop: 16 }}>
                    <p style={{ color: '#a0a0c0', fontSize: 12, marginBottom: 8 }}>
                      If the preview doesn't load, open it in a new tab:{' '}
                      <a
                        href={previewUrl(m.file_path)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#e94560' }}
                      >
                        Open PDF
                      </a>
                    </p>
                    <iframe
                      title={`preview-${m.id}`}
                      src={previewUrl(m.file_path)}
                      style={{
                        width: '100%',
                        height: 600,
                        border: '1px solid #2a2a4e',
                        borderRadius: 6,
                        background: '#000',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}