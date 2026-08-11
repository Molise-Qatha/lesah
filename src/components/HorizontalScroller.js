import React, { useRef } from 'react';
import './HorizontalScroller.css';

function HorizontalScroller({ children, className = '' }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`hscroller-wrapper ${className}`}>
      <button
        className="hscroller-arrow hscroller-left"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        ‹
      </button>
      <div className="hscroller-track" ref={scrollRef}>
        {children}
      </div>
      <button
        className="hscroller-arrow hscroller-right"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}

export default HorizontalScroller;