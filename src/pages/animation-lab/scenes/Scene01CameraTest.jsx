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

// Scene layer configuration (Shot 1 locked in)
const SCENE_LAYERS = [
  { id: 'sky', name: 'Sky', src: skyImg, depth: 0.05, baseScale: 1.0, zIndex: 1, visible: true, slideOutX: 0, layerType: 'background' },
  { id: 'mountains', name: 'Mountains', src: mountainsImg, depth: 0.1, baseScale: 1.0, zIndex: 2, visible: true, slideOutX: 0, layerType: 'background' },
  // 🛠️ FIX: We are making the Distant Forest slide out in Shot 2
  { id: 'distant_forest', name: 'Distant Forest', src: forestImg, depth: 0.2, baseScale: 1.0, zIndex: 3, visible: true, slideOutX: -3000, slideOutStart: 50, slideOutEnd: 90, layerType: 'background' },
  { id: 'clearing', name: 'Clearing', src: clearingImg, depth: 0.4, baseScale: 1.0, zIndex: 4, visible: true, slideOutX: 0, layerType: 'floor', floorDropY: 400 },
  { id: 'landmark_tree', name: 'Landmark Tree', src: landmarkImg, depth: 0.65, baseScale: 1.0, zIndex: 5, visible: true, slideOutX: -3000, slideOutStart: 50, slideOutEnd: 90, layerType: 'background' },
  { id: 'near_tree_01', name: 'Near Tree 01', src: nearTree01Img, depth: 0.85, baseScale: 1.10, zIndex: 6, visible: true, slideOutX: -4000, slideOutStart: 40, slideOutEnd: 80, layerType: 'background' },
  { id: 'near_tree_02', name: 'Near Tree 02', src: nearTree02Img, depth: 1.0, baseScale: 1.20, zIndex: 7, visible: true, slideOutX: 4000, slideOutStart: 45, slideOutEnd: 85, layerType: 'background' },
];

const CAMERA_PATH = {
  start: { forward: 0, x: 0, y: 0, zoom: 1.0 },
  end: { forward: 100, x: 0, y: 0, zoom: 1.45 },
  duration: 14000,
  easeInDuration: 0.20,
  easeOutDuration: 0.35,
};

