import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Scene01CameraTest.css';

// Import scene assets
import skyImg from '../../../assets/scene01/scene01_sky.png';
import mountainsImg from '../../../assets/scene01/scene01_distant_mountains.png';
import forestImg from '../../../assets/scene01/scene01_distant_forest.png';
import clearingImg from '../../../assets/scene01/scene01_clearing.png';
import landmarkImg from '../../../assets/scene01/scene01_tree_landmark.png';
import nearTree01Img from '../../../assets/scene01/scene01_tree_near_01.png';
import nearTree02Img from '../../../assets/scene01/scene01_tree_near_02.png';

// 🛠️ TRULY SIMPLE LAYER CONFIG: Only scaling, no crazy forward/slide math
const SCENE_LAYERS = [
  {
    id: 'sky',
    name: 'Sky',
    src: skyImg,
    zIndex: 1,
    visible: true,
    scaleRange: { start: 1.0, end: 1.2 }, // Stays almost still
  },
  {
    id: 'mountains',
    name: 'Mountains',
    src: mountainsImg,
    zIndex: 2,
    visible: true,
    scaleRange: { start: 1.0, end: 1.35 },
  },
  {
    id: 'distant_forest',
    name: 'Distant Forest',
    src: forestImg,
    zIndex: 3,
    visible: true,
    scaleRange: { start: 1.0, end: 1.7 },
  },
  {
    id: 'clearing',
    name: 'Clearing',
    src: clearingImg,
    zIndex: 4,
    visible: true,
    scaleRange: { start: 1.0, end: 2.2 },
  },
  {
    id: 'landmark_tree',
    name: 'Landmark Tree',
    src: landmarkImg,
    zIndex: 5,
    visible: true,
    scaleRange: { start: 1.0, end: 3.0 },
  },
  {
    id: 'near_tree_01',
    name: 'Near Tree 01',
    src: nearTree01Img,
    zIndex: 6,
    visible: true,
    scaleRange: { start: 1.0, end: 4.0 },
  },
  {
    id: 'near_tree_02',
    name: 'Near Tree 02',
    src: nearTree02Img,
    zIndex: 7,
    visible: true,
    scaleRange: { start: 1.0, end: 5.0 },
  },
];

// 🛠️ TRUE CAMERA PATH: Starting at 1.0 and zooming all the way to 2.5
const CAMERA_PATH = {
  startZoom: 1.0,
  endZoom: 2.5,
  duration: 12000, // 12 seconds
  easeInDuration: 0.20,
  easeOutDuration: 0.35,
};

