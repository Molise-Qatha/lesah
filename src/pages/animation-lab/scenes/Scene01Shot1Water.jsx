import React from 'react';
import './Scene01Shot1Water.css';

export default function Scene01Shot1Water() {
  return (
    <div className="shot1-water">
      <video
        className="water-video"
        src="/videos/river.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="water-vignette" />
      <div className="water-fade-in" />
    </div>
  );
}