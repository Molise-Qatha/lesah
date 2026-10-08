import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TABS = [
  { label: '📊 Analytics',      to: '/admin/analytics' },
  { label: '📚 Seliba Review',  to: '/student-zone/seliba-sa-tsebo/admin' },
  { label: '🏪 Vendors',        to: '/admin/vendors' },
];

export default function AdminNav() {
  const { pathname } = useLocation();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '20px 0', marginBottom: 8, flexWrap: 'wrap' }}>
      {TABS.map((t) => {
        const active = pathname === t.to;
        return (
          <Link
            key={t.to}
            to={t.to}
            style={{
              padding: '10px 20px', borderRadius: 999, textDecoration: 'none', fontWeight: 600, fontSize: 14,
              color: active ? '#fff' : '#475569',
              background: active ? '#2e7d32' : '#fff',
              border: '1px solid ' + (active ? '#2e7d32' : '#cbd5e1'),
              boxShadow: active ? '0 2px 8px rgba(46,125,50,0.25)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}