import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './selibaStyles.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const SUBJECTS = ['Law', 'Science', 'Other'];
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];

export default function SelibaUpload() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: 'Law',
    year_level: 'Year 1',
    course_code: '',
    uploader_name: '',
    uploader_email: '',
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setError('');
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setError('Only PDF files are allowed. Please convert your file to PDF first.');
      setFile(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError(`File is too large (${(selected.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`);
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.title.trim()) return setError('Please enter a title.');
    if (!form.uploader_email.trim() || !form.uploader_email.includes('@'))
      return setError('Please enter a valid email address.');
    if (!file) return setError('Please choose a PDF file to upload.');

    setSubmitting(true);

    try {
      // Build a unique file path: pending/{timestamp}-{random}-{safeName}.pdf
      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2, 8);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `pending/${timestamp}-${random}-${safeName}`;

      // 1. Upload file to Storage
      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, file, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. Insert metadata row (status defaults to 'pending')
      const { error: dbError } = await supabase.from('materials').insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        subject: form.subject,
        year_level: form.year_level,
        course_code: form.course_code.trim() || null,
        uploader_name: form.uploader_name.trim() || null,
        uploader_email: form.uploader_email.trim(),
        file_path: filePath,
        file_size: file.size,
        status: 'pending',
      });

      if (dbError) throw dbError;

      // 3. Log analytics (best-effort)
      supabase
        .from('analytics')
        .insert({
          event_type: 'upload',
          page: 'seliba_sa_tsebo',
          metadata: { title: form.title, subject: form.subject },
        })
        .then(() => {})
        .catch(() => {});

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again. If the problem continues, contact us.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="seliba-page">
        <div className="seliba-container">
          <div className="seliba-hero">
            <h1>Thank you! 🎉</h1>
            <p className="sesotho-subtitle">Your material has been submitted</p>
            <p>
              It will be reviewed before it appears on Seliba sa Tsebo. This usually
              takes a short while. Once approved, other students will be able to
              download it freely.
            </p>
          </div>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link to="/student-zone/seliba-sa-tsebo" className="seliba-download-btn" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '12px 32px' }}>
              Back to Seliba sa Tsebo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Upload Form ──
  return (
    <div className="seliba-page">
      <div className="seliba-container">
        <Link
          to="/student-zone/seliba-sa-tsebo"
          style={{ color: '#a0a0c0', fontSize: 14, textDecoration: 'none' }}
        >
          ← Back to Seliba sa Tsebo
        </Link>

        <div className="seliba-hero" style={{ marginTop: 20 }}>
          <h1>Share Study Material</h1>
          <p className="sesotho-subtitle">Contribute to Seliba sa Tsebo</p>
          <p>
            Upload a PDF you think other NUL students would benefit from. Every
            submission is reviewed before it becomes public.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="seliba-upload-form">
          <div className="seliba-form-row">
            <label>
              Title <span style={{ color: '#e94560' }}>*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Contract Law — Lecture Notes"
              maxLength={120}
              required
            />
          </div>

          <div className="seliba-form-row">
            <label>Short description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="What does this cover? Who is it for?"
              rows={3}
              maxLength={400}
            />
          </div>

          <div className="seliba-form-grid">
            <div className="seliba-form-row">
              <label>Subject</label>
              <select
                value={form.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="seliba-form-row">
              <label>Year Level</label>
              <select
                value={form.year_level}
                onChange={(e) => handleChange('year_level', e.target.value)}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="seliba-form-row">
              <label>Course Code (optional)</label>
              <input
                type="text"
                value={form.course_code}
                onChange={(e) => handleChange('course_code', e.target.value)}
                placeholder="e.g. LAW 101"
                maxLength={20}
              />
            </div>
          </div>

          <div className="seliba-form-grid">
            <div className="seliba-form-row">
              <label>Your Name (optional)</label>
              <input
                type="text"
                value={form.uploader_name}
                onChange={(e) => handleChange('uploader_name', e.target.value)}
                placeholder="How you'd like to be credited"
                maxLength={60}
              />
            </div>

            <div className="seliba-form-row">
              <label>Your Email <span style={{ color: '#e94560' }}>*</span></label>
              <input
                type="email"
                value={form.uploader_email}
                onChange={(e) => handleChange('uploader_email', e.target.value)}
                placeholder="you@example.com"
                required
              />
              <small style={{ color: '#7070a0', fontSize: 12 }}>
                Only used to contact you if we need to verify something.
              </small>
            </div>
          </div>

          <div className="seliba-form-row">
            <label>PDF File <span style={{ color: '#e94560' }}>*</span></label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="seliba-file-input"
            />
            <small style={{ color: '#7070a0', fontSize: 12 }}>
              PDF only. Maximum 5 MB. Larger files should be compressed first.
            </small>
            {file && (
              <div className="seliba-file-preview">
                ✅ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          {error && <div className="seliba-form-error">{error}</div>}

          <button
            type="submit"
            className="seliba-download-btn"
            disabled={submitting}
            style={{ marginTop: 20 }}
          >
            {submitting ? 'Uploading…' : 'Submit for Review'}
          </button>

          <p className="seliba-form-note">
            By uploading, you confirm this material is yours to share and does not
            violate any copyright. Books and paid content will be rejected.
          </p>
        </form>
      </div>
    </div>
  );
}