function Scene01CameraTest() {
  const [camera, setCamera] = useState({
    zoom: CAMERA_PATH.startZoom,
  });

  const [debugMode, setDebugMode] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), {})
  );

  const [autoPlay, setAutoPlay] = useState(false);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  
  const animationFrameRef = useRef(null);
  const autoPlayStartTime = useRef(null);
  const autoPlayFrameRef = useRef(null);

  const cinematicEase = useCallback((t) => {
    const clampedT = Math.max(0, Math.min(1, t));
    if (clampedT < CAMERA_PATH.easeInDuration) {
      const phaseT = clampedT / CAMERA_PATH.easeInDuration;
      return 0.5 * phaseT * phaseT;
    }
    if (clampedT > 1 - CAMERA_PATH.easeOutDuration) {
      const phaseT = (clampedT - (1 - CAMERA_PATH.easeOutDuration)) / CAMERA_PATH.easeOutDuration;
      return 1 - 0.5 * (1 - phaseT) * (1 - phaseT);
    }
    const midStart = CAMERA_PATH.easeInDuration;
    const midEnd = 1 - CAMERA_PATH.easeOutDuration;
    const midProgress = (clampedT - midStart) / (midEnd - midStart);
    return midProgress;
  }, []);

  // 🛠️ LAYER LOGIC: Simple linear interpolation between scaleRange.start and scaleRange.end
  const getLayerTransform = useCallback((layer) => {
    const progress = (camera.zoom - 1.0) / (2.5 - 1.0); // How far along are we from 1.0 to 2.5?
    const scale = layer.scaleRange.start + (layer.scaleRange.end - layer.scaleRange.start) * progress;
    
    return {
      transform: `scale(${scale})`,
      opacity: 1,
    };
  }, [camera]);

  const handleZoomIn = () => {
    setCamera(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 2.5) }));
  };

  const handleZoomOut = () => {
    setCamera(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 1.0) }));
  };

  const resetCamera = () => {
    setCamera({ zoom: CAMERA_PATH.startZoom });
  };

  // 🛠️ PERFECT AUTO PLAY: Just zooms from 1.0 to 2.5, no weird camera movement
  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / CAMERA_PATH.duration, 1);
      const easedProgress = cinematicEase(rawProgress);
      
      const zoom = CAMERA_PATH.startZoom + 
        (CAMERA_PATH.endZoom - CAMERA_PATH.startZoom) * easedProgress;
      
      setCamera({ zoom });
      
      if (rawProgress < 1) {
        autoPlayFrameRef.current = requestAnimationFrame(animateCamera);
      } else {
        setAutoPlay(false);
      }
    };
    
    autoPlayFrameRef.current = requestAnimationFrame(animateCamera);
    
    return () => {
      if (autoPlayFrameRef.current) {
        cancelAnimationFrame(autoPlayFrameRef.current);
      }
    };
  }, [autoPlay, cinematicEase]);

  const toggleLayer = (layerId) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  return (
    <div className="scene01-page">
      <div className="scene01-container">
        <Link to="/animation-lab" className="back-link">← Back to Animation Lab</Link>
        
        <div className="scene-header">
          <h1>🎥 Scene 01 Camera Test</h1>
          <p className="scene-subtitle">Pure Depth Zoom Camera — Forest Opening Shot</p>
          <span className="test-badge">CAMERA TEST</span>
        </div>

        <div className="scene-viewport">
          <div className="scene-stage">
            {SCENE_LAYERS.map(layer => (
              layerVisibility[layer.id] && (
                <div
                  key={layer.id}
                  className="scene-layer"
                  style={{
                    zIndex: layer.zIndex,
                    ...getLayerTransform(layer),
                  }}
                >
                  <img
                    src={layer.src}
                    alt={layer.name}
                    className="scene-layer-img"
                    draggable={false}
                  />
                  
                  {debugMode && (
                    <div className="layer-debug-info">
                      <span>{layer.name}</span>
                      <span>Depth: {layer.depth}</span>
                      <span>Type: {layer.layerType || 'background'}</span>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        <div className="camera-controls">
          <div className="camera-controls-header">
            <h3>Camera Controls</h3>
            <button 
              className={`debug-toggle ${debugMode ? 'active' : ''}`}
              onClick={() => setDebugMode(!debugMode)}
            >
              🐛 Debug
            </button>
          </div>
          
          <div className="camera-info">
            <div className="camera-stat">
              <label>Zoom:</label>
              <span>{camera.zoom.toFixed(2)}x</span>
            </div>
          </div>

          <div className="camera-buttons">
            <button className="camera-btn zoom-btn" onClick={handleZoomIn}>🔍 Zoom In</button>
            <button className="camera-btn zoom-btn" onClick={handleZoomOut}>🔍 Zoom Out</button>
          </div>
          
          <div className="camera-buttons">
            <button 
              className={`camera-btn ${autoPlay ? 'active' : ''}`}
              onClick={() => {
                setAutoPlay(!autoPlay);
                if (!autoPlay) resetCamera();
              }}
            >
              {autoPlay ? '⏸ Stop Auto' : '▶ Play Cinematic'}
            </button>
            <button className="camera-btn" onClick={resetCamera}>
              🔄 Reset
            </button>
          </div>
          
          <div className="keyboard-hints">
            <p><kbd>🔍</kbd> Zoom In/Out Buttons</p>
            <p><kbd>▶</kbd> Cinematic Play</p>
          </div>
          
          {debugMode && (
            <div className="debug-layers">
              <h4>Layer Visibility</h4>
              {SCENE_LAYERS.map(layer => (
                <label key={layer.id} className="layer-toggle">
                  <input
                    type="checkbox"
                    checked={layerVisibility[layer.id]}
                    onChange={() => toggleLayer(layer.id)}
                  />
                  <span>{layerVisibility[layer.id] ? '✓' : '✗'} {layer.name}</span>
                  <span className="depth-value">({layer.depth})</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Scene01CameraTest;