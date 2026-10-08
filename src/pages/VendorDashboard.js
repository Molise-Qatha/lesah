import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getMyVendorProfile, VENDOR_CATEGORIES } from '../lib/vendorService';
import './Vendor.css';

const STATUS_INFO = {
  pending:  { label: 'Pending review', color: '#f59e0b', emoji: '⏳' },
  approved: { label: 'Approved',       color: '#2e7d32', emoji: '✅' },
  rejected: { label: 'Rejected',       color: '#c62828', emoji: '❌' },
};

export default function VendorDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user) {
        setLoading(false);
        return;
      }
      getMyVendorProfile()
        .then(setProfile)
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) return <div className="vendor-page"><p style={{ padding: 40, textAlign: 'center' }}>Loading…</p></div>;

  if (!user) {
    return (
      <div className="vendor-page">
        <div className="vendor-card">
          <h1>Vendor Dashboard</h1>
          <p>You need to log in first.</p>
          <Link to="/login" className="vendor-btn">Login</Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="vendor-page">
        <div className="vendor-card">
          <h1>You're not a vendor yet</h1>
          <p>Apply to become a vendor and reach students on LeSAH.</p>
          <Link to="/vendor/register" className="vendor-btn">Apply Now</Link>
        </div>
      </div>
    );
  }

  const status = STATUS_INFO[profile.status] || STATUS_INFO.pending;
  const category = VENDOR_CATEGORIES.find((c) => c.id === profile.category);

  return (
    <div className="vendor-page">
      <div className="vendor-card">
        <div className="vendor-status-pill" style={{ background: status.color }}>
          {status.emoji} {status.label}
        </div>

        <div className="vendor-profile-header">
          <div className="vendor-profile-logo">
            {profile.logo_url ? (
              <img src={profile.logo_url} alt={profile.business_name} />
            ) : (
              <span>{category?.icon || '🏪'}</span>
            )}
          </div>
          <div>
            <h1>{profile.business_name}</h1>
            <p className="vendor-sub">
              {category?.icon} {category?.label} · {profile.location || 'No location set'}
            </p>
          </div>
        </div>

        {profile.description && <p className="vendor-description">{profile.description}</p>}

        {profile.status === 'rejected' && profile.rejection_reason && (
          <div className="vendor-rejection">
            <strong>Reason:</strong> {profile.rejection_reason}
          </div>
        )}

        <div className="vendor-actions">
          <Link to="/vendor/register" className="vendor-btn">Edit Profile</Link>
          {profile.status === 'approved' && (
            <Link to="/marketplace" className="vendor-btn vendor-btn-outline">View on Marketplace</Link>
          )}
        </div>
      </div>
    </div>
  );
}