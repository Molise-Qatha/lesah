import React, { useEffect } from 'react';
import './ImageViewer.css';

function ImageViewer({ src, alt, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!src) return null;

  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <button className="image-viewer-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt || 'Full size image'} className="image-viewer-img" />
      </div>
    </div>
  );
}

export default ImageViewer;