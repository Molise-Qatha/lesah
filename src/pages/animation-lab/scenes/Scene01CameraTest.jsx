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

// Scene layer configuration
// scaleSpeed controls how fast each layer grows during zoom
const SCENE_LAYERS = [
  {
    id: 'sky',
    name: 'Sky',
    src: skyImg,
    depth: 0.05,
    baseScale: 1.0,
    zIndex: 1,
    visible: true,
    scaleSpeed: 0.05, // Barely grows — extremely far
  },
  {
    id: 'mountains',
    name: 'Mountains',
    src: mountainsImg,
    depth: 0.1,
    baseScale: 1.0,
    zIndex: 2,
    visible: true,
    scaleSpeed: 0.1, // Very slow growth
  },
  {
    id: 'distant_forest',
    name: 'Distant Forest',
    src: forestImg,
    depth: 0.2,
    baseScale: 1.0,
    zIndex: 3,
    visible: true,
    scaleSpeed: 0.2, // Slow growth
  },
  {
    id: 'clearing',
    name: 'Clearing',
    src: clearingImg,
    depth: 0.4,
    baseScale: 1.0,
    zIndex: 4,
    visible: true,
    scaleSpeed: 0.4, // Moderate growth
  },
  {
    id: 'landmark_tree',
    name: 'Landmark Tree',
    src: landmarkImg,
    depth: 0.65,
    baseScale: 1.0,
    zIndex: 5,
    visible: true,
    scaleSpeed: 0.8, // Noticeable growth
  },
  {
    id: 'near_tree_01',
    name: 'Near Tree 01',
    src: nearTree01Img,
    depth: 0.85,
    baseScale: 1.15,
    zIndex: 6,
    visible: true,
    scaleSpeed: 1.5, // Fast growth
  },
  {
    id: 'near_tree_02',
    name: 'Near Tree 02',
    src: nearTree02Img,
    depth: 1.0,
    baseScale: 1.25,
    zIndex: 7,
    visible: true,
    scaleSpeed: 2.0, // Fastest growth — closest to camera
  },
];

// Camera zoom configuration
const CAMERA_ZOOM = {
  startZoom: 0,     // Start at no zoom
  endZoom: 100,     // Full zoom-in value
  duration: 14000,  // 14 seconds cinematic
  easeInDuration: 0.20,   // 20% ease-in
  easeOutDuration: 0.35,  // 35% ease-out (slow stop)
};

