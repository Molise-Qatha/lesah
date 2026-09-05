import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Scene01CameraTest.css';

// Import scene assets
import skyImg from '../../../assets/scene01/scene01_sky.png';
import mountainsImg from '../../../assets/scene01/scene01_distant_mountains.png';
import forestImg from '../../../assets/scene01/scene01_distant_forest.png';
import clearingImg from '../../../assets/scene01/scene01_clearing.png';
import landmarkImg from '../../../assets/scene01/scene01_tree_landmark.png';
import nearTree01Img from '../../../assets/scene01/scene01_tree_near_01.png';
import nearTree02Img from '../../../assets/scene01/scene01_tree_near_02.png';

const SCENE_LAYERS = [
  { id: 'sky', name: 'Sky', src: skyImg, depth: 0.05, zIndex: 1, defaultVisible: true },
  { id: 'mountains', name: 'Distant Mountains', src: mountainsImg, depth: 0.1, zIndex: 2, defaultVisible: true },
  { id: 'distant_forest', name: 'Distant Forest', src: forestImg, depth: 0.2, zIndex: 3, defaultVisible: false },
  { id: 'clearing', name: 'Clearing', src: clearingImg, depth: 0.4, zIndex: 4, defaultVisible: false, isGround: true },
  { id: 'landmark_tree', name: 'Landmark Tree', src: landmarkImg, depth: 0.65, zIndex: 5, defaultVisible: false },
  { id: 'near_tree_01', name: 'Near Tree 01', src: nearTree01Img, depth: 0.85, zIndex: 6, defaultVisible: false },
  { id: 'near_tree_02', name: 'Near Tree 02', src: nearTree02Img, depth: 1.0, zIndex: 7, defaultVisible: false },
];

