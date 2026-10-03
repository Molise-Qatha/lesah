import React from 'react';

export default function SelibaFileCard({ material, onDownload }) {
  const subjectClass =
    material.subject === 'Law'
      ? 'subject-law'
      : material.subject === 'Science'
      ? 'subject-science'
      : 'subject-other';

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
        Download PDF
      </button>
    </div>
  );
}