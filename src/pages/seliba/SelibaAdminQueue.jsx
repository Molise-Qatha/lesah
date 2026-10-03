import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './selibaStyles.css';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://tsfnvmfioscjlffgwgx.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export default function SelibaAdminQueue() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [working, setWorking] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const loadPending = async (pwd) => {
    setLoading(true);
    setError('');
    const { data, error: rpcError } = await supabase.rpc('get_pending_materials', {
      admin_password: pwd,
    });
    setLoading(false);

    if (rpcError) {
      setError('Wrong password, or you do not have access.');
      return false;
    }
    setPending(data || []);
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await loadPending(password);
    if (ok) setAuthed(true);
  };

  const handleApprove = async (id) => {
    setWorking(id);
    const { data } = await supabase.rpc('approve_material', {
      material_id: id,
      admin_password: password,
    });
    setWorking(null);
    if (data?.success) {
      setPending((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert('Approval failed: ' + (data?.error || 'Unknown error'));
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):');
    if (reason === null) return; // cancelled
    setWorking(id);
    const { data } = await supabase.rpc('reject_material', {
      material_id: id,
      admin_password: password,
      rejection_reason: reason || null,
    });
    setWorking(null);
    if (data?.success) {
      setPending((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert('Rejection failed: ' + (data?.error || 'Unknown error'));
    }
  };

  const previewUrl = (filePath) =>
    `${SUPABASE_URL}/storage/v1/object/materials/${filePath}`;

  // ── Login Screen ──
  if (!authed) {
    return (
      <div className="seliba-page">
        <div className="seliba-container">
          <div className="seliba-hero" style={{ maxWidth: 500, margin: '60px auto' }}>
            <h1>Admin Access</h1>
            <p className="sesotho-subtitle">Seliba sa Tsebo — Review Queue</p>
            <form onSubmit={handleLogin} style={{ marginTop: 24 }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
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
                autoFocus
              />
              <button
                type="submit"
                className="seliba-download-btn"
                disabled={loading}
              >
                {loading ? 'Checking…' : 'Unlock Queue'}
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
        <Link to="/student-zone/seliba-sa-tsebo" style={{ color: '#a0a0c0', fontSize: 14, textDecoration: 'none' }}>
          ← Back to Seliba sa Tsebo
        </Link>

        <div className="seliba-hero" style={{ marginTop: 20 }}>
          <h1>Review Queue</h1>
          <p className="sesotho-subtitle">{pending.length} material{pending.length !== 1 ? 's' : ''} pending</p>
          <p>
            Preview each submission and choose to approve or reject. Approved
            materials appear immediately on Seliba sa Tsebo.
          </p>
        </div>

        {pending.length === 0 ? (
          <div className="seliba-empty">
            <h3>All caught up</h3>
            <p>No pending submissions right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {pending.map((m) => (
              <div
                key={m.id}
                className="seliba-card"
                style={{ padding: 24 }}
              >
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
                      If the preview doesn't load below, open it in a new tab:
                      {' '}
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