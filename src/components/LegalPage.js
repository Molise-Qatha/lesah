import React, { useState } from 'react';
import './LegalPage.css';

function LegalPage({ title, sections, showAdminNotice = false }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="legal-page">
      <div className="legal-header">
        <div className="legal-header-inner">
          <h1>{title}</h1>
          {showAdminNotice && (
            <div className="legal-admin-notice">
              ⚠️ Legal content should be reviewed by a qualified legal professional before publication.
            </div>
          )}
        </div>
      </div>

      <div className="legal-body">
        {/* Table of Contents (desktop) */}
        <nav className="legal-toc">
          <h3>Contents</h3>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <div className="legal-content">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="legal-section">
              <h2>{section.title}</h2>
              {section.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {section.list && (
                <ul className="legal-list">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="legal-footer">
            <p>Last updated: August 2024</p>
            <p>LeSAH — Lesotho Students Assistance Hub</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalPage;