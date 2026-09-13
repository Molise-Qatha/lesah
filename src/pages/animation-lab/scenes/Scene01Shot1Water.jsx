import React from 'react';
import './Scene01Shot1Water.css';

import layer1 from '../../../assets/scene01/water/layer1.png';
import layer2 from '../../../assets/scene01/water/layer2.png';
import layer3 from '../../../assets/scene01/water/layer3.png';

export default function Scene01Shot1Water() {
  return (
    <div className="shot1-water">
      <div
        className="water-layer water-ripples"
        style={{ backgroundImage: `url(${layer1})` }}
      />
      <div
        className="water-layer water-mid"
        style={{ backgroundImage: `url(${layer2})` }}
      />
      <div
        className="water-layer water-highlights"
        style={{ backgroundImage: `url(${layer3})` }}
      />

      <div className="water-vignette" />
      <div className="water-fade-in" />
    </div>
  );
}