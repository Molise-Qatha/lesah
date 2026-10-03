import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SelibaFileCard from './seliba/SelibaFileCard';
import './seliba/selibaStyles.css';

export default function SelibaSaTsebo() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [downloading, setDownloading] = useState(null);

  // Log a page view when someone lands here
  useEffect(() => {
    supabase
      .from('analytics')
      .insert({ event_type: 'page_view', page: 'seliba_sa_tsebo' })
      .then(() => {})
      .catch(() => {});
  }, []);

  // Fetch approved materials
  useEffect(() => {
    let cancelled = false;

    const fetchMaterials = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('materials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (fetchError) {
        setError('Could not load materials. Please try again later.');
        console.error(fetchError);
      } else {
        setMaterials(data || []);
      }
      setLoading(false);
    };

    fetchMaterials();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter in memory
  const filtered = materials.filter((m) => {
    if (subjectFilter !== 'All' && m.subject !== subjectFilter) return false;
    if (yearFilter !== 'All' && m.year_level !== yearFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const hay = `${m.title} ${m.description || ''} ${m.course_code || ''}`.toLowerCase();
      if (!hay.includes(term)) return false;
    }
    return true;
  });

  // Download handler — signed URL + counter increment
  const handleDownload = async (material) => {
    setDownloading(material.id);
    try {
      // 1. Create a signed URL valid for 60 seconds
      const { data: signed, error: signError } = await supabase.storage
        .from('materials')
        .createSignedUrl(material.file_path, 60);

      if (signError) throw signError;

      // 2. Trigger browser download
      const a = document.createElement('a');
      a.href = signed.signedUrl;
      a.download = material.title + '.pdf';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 3. Increment download counter (best-effort)
      await supabase.rpc('increment_download_count', {
        material_id: material.id,
      });

      // 4. Log analytics
      supabase
        .from('analytics')
        .insert({
          event_type: 'download',
          page: 'seliba_sa_tsebo',
          metadata: { material_id: material.id, title: material.title },
        })
        .then(() => {})
        .catch(() => {});

      // 5. Update local UI
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id
            ? { ...m, download_count: (m.download_count || 0) + 1 }
            : m
        )
      );
    } catch (err) {
      console.error(err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="seliba-page">
      <div className="seliba-container">
        <Link
          to="/student-zone"
          style={{ color: '#a0a0c0', fontSize: 14, textDecoration: 'none' }}
        >
          ← Back to Student Zone
        </Link>

        <div className="seliba-hero" style={{ marginTop: 20 }}>
          <h1>Seliba sa Tsebo</h1>
          <p className="sesotho-subtitle">The wellspring of knowledge</p>
          <p>
            Study materials shared freely by NUL students. Browse by subject or
            year, download what you need — no account required.
          </p>
        </div>

        <div className="seliba-filters">
          <div className="seliba-filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search title, description, course code…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="seliba-filter-group">
            <label>Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="All">All Subjects</option>
              <option value="Law">Law</option>
              <option value="Science">Science</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="seliba-filter-group">
            <label>Year Level</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="All">All Years</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
              <option value="Year 5">Year 5</option>
            </select>
          </div>
        </div>

        {loading && <div className="seliba-loading">Loading materials…</div>}

        {error && <div className="seliba-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="seliba-results-info">
              <span>
                {filtered.length} material{filtered.length !== 1 ? 's' : ''}{' '}
                available
              </span>
              <Link
                to="/student-zone/seliba-sa-tsebo/upload"
                className="seliba-upload-btn"
              >
                ⬆ Upload Material
              </Link>
            </div>

            {filtered.length === 0 ? (
              <div className="seliba-empty">
                <h3>Nothing here yet</h3>
                <p>
                  No study materials have been shared for these filters. Be the
                  first to contribute — upload a PDF and share what you know.
                </p>
                <Link
                  to="/student-zone/seliba-sa-tsebo/upload"
                  className="seliba-upload-btn"
                  style={{ display: 'inline-block', marginTop: 20 }}
                >
                  ⬆ Upload the First Material
                </Link>
              </div>
            ) : (
              <div className="seliba-grid">
                {filtered.map((m) => (
                  <SelibaFileCard
                    key={m.id}
                    material={m}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}