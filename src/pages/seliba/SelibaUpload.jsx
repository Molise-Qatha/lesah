import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './selibaStyles.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg', // covers .jpg and .jpeg
];
const SUBJECTS = ['Law', 'Science', 'Other'];
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];

const iconForType = (type) => {
  if (type === 'application/pdf') return '📄';
  if (type?.startsWith('image/')) return '🖼️';
  return '📎';
};

const extForType = (type) => {
  if (type === 'application/pdf') return 'pdf';
  if (type === 'image/png') return 'png';
  if (type === 'image/jpeg') return 'jpg';
  return 'bin';
};

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
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // { uploaded, failed }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilesChange = (e) => {
    setError('');
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const accepted = [];
    const rejected = [];

    for (const f of selected) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        rejected.push(`${f.name} — unsupported type (PDF, PNG or JPG only)`);
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        rejected.push(
          `${f.name} — too large (${(f.size / 1024 / 1024).toFixed(2)} MB, max 5 MB)`
        );
        continue;
      }
      accepted.push(f);
    }

    setFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}|${f.size}`));
      const merged = [...prev];
      for (const f of accepted) {
        const key = `${f.name}|${f.size}`;
        if (!existing.has(key)) {
          merged.push(f);
          existing.add(key);
        }
      }
      return merged;
    });

    if (rejected.length) {
      setError(
        `Some files were skipped:\n• ${rejected.join('\n• ')}`
      );
    }

    // Reset the input value so the same file can be picked again if removed
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.title.trim()) return setError('Please enter a title.');
    if (!form.uploader_email.trim() || !form.uploader_email.includes('@'))
      return setError('Please enter a valid email address.');
    if (files.length === 0)
      return setError('Please choose at least one file to upload.');

    setSubmitting(true);

    let uploaded = 0;
    let failed = 0;
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Build a unique file path: pending/{timestamp}-{random}-{safeName}
        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(2, 8);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `pending/${timestamp}-${random}-${safeName}`;

        // 1. Upload the file
        const { error: uploadError } = await supabase.storage
          .from('materials')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // 2. Insert metadata row for this file
        const title =
          files.length > 1
            ? `${form.title.trim()} (${i + 1}/${files.length})`
            : form.title.trim();

        const { error: dbError } = await supabase.from('materials').insert({
          title,
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

        uploaded += 1;
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
        failed += 1;
        errors.push(`${file.name}: ${err.message || 'upload failed'}`);
      }
    }

    // 3. Log analytics (best-effort)
    supabase
      .from('analytics')
      .insert({
        event_type: 'upload',
        page: 'seliba_sa_tsebo',
        metadata: {
          title: form.title,
          subject: form.subject,
          file_count: files.length,
          uploaded,
          failed,
        },
      })
      .then(() => {})
      .catch(() => {});

    setSubmitting(false);

    if (uploaded === 0) {
      setError(
        `All uploads failed:\n• ${errors.join('\n• ')}`
      );
      return;
    }

    setSuccess({ uploaded, failed, errors });
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="seliba-page">
        <div className="seliba-container">
          <div className="seliba-hero">
            <h1>Thank you! 🎉</h1>
            <p className="sesotho-subtitle">
              {success.uploaded} file{success.uploaded !== 1 ? 's' : ''} submitted
              {success.failed > 0 ? `, ${success.failed} failed` : ''}
            </p>
            <p>
              {success.uploaded === 1
                ? 'It will be reviewed before it appears on Seliba sa Tsebo.'
                : 'They will be reviewed before they appear on Seliba sa Tsebo.'}{' '}
              This usually takes a short while. Once approved, other students will
              be able to download them freely.
            </p>

            {success.failed > 0 && (
              <div
                className="seliba-form-error"
                style={{ marginTop: 20, textAlign: 'left' }}
              >
                <strong>Files that failed:</strong>
                <ul style={{ margin: '8px 0 0 20px' }}>
                  {success.errors.map((e, i) => (
                    <li key={i} style={{ fontSize: 13 }}>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link
              to="/student-zone/seliba-sa-tsebo"
              className="seliba-download-btn"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                width: 'auto',
                padding: '12px 32px',
              }}
            >
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
            Upload PDFs or images you think other NUL students would benefit from.
            You can select multiple files at once. Every submission is reviewed
            before it becomes public.
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
            {files.length > 1 && (
              <small style={{ color: '#7070a0', fontSize: 12 }}>
                Applies to all {files.length} files. Each will be labelled with a
                number.
              </small>
            )}
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
                  <option key={s} value={s}>
                    {s}
                  </option>
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
                  <option key={y} value={y}>
                    {y}
                  </option>
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
              <label>
                Your Email <span style={{ color: '#e94560' }}>*</span>
              </label>
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
            <label>
              Files <span style={{ color: '#e94560' }}>*</span>
            </label>
            <input
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              multiple
              onChange={handleFilesChange}
              className="seliba-file-input"
            />
            <small style={{ color: '#7070a0', fontSize: 12 }}>
              PDF, PNG or JPG. Max 5 MB per file. Select as many as you need in one
              go.
            </small>

            {files.length > 0 && (
              <div className="seliba-file-list">
                {files.map((f, i) => (
                  <div key={`${f.name}-${i}`} className="seliba-file-item">
                    <span className="seliba-file-icon">
                      {iconForType(f.type)}
                    </span>
                    <span className="seliba-file-name" title={f.name}>
                      {f.name}
                    </span>
                    <span className="seliba-file-size">
                      {(f.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
                      className="seliba-file-remove"
                      onClick={() => removeFile(i)}
                      aria-label={`Remove ${f.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="seliba-file-summary">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="seliba-form-error" style={{ whiteSpace: 'pre-line' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="seliba-download-btn"
            disabled={submitting}
            style={{ marginTop: 20 }}
          >
            {submitting
              ? `Uploading ${files.length} file${files.length !== 1 ? 's' : ''}…`
              : `Submit ${files.length || ''} ${
                  files.length === 1 ? 'File' : 'Files'
                } for Review`}
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