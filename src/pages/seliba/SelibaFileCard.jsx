import React from 'react';

const extOf = (path) => {
  if (!path) return 'pdf';
  const parts = path.split('.');
  return (parts.length > 1 ? parts.pop() : 'pdf').toLowerCase();
};

const labelForExt = (ext) => {
  if (ext === 'pdf') return 'Download PDF';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'Download Image';
  return 'Download';
};

export default function SelibaFileCard({ material, onDownload }) {
  const subjectClass =
    material.subject === 'Law'
      ? 'subject-law'
      : material.subject === 'Science'
      ? 'subject-science'
      : 'subject-other';

  const ext = extOf(material.file_path);

  return (
    <div className="seliba-card">
      <div className="seliba-card-badges">
        <span className={`seliba-badge ${subjectClass}`}>{material.subject}</span>
        <span className="seliba-badge year">{material.year_level}</span>
        {material.course_code && (
          <span className="seliba-badge year">{material.course_code}</span>
        )}
      </div>

      <h3>{material.title}</h3>

      {material.description && (
        <p className="card-description">{material.description}</p>
      )}

      <div className="card-meta">
        <span>⬇ {material.download_count || 0} downloads</span>
        <span>
          {new Date(material.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>

      <button
        className="seliba-download-btn"
        onClick={() => onDownload(material)}
      >
        {labelForExt(ext)}
      </button>
    </div>
  );
}