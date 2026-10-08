import React, { useEffect, useState } from 'react';
import { listVendors, approveVendor, rejectVendor, VENDOR_CATEGORIES } from '../lib/vendorService';
import AdminNav from '../components/AdminNav';
import './AdminAnalytics.css';

const ADMIN_EMAIL = 'customaryqatha@gmail.com';

export default function AdminVendors() {
  const [tab, setTab] = useState('pending');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listVendors(tab === 'all' ? null : tab);
      setVendors(data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  const handleApprove = async (id) => {
    setWorking(id);
    try { await approveVendor(id, ADMIN_EMAIL); await load(); }
    catch (err) { alert('Approval failed: ' + err.message); }
    finally { setWorking(null); }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):');
    if (reason === null) return;
    setWorking(id);
    try { await rejectVendor(id, reason, ADMIN_EMAIL); await load(); }
    catch (err) { alert('Rejection failed: ' + err.message); }
    finally { setWorking(null); }
  };

  const catLabel = (id) => {
    const c = VENDOR_CATEGORIES.find((x) => x.id === id);
    return c ? `${c.icon} ${c.label}` : id;
  };

  return (
    <div className="adm-analytics">
      <AdminNav />
      <h1>Vendors</h1>
      <p className="adm-sub">Review vendor applications and manage approved vendors</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['pending', 'approved', 'rejected', 'all'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 18px', borderRadius: 999, fontWeight: 600, fontSize: 13,
              border: '1px solid ' + (tab === t ? '#2e7d32' : '#cbd5e1'),
              background: tab === t ? '#2e7d32' : '#fff',
              color: tab === t ? '#fff' : '#475569',
              cursor: 'pointer', textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {!loading && vendors.length === 0 && (
        <p style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
          No {tab !== 'all' ? tab : ''} vendors.
        </p>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {vendors.map((v) => (
          <div key={v.id} style={{ display: 'flex', gap: 16, padding: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {v.logo_url ? (
                <img src={v.logo_url} alt={v.business_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{catLabel(v.category).split(' ')[0]}</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: '#0d3b66' }}>{v.business_name}</h3>
                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, background: v.status === 'approved' ? '#e8f5e9' : v.status === 'rejected' ? '#ffebee' : '#fff3e0', color: v.status === 'approved' ? '#2e7d32' : v.status === 'rejected' ? '#c62828' : '#b45309', fontWeight: 600, textTransform: 'uppercase' }}>
                  {v.status}
                </span>
              </div>

              <p style={{ margin: '4px 0', color: '#64748b', fontSize: 13 }}>
                {catLabel(v.category)} · {v.location || 'No location'} · {v.phone || 'No phone'}
              </p>

              {v.description && (
                <p style={{ margin: '8px 0', color: '#475569', fontSize: 14, lineHeight: 1.5 }}>{v.description}</p>
              )}

              {v.student_id && (
                <p style={{ margin: '4px 0', color: '#94a3b8', fontSize: 12 }}>Student ID: {v.student_id}</p>
              )}

              {v.rejection_reason && (
                <p style={{ margin: '8px 0', padding: 8, background: '#fff3e0', borderRadius: 6, fontSize: 13 }}>
                  <strong>Rejection reason:</strong> {v.rejection_reason}
                </p>
              )}

              {v.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => handleApprove(v.id)}
                    disabled={working === v.id}
                    style={{ padding: '8px 18px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(v.id)}
                    disabled={working === v.id}
                    style={{ padding: '8px 18px', background: '#c62828', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}