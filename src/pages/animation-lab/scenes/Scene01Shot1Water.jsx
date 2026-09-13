import React from 'react';
import './Scene01Shot1Water.css';

import layer1 from '../../../assets/scene01/water/layer1.png';
import layer2 from '../../../assets/scene01/water/layer2.png';
import layer3 from '../../../assets/scene01/water/layer3.png';

export default function Scene01Shot1Water() {
  return (
    <div className="shot1-water">
      {/* Layer 1 — Base flow (slow) */}
      <div
        className="water-layer water-base"
        style={{ backgroundImage: `url(${layer1})` }}
      />

      {/* Layer 2 — Medium ripples */}
      <div
        className="water-layer water-ripples"
        style={{ backgroundImage: `url(${layer2})` }}
      />

      {/* Layer 3 — Fast highlights */}
      <div
        className="water-layer water-highlights"
        style={{ backgroundImage: `url(${layer3})` }}
      />

      {/* Cinematic vignette */}
      <div className="water-vignette" />

      {/* Fade in from black on first render */}
      <div className="water-fade-in" />
    </div>
  );
}