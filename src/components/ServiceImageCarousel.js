import React, { useRef, useCallback } from 'react';
import './ServiceImageCarousel.css';

function ServiceImageCarousel({ images, aspectRatio = '4/3', objectFit = 'cover' }) {
  const scrollRef = useRef(null);

  const scroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="carousel-empty">
        <p>📷 Images coming soon</p>
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      <button 
        className="carousel-arrow carousel-arrow-left" 
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        ‹
      </button>
      
      <div 
        className="carousel-track" 
        ref={scrollRef}
        style={{ '--aspect-ratio': aspectRatio }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="carousel-slide">
            <img
              src={img.src}
              alt={img.alt || `Image ${idx + 1}`}
              className="carousel-image"
              style={{ objectFit }}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.classList.add('carousel-slide-error');
              }}
            />
            {img.caption && <span className="carousel-caption">{img.caption}</span>}
          </div>
        ))}
      </div>

      <button 
        className="carousel-arrow carousel-arrow-right" 
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}

export default ServiceImageCarousel;