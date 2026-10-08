import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  VENDOR_CATEGORIES,
  getMyVendorProfile,
  saveVendorProfile,
  uploadVendorLogo,
} from '../lib/vendorService';
import './Vendor.css';

export default function VendorRegister() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [existing, setExisting] = useState(null);

  const [form, setForm] = useState({
    business_name: '',
    category: 'food',
    description: '',
    phone: '',
    location: '',
    student_id: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        getMyVendorProfile()
          .then((p) => {
            if (p) {
              setExisting(p);
              setForm({
                business_name: p.business_name || '',
                category: p.category || 'food',
                description: p.description || '',
                phone: p.phone || '',
                location: p.location || '',
                student_id: p.student_id || '',
              });
              if (p.logo_url) setLogoPreview(p.logo_url);
            }
          })
          .finally(() => setChecking(false));
      } else {
        setChecking(false);
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('Logo must be under 3 MB');
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.business_name.trim() || !form.category) {
      setError('Business name and category are required');
      return;
    }

    setSaving(true);
    try {
      let logoUrl = existing?.logo_url || null;
      if (logoFile) {
        logoUrl = await uploadVendorLogo(logoFile);
      }
      await saveVendorProfile({ ...form, logo_url: logoUrl });
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return <div className="vendor-page"><p style={{ padding: 40, textAlign: 'center' }}>Loading…</p></div>;
  }

  if (!user) {
    return (
      <div className="vendor-page">
        <div className="vendor-card">
          <h1>Become a Vendor</h1>
          <p>You need to log in first.</p>
          <Link to="/login" className="vendor-btn">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-page">
      <div className="vendor-card">
        <h1>{existing ? 'Edit Your Vendor Profile' : 'Become a Vendor'}</h1>
        <p className="vendor-sub">
          {existing
            ? 'Update your details. Re-submitting will send it back for review.'
            : 'Tell us about your business. An admin will review and approve it.'}
        </p>

        {error && <div className="vendor-error">{error}</div>}

        <form onSubmit={handleSubmit} className="vendor-form">
          <div className="vendor-logo-upload">
            <div className="vendor-logo-preview">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" />
              ) : (
                <span className="vendor-logo-placeholder">Logo</span>
              )}
            </div>
            <label className="vendor-logo-pick">
              {logoPreview ? 'Change logo' : 'Upload logo'}
              <input type="file" accept="image/*" onChange={handleLogo} />
            </label>
            <small>Square image works best. Max 3 MB.</small>
          </div>

          <div className="vendor-field">
            <label>Business Name *</label>
            <input
              type="text"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              placeholder="e.g. Thabo's Fresh Eggs"
              required
            />
          </div>

          <div className="vendor-field">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              {VENDOR_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          <div className="vendor-field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="What do you sell or offer?"
            />
          </div>

          <div className="vendor-row">
            <div className="vendor-field">
              <label>Phone / WhatsApp</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+266..." />
            </div>
            <div className="vendor-field">
              <label>Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Roma, near NUL" />
            </div>
          </div>

          <div className="vendor-field">
            <label>Student ID (proof you are a student)</label>
            <input type="text" name="student_id" value={form.student_id} onChange={handleChange} placeholder="e.g. STU12345" />
          </div>

          <button type="submit" className="vendor-btn" disabled={saving}>
            {saving ? 'Saving…' : existing ? 'Update Profile' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
}