function Scene01CameraTest() {
  // Camera state — single zoom variable drives everything
  const [camera, setCamera] = useState({
    zoom: CAMERA_ZOOM.startZoom, // 0 to 100
    x: 0, // Manual pan X
    y: 0, // Manual pan Y
  });

  const [debugMode, setDebugMode] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), {})
  );

  const [autoPlay, setAutoPlay] = useState(false);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  
  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});
  const autoPlayStartTime = useRef(null);
  const autoPlayFrameRef = useRef(null);

  // Cinematic easing
  const cinematicEase = useCallback((t) => {
    const clampedT = Math.max(0, Math.min(1, t));
    
    // Ease-in phase
    if (clampedT < CAMERA_ZOOM.easeInDuration) {
      const phaseT = clampedT / CAMERA_ZOOM.easeInDuration;
      return 0.5 * phaseT * phaseT;
    }
    
    // Ease-out phase
    if (clampedT > 1 - CAMERA_ZOOM.easeOutDuration) {
      const phaseT = (clampedT - (1 - CAMERA_ZOOM.easeOutDuration)) / CAMERA_ZOOM.easeOutDuration;
      return 1 - 0.5 * (1 - phaseT) * (1 - phaseT);
    }
    
    // Middle — smooth linear
    const midStart = CAMERA_ZOOM.easeInDuration;
    const midEnd = 1 - CAMERA_ZOOM.easeOutDuration;
    const midProgress = (clampedT - midStart) / (midEnd - midStart);
    
    const easeInValue = 0.5 * midStart * midStart;
    const easeOutTarget = 1 - 0.5 * CAMERA_ZOOM.easeOutDuration * CAMERA_ZOOM.easeOutDuration;
    
    return easeInValue + midProgress * (easeOutTarget - easeInValue);
  }, []);

  // PURE SCALE-BASED TRANSFORM
  // Each layer scales at its own speed based on depth
  const getLayerTransform = useCallback((layer) => {
    // Zoom progress: 0 to 1
    const zoomProgress = camera.zoom / CAMERA_ZOOM.endZoom;
    
    // Scale = baseScale + (zoomProgress * scaleSpeed)
    // Foreground grows fast, background grows slow
    const scale = layer.baseScale + (zoomProgress * layer.scaleSpeed);
    
    // Minimal parallax from manual pan — preserves existing left/right movement
    const parallaxX = camera.x * layer.depth;
    const parallaxY = camera.y * layer.depth * 0.5;
    
    return {
      transform: `translate(${parallaxX}px, ${parallaxY}px) scale(${scale})`,
      opacity: 1,
      transformOrigin: 'center center',
    };
  }, [camera]);

  // Manual controls
  const handleKeyDown = useCallback((e) => {
    keysPressed.current[e.key.toLowerCase()] = true;
    if (e.key === 'ArrowUp') keysPressed.current['w'] = true;
    if (e.key === 'ArrowDown') keysPressed.current['s'] = true;
    if (e.key === 'ArrowLeft') keysPressed.current['a'] = true;
    if (e.key === 'ArrowRight') keysPressed.current['d'] = true;
  }, []);

  const handleKeyUp = useCallback((e) => {
    keysPressed.current[e.key.toLowerCase()] = false;
    if (e.key === 'ArrowUp') keysPressed.current['w'] = false;
    if (e.key === 'ArrowDown') keysPressed.current['s'] = false;
    if (e.key === 'ArrowLeft') keysPressed.current['a'] = false;
    if (e.key === 'ArrowRight') keysPressed.current['d'] = false;
  }, []);

  // Manual camera loop
  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = 0.6 * cameraSpeed;
      
      if (keysPressed.current['w']) {
        setCamera(prev => ({ ...prev, zoom: Math.min(prev.zoom + speed, CAMERA_ZOOM.endZoom) }));
      }
      if (keysPressed.current['s']) {
        setCamera(prev => ({ ...prev, zoom: Math.max(prev.zoom - speed, CAMERA_ZOOM.startZoom) }));
      }
      if (keysPressed.current['a']) {
        setCamera(prev => ({ ...prev, x: prev.x - speed * 0.5 }));
      }
      if (keysPressed.current['d']) {
        setCamera(prev => ({ ...prev, x: prev.x + speed * 0.5 }));
      }
      
      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraSpeed]);

  // Auto-play cinematic zoom
  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;
      const rawProgress = Math.min(elapsed / CAMERA_ZOOM.duration, 1);
      
      const easedProgress = cinematicEase(rawProgress);
      
      const zoom = CAMERA_ZOOM.startZoom + 
        (CAMERA_ZOOM.endZoom - CAMERA_ZOOM.startZoom) * easedProgress;
      
      // Subtle natural sway
      const x = Math.sin(easedProgress * Math.PI * 2) * 8;
      const y = Math.sin(easedProgress * Math.PI * 3) * 3;
      
      setCamera({ zoom, x, y });
      
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

  // Reset
  const resetCamera = () => {
    setCamera({ zoom: CAMERA_ZOOM.startZoom, x: 0, y: 0 });
  };

  // Toggle layer
  const toggleLayer = (layerId) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="scene01-page">
      <div className="scene01-container">
        <Link to="/animation-lab" className="back-link">← Back to Animation Lab</Link>
        
        <div className="scene-header">
          <h1>🎥 Scene 01 Camera Test</h1>
          <p className="scene-subtitle">Scale-Based Zoom — Forest Opening Shot</p>
          <span className="test-badge">CAMERA TEST</span>
        </div>

        {/* Scene Viewport */}
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
                      <span>Scale Speed: {layer.scaleSpeed}</span>
                      <span>Current Scale: {(layer.baseScale + (camera.zoom / CAMERA_ZOOM.endZoom) * layer.scaleSpeed).toFixed(2)}x</span>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Camera Controls */}
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
              <span>{camera.zoom.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>Progress:</label>
              <span>{((camera.zoom / CAMERA_ZOOM.endZoom) * 100).toFixed(0)}%</span>
            </div>
            <div className="camera-stat">
              <label>X:</label>
              <span>{camera.x.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>Y:</label>
              <span>{camera.y.toFixed(1)}</span>
            </div>
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
          
          <div className="slider-row">
            <label>Speed:</label>
            <input 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.1" 
              value={cameraSpeed} 
              onChange={(e) => setCameraSpeed(Number(e.target.value))} 
            />
            <span>{cameraSpeed}x</span>
          </div>
          
          <div className="keyboard-hints">
            <p><kbd>W</kbd> Zoom In</p>
            <p><kbd>S</kbd> Zoom Out</p>
            <p><kbd>A</kbd> Left</p>
            <p><kbd>D</kbd> Right</p>
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
                  <span className="scale-speed">Scale: {layer.scaleSpeed}x</span>
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