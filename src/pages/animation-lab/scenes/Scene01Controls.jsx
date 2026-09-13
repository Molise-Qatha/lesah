import React from 'react';

export default function Scene01Controls({
  // Debug
  debugMode, setDebugMode,
  // Timeline
  timelineKeyframes, currentTime, timelineDuration, setTimelineDuration,
  play, pause, stop, addKeyframe, selectKeyframe, deleteKeyframe,
  // Recording
  isRecording, startRecording, stopRecording,
  // Camera
  unlimitedMode, setUnlimitedMode,
  nudgeCamera, nudgeCameraForward, resetCamera,
  cameraSpeed, setCameraSpeed,
  // Background
  backgroundScale, setBackgroundScale,
  // Layers
  layerVisibility, setLayerVisibility,
  // Grass
  grassEnabled, setGrassEnabled,
  grassWindSpeed, setGrassWindSpeed,
  grassPositions, selectedGrassIdx, setSelectedGrassIdx,
  nudgeGrass, nudgeGrassSize, resetGrassPositions,
  // Butterflies
  butterflyEnabled, setButterflyEnabled,
  butterflyCount, setButterflyCount,
  butterflySpeed, setButterflySpeed,
  // Character select + mode
  selectedCharacter, setSelectedCharacter,
  selectMode, setSelectMode,
  // Character move/scale
  nudgeCharacter, nudgeScale, nudgeMouthScale,
  // Outlines & locks
  showSelectionOutline, setShowSelectionOutline,
  showMouthOutline, setShowMouthOutline,
  lockKopanangPos, setLockKopanangPos,
  lockLeratoPos, setLockLeratoPos,
  // Reset positions
  resetKopanangPos, resetLeratoPos,
  // Lip sync
  kopanangAudioUrl, leratoAudioUrl,
  handleAudioUpload, playAudioForCharacter, stopAudio,
  audioPlaying,
  // Poses
  KOPANANG_SIT, LERATO_SIT,
  selectedKopanangPose, setSelectedKopanangPose,
  selectedLeratoPose, setSelectedLeratoPose,
  // Manual talking
  kopanangTalking, setKopanangTalking,
  leratoTalking, setLeratoTalking,
  // Mouth position
  kopanangMouthPos, leratoMouthPos,
  nudgeMouth, resetMouth,
}) {
  return (
    <div className="camera-controls">
      <div className="camera-controls-header">
        <h3>Scene Editor</h3>
        <button
          className={`debug-toggle ${debugMode ? 'active' : ''}`}
          onClick={() => setDebugMode(!debugMode)}
        >
          🐛 Toggle Controls
        </button>
      </div>

      {/* Timeline */}
      <div className="timeline-panel">
        <h3>🎬 Timeline</h3>
        <div className="timeline-controls">
          <button className="test-btn" onClick={play} disabled={isPlaying || timelineKeyframes.length === 0}>▶ Play</button>
          <button className="test-btn" onClick={pause} disabled={!isPlaying}>⏸ Pause</button>
          <button className="test-btn" onClick={stop}>⏹ Stop</button>
          <button className="test-btn" onClick={addKeyframe}>➕ Add Keyframe @ {currentTime.toFixed(2)}s</button>
        </div>
        <div className="timeline-duration">
          <label>Duration: </label>
          <input
            type="range" min="1" max="60" step="0.5"
            value={timelineDuration}
            onChange={(e) => setTimelineDuration(Number(e.target.value))}
          />
          <span>{timelineDuration}s</span>
        </div>
        <div className="timeline-tracks">
          <div className="timeline-bar" style={{ width: '100%', background: '#333', height: '20px', position: 'relative' }}>
            <div
              className="playhead"
              style={{
                left: `${(currentTime / timelineDuration) * 100}%`,
                position: 'absolute', top: '-5px', width: '2px', height: '30px', background: '#ffd700',
              }}
            />
            {timelineKeyframes.map((kf) => (
              <div
                key={kf.id}
                className="keyframe-marker"
                style={{
                  left: `${(kf.time / timelineDuration) * 100}%`,
                  position: 'absolute', top: 0, width: '8px', height: '20px', background: '#e94560', cursor: 'pointer',
                }}
                onClick={() => selectKeyframe(kf)}
              />
            ))}
          </div>
        </div>
        <div className="keyframe-list">
          {timelineKeyframes.map((kf) => (
            <div key={kf.id} className="keyframe-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="test-btn" onClick={() => selectKeyframe(kf)}>@{kf.time.toFixed(2)}s</button>
              <button className="test-btn delete-btn" onClick={() => deleteKeyframe(kf.id)}>🗑️</button>
            </div>
          ))}
          {timelineKeyframes.length === 0 && <p>No keyframes yet.</p>}
        </div>
      </div>

      {/* Unlimited + Record */}
      <div className="unlimited-mode-section">
        <div className="unlimited-mode-toggle">
          <label>
            <input type="checkbox" checked={unlimitedMode} onChange={() => setUnlimitedMode(!unlimitedMode)} />
            <span className="unlimited-label">🔓 Camera Unlimited</span>
          </label>
        </div>
        <div className="record-section">
          {!isRecording
            ? <button className="record-btn" onClick={startRecording}>🎥 Record Scene</button>
            : <button className="record-btn recording" onClick={stopRecording}>⏹️ Stop Recording</button>}
        </div>
      </div>

      {/* Grass */}
      <div className="character-controls">
        <h4>🌿 Grass</h4>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={grassEnabled} onChange={() => setGrassEnabled(!grassEnabled)} />
          <span className="asset-toggle-label">Enable Grass</span>
        </label>
        <div className="slider-row">
          <label>Wind Speed:</label>
          <input type="range" min="0.5" max="10" step="0.5" value={grassWindSpeed} onChange={(e) => setGrassWindSpeed(Number(e.target.value))} />
          <span>{grassWindSpeed}</span>
        </div>
        <p className="movement-hint">Selected Grass: <strong>#{selectedGrassIdx + 1}</strong></p>
        <div className="pose-buttons">
          {grassPositions.map((_, idx) => (
            <button key={idx} className={`test-btn ${selectedGrassIdx === idx ? 'active' : ''}`} onClick={() => setSelectedGrassIdx(idx)}>
              {idx + 1}
            </button>
          ))}
        </div>
        <h4>📍 Grass Position</h4>
        <div className="nudge-buttons">
          <button className="nudge-btn" onClick={() => nudgeGrass('y', -1)}>↑</button>
          <button className="nudge-btn" onClick={() => nudgeGrass('x', -1)}>←</button>
          <button className="nudge-btn" onClick={() => nudgeGrass('x', 1)}>→</button>
          <button className="nudge-btn" onClick={() => nudgeGrass('y', 1)}>↓</button>
        </div>
        <h4>🔍 Grass Size</h4>
        <div className="nudge-buttons">
          <button className="nudge-btn" onClick={() => nudgeGrassSize(-1)}>−</button>
          <button className="nudge-btn" onClick={() => nudgeGrassSize(1)}>+</button>
        </div>
        <button className="test-btn" onClick={resetGrassPositions}>Reset All Grass</button>
      </div>

      {/* Butterflies */}
      <div className="character-controls">
        <h4>🦋 Butterflies</h4>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={butterflyEnabled} onChange={() => setButterflyEnabled(!butterflyEnabled)} />
          <span className="asset-toggle-label">Enable Butterflies</span>
        </label>
        <div className="slider-row">
          <label>Count:</label>
          <input type="range" min="1" max="10" step="1" value={butterflyCount} onChange={(e) => setButterflyCount(Number(e.target.value))} />
          <span>{butterflyCount}</span>
        </div>
        <div className="slider-row">
          <label>Speed:</label>
          <input type="range" min="0.5" max="6" step="0.5" value={butterflySpeed} onChange={(e) => setButterflySpeed(Number(e.target.value))} />
          <span>{butterflySpeed}</span>
        </div>
      </div>

      {/* Background */}
      <div className="background-controls">
        <strong>🌄 Background</strong>
        <div className="slider-row">
          <label>Scale:</label>
          <input type="range" min="0.5" max="2" step="0.1" value={backgroundScale} onChange={(e) => setBackgroundScale(Number(e.target.value))} />
          <span>{backgroundScale.toFixed(1)}x</span>
        </div>
      </div>

      {/* Layers */}
      <div className="asset-visibility-panel">
        <strong>🎨 Layers</strong>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={layerVisibility.background} onChange={() => setLayerVisibility((p) => ({ ...p, background: !p.background }))} />
          <span className="asset-toggle-label">Background</span>
        </label>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={layerVisibility.kopanang} onChange={() => setLayerVisibility((p) => ({ ...p, kopanang: !p.kopanang }))} />
          <span className="asset-toggle-label">Kopanang</span>
        </label>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={layerVisibility.lerato} onChange={() => setLayerVisibility((p) => ({ ...p, lerato: !p.lerato }))} />
          <span className="asset-toggle-label">Lerato</span>
        </label>
      </div>

      {/* Character + Mouth */}
      <div className="character-controls">
        <h4>Select Character</h4>
        <div className="pose-buttons">
          <button className={`test-btn ${selectedCharacter === 'kopanang' ? 'active' : ''}`} onClick={() => setSelectedCharacter('kopanang')}>Kopanang</button>
          <button className={`test-btn ${selectedCharacter === 'lerato' ? 'active' : ''}`} onClick={() => setSelectedCharacter('lerato')}>Lerato</button>
        </div>
        <h4>Select Mode</h4>
        <div className="pose-buttons">
          <button className={`test-btn ${selectMode === 'character' ? 'active' : ''}`} onClick={() => setSelectMode('character')}>🗣️ Character</button>
          <button className={`test-btn ${selectMode === 'mouth' ? 'active' : ''}`} onClick={() => setSelectMode('mouth')}>👄 Mouth</button>
        </div>
        <h4>🎥 Camera</h4>
        <div className="nudge-buttons">
          <button className="nudge-btn" onClick={() => nudgeCamera('y', -1)}>↑</button>
          <button className="nudge-btn" onClick={() => nudgeCamera('x', -1)}>←</button>
          <button className="nudge-btn" onClick={() => nudgeCamera('x', 1)}>→</button>
          <button className="nudge-btn" onClick={() => nudgeCamera('y', 1)}>↓</button>
        </div>
        <div className="nudge-buttons">
          <button className="nudge-btn" onClick={() => nudgeCameraForward(-1)}>− Zoom</button>
          <button className="nudge-btn" onClick={() => nudgeCameraForward(1)}>+ Zoom</button>
        </div>
        <h4>🎯 Move Character</h4>
        <div className="nudge-buttons">
          <button className="nudge-btn" onClick={() => nudgeCharacter('y', -1)}>↑</button>
          <button className="nudge-btn" onClick={() => nudgeCharacter('x', -1)}>←</button>
          <button className="nudge-btn" onClick={() => nudgeCharacter('x', 1)}>→</button>
          <button className="nudge-btn" onClick={() => nudgeCharacter('y', 1)}>↓</button>
        </div>
        <h4>🔍 Character Scale</h4>
        <div className="nudge-buttons">
          <button className="nudge-btn" onClick={() => nudgeScale(-1)}>−</button>
          <button className="nudge-btn" onClick={() => nudgeScale(1)}>+</button>
        </div>
        <h4>👄 Mouth Scale</h4>
        <div className="nudge-buttons">
          <button className="nudge-btn" onClick={() => nudgeMouthScale(selectedCharacter, -1)}>−</button>
          <button className="nudge-btn" onClick={() => nudgeMouthScale(selectedCharacter, 1)}>+</button>
        </div>
        <h4>🎨 Outline</h4>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={showSelectionOutline} onChange={() => setShowSelectionOutline(!showSelectionOutline)} />
          <span className="asset-toggle-label">Character Outline</span>
        </label>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={showMouthOutline} onChange={() => setShowMouthOutline(!showMouthOutline)} />
          <span className="asset-toggle-label">Mouth Outline</span>
        </label>
        <h4>🔒 Lock Position</h4>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={lockKopanangPos} onChange={() => setLockKopanangPos(!lockKopanangPos)} />
          <span className="asset-toggle-label">Lock Kopanang</span>
        </label>
        <label className="asset-toggle-item">
          <input type="checkbox" checked={lockLeratoPos} onChange={() => setLockLeratoPos(!lockLeratoPos)} />
          <span className="asset-toggle-label">Lock Lerato</span>
        </label>
        <div className="pose-buttons">
          <button className="test-btn" onClick={resetKopanangPos}>Reset Kopanang</button>
          <button className="test-btn" onClick={resetLeratoPos}>Reset Lerato</button>
          <button className="test-btn" onClick={resetCamera}>Reset Camera</button>
        </div>
      </div>

      {/* Lip Sync */}
      <div className="character-controls">
        <h4>🎙️ Lip Sync Audio</h4>
        <div className="audio-upload">
          <input type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e, 'kopanang')} className="audio-file-input" id="kopanang-audio" />
          <label htmlFor="kopanang-audio" className="audio-upload-label">Kopanang Audio</label>
        </div>
        <div className="audio-upload">
          <input type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e, 'lerato')} className="audio-file-input" id="lerato-audio" />
          <label htmlFor="lerato-audio" className="audio-upload-label">Lerato Audio</label>
        </div>
        <div className="pose-buttons">
          <button className="test-btn" onClick={() => playAudioForCharacter('kopanang')} disabled={!kopanangAudioUrl}>▶ Kopanang</button>
          <button className="test-btn" onClick={() => playAudioForCharacter('lerato')} disabled={!leratoAudioUrl}>▶ Lerato</button>
          <button className="test-btn" onClick={stopAudio} disabled={!audioPlaying}>⏹ Stop</button>
        </div>
      </div>

      {/* Poses */}
      {debugMode && (
        <div className="character-controls">
          <h4>Kopanang Poses</h4>
          <div className="pose-buttons">
            {KOPANANG_SIT.map((p) => (
              <button key={p.id} className={`test-btn ${selectedKopanangPose === p.id ? 'active' : ''}`} onClick={() => setSelectedKopanangPose(p.id)}>{p.label}</button>
            ))}
          </div>
          <h4>Lerato Poses</h4>
          <div className="pose-buttons">
            {LERATO_SIT.map((p) => (
              <button key={p.id} className={`test-btn ${selectedLeratoPose === p.id ? 'active' : ''}`} onClick={() => setSelectedLeratoPose(p.id)}>{p.label}</button>
            ))}
          </div>
          <h4>Manual Talking</h4>
          <button className={`test-btn ${kopanangTalking ? 'active' : ''}`} onClick={() => setKopanangTalking(!kopanangTalking)}>
            {kopanangTalking ? '⏹ Stop Kopanang' : '🗣️ Talk Kopanang'}
          </button>
          <button className={`test-btn ${leratoTalking ? 'active' : ''}`} onClick={() => setLeratoTalking(!leratoTalking)}>
            {leratoTalking ? '⏹ Stop Lerato' : '🗣️ Talk Lerato'}
          </button>
        </div>
      )}

      {/* Mouth Position */}
      {debugMode && (
        <div className="character-controls">
          <h4>👄 Kopanang Mouth</h4>
          <div className="pose-buttons">
            <button className="test-btn" onClick={() => nudgeMouth('kopanang', 'y', -1)}>↑</button>
            <button className="test-btn" onClick={() => nudgeMouth('kopanang', 'x', -1)}>←</button>
            <button className="test-btn" onClick={() => nudgeMouth('kopanang', 'x', 1)}>→</button>
            <button className="test-btn" onClick={() => nudgeMouth('kopanang', 'y', 1)}>↓</button>
            <button className="test-btn" onClick={() => resetMouth('kopanang')}>Reset</button>
          </div>
          <span className="mouth-pos-display">X: {kopanangMouthPos.x}, Y: {kopanangMouthPos.y}</span>
          <h4>👄 Lerato Mouth</h4>
          <div className="pose-buttons">
            <button className="test-btn" onClick={() => nudgeMouth('lerato', 'y', -1)}>↑</button>
            <button className="test-btn" onClick={() => nudgeMouth('lerato', 'x', -1)}>←</button>
            <button className="test-btn" onClick={() => nudgeMouth('lerato', 'x', 1)}>→</button>
            <button className="test-btn" onClick={() => nudgeMouth('lerato', 'y', 1)}>↓</button>
            <button className="test-btn" onClick={() => resetMouth('lerato')}>Reset</button>
          </div>
          <span className="mouth-pos-display">X: {leratoMouthPos.x}, Y: {leratoMouthPos.y}</span>
        </div>
      )}

      <div className="slider-row">
        <label>Camera Speed:</label>
        <input type="range" min="0.1" max="10" step="0.1" value={cameraSpeed} onChange={(e) => setCameraSpeed(Number(e.target.value))} />
        <span>{cameraSpeed}x</span>
      </div>

      <div className="keyboard-hints">
        <p><kbd>W</kbd> Push Forward</p>
        <p><kbd>S</kbd> Pull Back</p>
        <p><kbd>A</kbd> Left</p>
        <p><kbd>D</kbd> Right</p>
      </div>
    </div>
  );
}