function Scene01CameraTest() {
  const [camera, setCamera] = useState({
    x: CAMERA_PATH.start.x,
    y: CAMERA_PATH.start.y,
    zoom: CAMERA_PATH.start.zoom,
    forward: CAMERA_PATH.start.forward,
  });

  const [shot2Zoom, setShot2Zoom] = useState(1.0);
  const [activeShot, setActiveShot] = useState(1);
  
  const [debugMode, setDebugMode] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), {})
  );

  const [autoPlay, setAutoPlay] = useState(false);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  
  const sceneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});
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

  // ✅ Shot 1: EXACTLY AS YOU WANT IT (100%)
  const getLayerTransform = useCallback((layer) => {
    const depthFactor = layer.depth;
    const progress = camera.forward / 100;

    const parallaxX = camera.x * depthFactor;
    const parallaxY = camera.y * depthFactor * 0.5;

    const zoomFactor = 1 + (camera.zoom - 1) * depthFactor;
    let scale = layer.baseScale * zoomFactor;

    if (layer.layerType === 'floor') {
      const floorDrop = layer.floorDropY * progress;
      return {
        transform: `translate(${parallaxX}px, ${parallaxY + floorDrop}px) scale(${scale})`,
        opacity: 1,
      };
    }

    let slideX = 0;
    if (layer.slideOutX !== 0 && layer.slideOutStart !== undefined) {
      const start = layer.slideOutStart;
      const end = layer.slideOutEnd;

      if (camera.forward > start) {
        const slideProgress = Math.min((camera.forward - start) / (end - start), 1);
        const eased = slideProgress < 0.5 
          ? 2 * slideProgress * slideProgress 
          : 1 - Math.pow(-2 * slideProgress + 2, 2) / 2;
        slideX = layer.slideOutX * eased;
      }
    }

    return {
      transform: `translate(${parallaxX + slideX}px, ${parallaxY}px) scale(${scale})`,
      opacity: 1,
    };
  }, [camera]);

  // ✅ Shot 2: Create true forward motion (everything flies out/past camera)
  const getLockedLayerTransform = useCallback((layer) => {
    const depthFactor = layer.depth;
    const scale = layer.baseScale * (1 + (shot2Zoom - 1) * depthFactor);
    
    // 🛠️ FULL SLIDE: All layers with slideOutX move completely off screen in Shot 2
    let slideX = 0;
    if (layer.slideOutX !== 0) {
      slideX = layer.slideOutX; 
    }

    if (layer.layerType === 'floor') {
      const floorDrop = layer.floorDropY * shot2Zoom; 
      return {
        transform: `translate(0px, ${floorDrop}px) scale(${scale})`,
        opacity: 1,
      };
    }

    return {
      transform: `translate(${slideX}px, 0px) scale(${scale})`,
      opacity: 1,
    };
  }, [shot2Zoom]);

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

  // Manual camera loop (Shot 1 only)
  useEffect(() => {
    const handleKeyFrame = () => {
      if (activeShot !== 1) return;
      
      const speed = 0.4 * cameraSpeed;
      
      if (keysPressed.current['w']) {
        setCamera(prev => ({ ...prev, forward: Math.min(prev.forward + speed, 100) }));
      }
      if (keysPressed.current['s']) {
        setCamera(prev => ({ ...prev, forward: Math.max(prev.forward - speed, 0) }));
      }
      if (keysPressed.current['a']) {
        setCamera(prev => ({ ...prev, x: prev.x - speed }));
      }
      if (keysPressed.current['d']) {
        setCamera(prev => ({ ...prev, x: prev.x + speed }));
      }
      
      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraSpeed, activeShot]);

  // Auto-play: Shot 1 (Push In) -> Shot 2 (Zoom with flat ground)
  useEffect(() => {
    if (!autoPlay) return;
    
    autoPlayStartTime.current = Date.now();
    const shot1Duration = CAMERA_PATH.duration;
    
    const animateSequence = () => {
      const elapsed = Date.now() - autoPlayStartTime.current;

      // Shot 1
      if (elapsed < shot1Duration) {
        setActiveShot(1);
        const rawProgress = Math.min(elapsed / shot1Duration, 1);
        const easedProgress = cinematicEase(rawProgress);
        
        setCamera({
          forward: easedProgress * 100,
          x: 0, y: 0,
          zoom: 1.45 * easedProgress, 
        });
      } 
      // Shot 2 (CUT AND ZOOM)
      else {
        setActiveShot(2);
        const shot2Progress = Math.min((elapsed - shot1Duration) / 10, 1); // 10 seconds
        
        const easedShot2 = shot2Progress < 0.5 
          ? 2 * shot2Progress * shot2Progress 
          : 1 - Math.pow(-2 * shot2Progress + 2, 2) / 2;
        
        // Shot 2 goes from 1.0 to 2.0x
        setShot2Zoom(1.0 + (easedShot2 * 1.0)); 
      }
      
      if (elapsed < shot1Duration + 10000) {
        autoPlayFrameRef.current = requestAnimationFrame(animateSequence);
      } else {
        setAutoPlay(false);
      }
    };
    
    autoPlayFrameRef.current = requestAnimationFrame(animateSequence);
    
    return () => {
      if (autoPlayFrameRef.current) {
        cancelAnimationFrame(autoPlayFrameRef.current);
      }
    };
  }, [autoPlay, cinematicEase]);

  const handleZoomIn = () => {
    if (activeShot === 1) {
      setCamera(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 2.5) }));
    } else {
      setShot2Zoom(prev => Math.min(prev + 0.1, 2.0));
    }
  };

  const handleZoomOut = () => {
    if (activeShot === 1) {
      setCamera(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }));
    } else {
      setShot2Zoom(prev => Math.max(prev - 0.1, 1.0));
    }
  };

  const resetCamera = () => {
    setActiveShot(1);
    setCamera({
      x: CAMERA_PATH.start.x,
      y: CAMERA_PATH.start.y,
      zoom: CAMERA_PATH.start.zoom,
      forward: CAMERA_PATH.start.forward,
    });
    setShot2Zoom(1.0);
  };

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
          <p className="scene-subtitle">Cinematic Parallax Camera — Forest Opening Shot</p>
          <span className="test-badge">CAMERA TEST</span>
        </div>

        <div 
          className="scene-viewport"
          ref={sceneRef}
        >
          <div className="scene-stage">
            {SCENE_LAYERS.map(layer => (
              layerVisibility[layer.id] && (
                <div
                  key={layer.id}
                  className="scene-layer"
                  style={{
                    zIndex: layer.zIndex,
                    ...(activeShot === 1 ? getLayerTransform(layer) : getLockedLayerTransform(layer)),
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
              <label>Active Shot:</label>
              <span>{activeShot}</span>
            </div>
            <div className="camera-stat">
              <label>Forward (Shot 1):</label>
              <span>{camera.forward.toFixed(1)}</span>
            </div>
            <div className="camera-stat">
              <label>Zoom (Shot 2):</label>
              <span>{shot2Zoom.toFixed(2)}x</span>
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
            <p><kbd>W</kbd> Forward</p>
            <p><kbd>S</kbd> Backward</p>
            <p><kbd>A</kbd> Left</p>
            <p><kbd>D</kbd> Right</p>
            <p><kbd>Zoom</kbd> Buttons</p>
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