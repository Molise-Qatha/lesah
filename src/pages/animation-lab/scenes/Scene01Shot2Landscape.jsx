import React from 'react';
import './Scene01Shot2Landscape.css';

import backgroundImg from '../../../assets/scene01/background.png';

export default function Scene01Shot2Landscape() {
  return (
    <div className="shot2-landscape">
      <div
        className="landscape-pan"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      />
      <div className="landscape-vignette" />
      <div className="landscape-fade-in" />
    </div>
  );
}