function Scene01CameraTest() {
  // 🛠️ MANUAL CAMERA STATE: Just X, Y, and Forward
  const [camera, setCamera] = useState({ x: 0, y: 0, forward: 0 });

  // 🛠️ LAYER SETTINGS: Individual X, Y, Scale for every layer
  const [layerPositions, setLayerPositions] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: { x: 0, y: 0, scale: 1 } }), {})
  );

  // 🛠️ NEW: Asset visibility state
  const [layerVisibility, setLayerVisibility] = useState(
    SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layer.defaultVisible }), {})
  );

  const [debugMode, setDebugMode] = useState(true);
  const [cameraSpeed, setCameraSpeed] = useState(1.0);
  const [linkScale, setLinkScale] = useState(false);

  const animationFrameRef = useRef(null);
  const keysPressed = useRef({});

  // 🛠️ CORE MATH: User controls everything
  const getLayerTransform = useCallback((layer) => {
    const depthFactor = layer.depth;
    const manualPos = layerPositions[layer.id];

    const cameraX = camera.x * depthFactor;
    const cameraY = camera.y * depthFactor * 0.5;

    const forwardProgress = camera.forward / 100;
    const forwardOffset = forwardProgress * depthFactor * 2;

    const finalX = manualPos.x + cameraX - forwardOffset;
    const finalY = manualPos.y + cameraY;
    const finalScale = manualPos.scale;

    let groundOffset = 0;
    if (layer.isGround) {
      groundOffset = forwardProgress * 300;
    }

    return {
      transform: `translate(${finalX}px, ${finalY + groundOffset}px) scale(${finalScale})`,
      opacity: 1,
      transformOrigin: 'center center',
    };
  }, [camera, layerPositions]);

  const updateLayerPosition = (layerId, axis, value) => {
    if (linkScale && axis === 'scale' && (layerId === 'mountains' || layerId === 'distant_forest')) {
      setLayerPositions(prev => ({
        ...prev,
        mountains: { ...prev.mountains, scale: value },
        distant_forest: { ...prev.distant_forest, scale: value },
      }));
    } else {
      setLayerPositions(prev => ({
        ...prev,
        [layerId]: { ...prev[layerId], [axis]: value }
      }));
    }
  };

  // 🛠️ NEW: Toggle asset visibility
  const toggleLayerVisibility = (layerId) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

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

  // Manual movement loop
  useEffect(() => {
    const handleKeyFrame = () => {
      const speed = 0.4 * cameraSpeed;
      if (keysPressed.current['w']) setCamera(prev => ({ ...prev, forward: Math.min(prev.forward + speed, 100) }));
      if (keysPressed.current['s']) setCamera(prev => ({ ...prev, forward: Math.max(prev.forward - speed, 0) }));
      if (keysPressed.current['a']) setCamera(prev => ({ ...prev, x: prev.x - speed }));
      if (keysPressed.current['d']) setCamera(prev => ({ ...prev, x: prev.x + speed }));
      animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    };
    animationFrameRef.current = requestAnimationFrame(handleKeyFrame);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [cameraSpeed]);

  const resetCamera = () => {
    setCamera({ x: 0, y: 0, forward: 0 });
    setLayerPositions(
      SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: { x: 0, y: 0, scale: 1 } }), {})
    );
    // Reset visibility to defaults
    setLayerVisibility(
      SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layer.defaultVisible }), {})
    );
  };

  // 🛠️ NEW: Show only specific layers (quick presets)
  const showOnly = (layerIds) => {
    setLayerVisibility(
      SCENE_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: layerIds.includes(layer.id) }), {})
    );
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
        
        {/* Scene Viewport */}
        <div className="scene-viewport">
          <div className="scene-stage">
            {SCENE_LAYERS.map(layer => (
              layerVisibility[layer.id] && (
                <div key={layer.id} className="scene-layer" style={{ zIndex: layer.zIndex, ...getLayerTransform(layer) }}>
                  <img src={layer.src} alt={layer.name} className="scene-layer-img" draggable={false} />
                </div>
              )
            ))}
          </div>
        </div>

        {/* 🛠️ FULL MANUAL CONTROLS */}
        <div className="camera-controls">
          <div className="camera-controls-header">
            <h3>Manual Editor</h3>
            <button className={`debug-toggle ${debugMode ? 'active' : ''}`} onClick={() => setDebugMode(!debugMode)}>
              🐛 Toggle Controls
            </button>
          </div>

          {/* 🛠️ NEW: Asset Visibility Panel */}
          <div className="asset-visibility-panel">
            <div className="asset-visibility-header">
              <strong>🎨 Asset Visibility</strong>
            </div>
            
            <div className="asset-quick-presets">
              <button onClick={() => showOnly(['sky', 'mountains'])}>🌄 Opening Shot</button>
              <button onClick={() => showOnly(['sky', 'mountains', 'distant_forest'])}>🌲 Add Forest</button>
              <button onClick={() => showOnly(['sky', 'mountains', 'distant_forest', 'clearing'])}>🏞️ Add Clearing</button>
              <button onClick={() => showOnly(['sky', 'mountains', 'distant_forest', 'clearing', 'landmark_tree'])}>🌳 Add Landmark</button>
              <button onClick={() => showOnly(['sky', 'mountains', 'distant_forest', 'clearing', 'landmark_tree', 'near_tree_01', 'near_tree_02'])}>🎬 Full Scene</button>
            </div>

            <div className="asset-list">
              {SCENE_LAYERS.map(layer => (
                <label key={layer.id} className="asset-toggle-item">
                  <input 
                    type="checkbox" 
                    checked={layerVisibility[layer.id]} 
                    onChange={() => toggleLayerVisibility(layer.id)}
                  />
                  <span className="asset-toggle-label">{layer.name}</span>
                  <span className="asset-toggle-status">
                    {layerVisibility[layer.id] ? '✅ Visible' : '👁️ Hidden'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 🛠️ Manual Camera Controls */}
          <div className="camera-stat-group">
            <strong>Camera Parallax</strong>
            <label>Camera X (Left/Right): <input type="range" min="-200" max="200" value={camera.x} onChange={(e) => setCamera(prev => ({ ...prev, x: Number(e.target.value) }))} /></label>
            <label>Camera Y (Up/Down): <input type="range" min="-200" max="200" value={camera.y} onChange={(e) => setCamera(prev => ({ ...prev, y: Number(e.target.value) }))} /></label>
            <label>Forward (Zoom Dolly): <input type="range" min="0" max="100" value={camera.forward} onChange={(e) => setCamera(prev => ({ ...prev, forward: Number(e.target.value) }))} /></label>
          </div>

          {/* 🛠️ Layer Editor */}
          {debugMode && (
            <div className="layer-editor">
              <div className="layer-editor-header">
                <strong>Layer Positions</strong>
                <label className="link-scale-label">
                  <input type="checkbox" checked={linkScale} onChange={() => setLinkScale(!linkScale)} />
                  Link Mountains + Forest Scale
                </label>
              </div>

              {SCENE_LAYERS.map(layer => (
                <div key={layer.id} className="layer-editor-item">
                  <strong>{layer.name}</strong>
                  <label>X: <input type="range" min="-500" max="500" value={layerPositions[layer.id].x} onChange={(e) => updateLayerPosition(layer.id, 'x', Number(e.target.value))} /></label>
                  <label>Y: <input type="range" min="-300" max="500" value={layerPositions[layer.id].y} onChange={(e) => updateLayerPosition(layer.id, 'y', Number(e.target.value))} /></label>
                  <label>Scale: <input type="range" min="0.5" max="4" step="0.1" value={layerPositions[layer.id].scale} onChange={(e) => updateLayerPosition(layer.id, 'scale', Number(e.target.value))} /></label>
                </div>
              ))}
            </div>
          )}

          <div className="camera-buttons">
            <button className="camera-btn" onClick={resetCamera}>🔄 Reset All</button>
          </div>
          
          <div className="slider-row">
            <label>Speed:</label>
            <input type="range" min="0.1" max="3" step="0.1" value={cameraSpeed} onChange={(e) => setCameraSpeed(Number(e.target.value))} />
            <span>{cameraSpeed}x</span>
          </div>

          <div className="keyboard-hints">
            <p><kbd>W</kbd> Push Forward</p>
            <p><kbd>S</kbd> Pull Back</p>
            <p><kbd>A</kbd> Left</p>
            <p><kbd>D</kbd> Right</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scene01CameraTest;