import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './KopanangTest.css';

// Import Kopanang body assets (standardized)
import body01 from '../../assets/kopanang_body/kopanang_body_01_standardized.png';
import body02 from '../../assets/kopanang_body/kopanang_body_02_standardized.png';
import body03 from '../../assets/kopanang_body/kopanang_body_03_standardized.png';
import body04 from '../../assets/kopanang_body/kopanang_body_04_standardized.png';
import body05 from '../../assets/kopanang_body/kopanang_body_05_standardized.png';

// Import face expressions (standardized)
import faceNeutral from '../../assets/kopanang_face/kopanang_face_neutral_standardized.png';
import faceAngry from '../../assets/kopanang_face/kopanang_face_angry_standardized.png';
import faceSad from '../../assets/kopanang_face/kopanang_face_sad_standardized.png';
import faceWorried from '../../assets/kopanang_face/kopanang_face_worried_standardized.png';

// Import vowel mouth sprites (standardized)
import mouthA from '../../assets/kopanang_mouth_vowels/kopanang_mouth_a_standardized.png';
import mouthE from '../../assets/kopanang_mouth_vowels/kopanang_mouth_e_standardized.png';
import mouthI from '../../assets/kopanang_mouth_vowels/kopanang_mouth_i_standardized.png';
import mouthO from '../../assets/kopanang_mouth_vowels/kopanang_mouth_o_standardized.png';

// Import 2-frame walking sprites (standardized)
import walkFrame1 from '../../assets/kopanang_walk/kopanang_walk_1_standardized.png';
import walkFrame2 from '../../assets/kopanang_walk/kopanang_walk_2_standardized.png';

const WALK_FRAMES = [
  { id: 'walk1', src: walkFrame1 },
  { id: 'walk2', src: walkFrame2 },
];

const BODY_OPTIONS = [
  { id: 'body01', label: 'Body 01', src: body01 },
  { id: 'body02', label: 'Body 02', src: body02 },
  { id: 'body03', label: 'Body 03', src: body03 },
  { id: 'body04', label: 'Body 04', src: body04 },
  { id: 'body05', label: 'Body 05', src: body05 },
];

const FACE_OPTIONS = [
  { id: 'neutral', label: 'Neutral', src: faceNeutral },
  { id: 'angry', label: 'Angry', src: faceAngry },
  { id: 'sad', label: 'Sad', src: faceSad },
  { id: 'worried', label: 'Worried', src: faceWorried },
];

const MOUTH_FRAMES = [
  { id: 'A', label: 'A (Open)', src: mouthA },
  { id: 'E', label: 'E (Smile)', src: mouthE },
  { id: 'I', label: 'I (Narrow)', src: mouthI },
  { id: 'O', label: 'O (Round)', src: mouthO },
];

function KopanangTest() {
  const [activeTab, setActiveTab] = useState('character');
  
  // Character states
  const [selectedBody, setSelectedBody] = useState('body01');
  const [selectedFace, setSelectedFace] = useState('neutral');
  const [isTalking, setIsTalking] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [currentMouthIndex, setCurrentMouthIndex] = useState(0);
  const [currentWalkFrame, setCurrentWalkFrame] = useState(0);
  const [talkSpeed, setTalkSpeed] = useState(250);
  const [walkSpeed, setWalkSpeed] = useState(300);
  const [mouthOverride, setMouthOverride] = useState(false);

  // Audio sync states (original single-track)
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [syncMode, setSyncMode] = useState('audio');
  const [audioVolume, setAudioVolume] = useState(0.8);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentAmplitude, setCurrentAmplitude] = useState(0);
  const [audioError, setAudioError] = useState('');
  const [sensitivity, setSensitivity] = useState(3);

  // Multi-track audio mixer states
  const [mixerTracks, setMixerTracks] = useState([
    { id: 'dialogue', name: 'Dialogue', file: null, url: null, volume: 0.8, muted: false, solo: false, loop: false, isPlaying: false, progress: 0, duration: 0, fadeIn: 0, fadeOut: 0 },
    { id: 'ambient', name: 'Ambient', file: null, url: null, volume: 0.3, muted: false, solo: false, loop: true, isPlaying: false, progress: 0, duration: 0, fadeIn: 2, fadeOut: 2 },
    { id: 'music', name: 'Music', file: null, url: null, volume: 0.5, muted: false, solo: false, loop: true, isPlaying: false, progress: 0, duration: 0, fadeIn: 1, fadeOut: 3 },
  ]);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [allTracksPlaying, setAllTracksPlaying] = useState(false);
  const mixerAudioRefs = useRef({});
  const mixerProgressInterval = useRef(null);

  // Particle system states
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [particleType, setParticleType] = useState('sparkles');
  const [particleColor, setParticleColor] = useState('#ffd700');
  const [particleAmount, setParticleAmount] = useState(20);
  const [particleSpeed, setParticleSpeed] = useState(2);
  const [particleTrigger, setParticleTrigger] = useState('talking');
  const [particles, setParticles] = useState([]);
  const [particleInterval, setParticleInterval] = useState(null);
  
  const [bodyScale, setBodyScale] = useState(200);
  const [bodyRotation, setBodyRotation] = useState(0);
  const [bodyX, setBodyX] = useState(0);
  const [bodyY, setBodyY] = useState(0);

  const [headScale, setHeadScale] = useState(60);
  const [headX, setHeadX] = useState(0);
  const [headY, setHeadY] = useState(20);
  const [headRotation, setHeadRotation] = useState(0);

  const [mouthScale, setMouthScale] = useState(30);
  const [mouthX, setMouthX] = useState(0);
  const [mouthY, setMouthY] = useState(45);
  const [mouthRotation, setMouthRotation] = useState(0);
  const [mouthAspectRatio, setMouthAspectRatio] = useState(0.4);

  const [walkScale, setWalkScale] = useState(150);
  const [walkY, setWalkY] = useState(50);
  const [walkX, setWalkX] = useState(0);
  const [walkHeightRatio, setWalkHeightRatio] = useState(1.8);

  // 🛠️ NEW: Movement / Keyframe Animation States
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(200);
  const [moveDuration, setMoveDuration] = useState(3);
  const [isMoving, setIsMoving] = useState(false);
  const [moveProgress, setMoveProgress] = useState(0);
  const moveAnimationFrameRef = useRef(null);
  const moveStartTimeRef = useRef(null);
  
  // 🛠️ NEW: Anime Technique States
  const [squash, setSquash] = useState({ x: 1, y: 1 });
  const [bobbing, setBobbing] = useState(true);
  const [steppedFPS, setSteppedFPS] = useState(true);
  const [celShading, setCelShading] = useState(false);
  const [colorGrade, setColorGrade] = useState('none');
  const [softGlow, setSoftGlow] = useState(false);
  const [pivotRotate, setPivotRotate] = useState(false);
  const [bodyPivotX, setBodyPivotX] = useState(0);
  const [bodyPivotY, setBodyPivotY] = useState(0);

  const [savedPresets, setSavedPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kopanang_presets') || '[]');
    } catch { return []; }
  });
  const [presetName, setPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const [draggingLayer, setDraggingLayer] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  const mouthTimerRef = useRef(null);
  const walkTimerRef = useRef(null);
  
  // Audio refs
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioSourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Anime animation refs
  const squashTimerRef = useRef(null);
  const bobbingFrameRef = useRef(null);
  const steppedPoseIntervalRef = useRef(null);

  // Particle generation function
  const generateParticles = React.useCallback((count, type, color) => {
    const newParticles = [];
    const stageWidth = stageRef.current?.offsetWidth || 400;
    const stageHeight = stageRef.current?.offsetHeight || 400;
    
    for (let i = 0; i < count; i++) {
      const particle = {
        id: Date.now() + Math.random(),
        x: Math.random() * stageWidth,
        y: Math.random() * stageHeight,
        size: Math.random() * 8 + 3,
        speedX: (Math.random() - 0.5) * particleSpeed,
        speedY: (Math.random() - 0.5) * particleSpeed - 1,
        opacity: Math.random() * 0.8 + 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        type: type,
        color: color,
        lifetime: 100,
      };
      newParticles.push(particle);
    }
    
    setParticles(prev => [...prev, ...newParticles].slice(-50));
  }, [particleSpeed]);

  // Particle trigger effect
  useEffect(() => {
    if (!particlesEnabled) {
      if (particleInterval) clearInterval(particleInterval);
      setParticles([]);
      return;
    }
    
    const shouldGenerate = () => {
      switch (particleTrigger) {
        case 'talking':
          return isTalking;
        case 'walking':
          return isWalking || isMoving;
        case 'always':
          return true;
        default:
          return false;
      }
    };
    
    if (shouldGenerate()) {
      const interval = setInterval(() => {
        generateParticles(Math.floor(particleAmount / 10), particleType, particleColor);
      }, 200);
      setParticleInterval(interval);
    } else {
      if (particleInterval) clearInterval(particleInterval);
      setParticleInterval(null);
    }
    
    return () => {
      if (particleInterval) clearInterval(particleInterval);
    };
  }, [particlesEnabled, particleTrigger, particleType, particleColor, particleAmount, isTalking, isWalking, isMoving, generateParticles]);

  // Particle animation
  useEffect(() => {
    let animationId;
    let lastUpdate = 0;
    
    const updateParticles = (timestamp) => {
      if (timestamp - lastUpdate > 50) {
        setParticles(prev => 
          prev
            .map(p => ({
              ...p,
              x: p.x + p.speedX,
              y: p.y + p.speedY,
              opacity: p.opacity - 0.005,
              rotation: p.rotation + p.rotationSpeed,
              lifetime: p.lifetime - 1,
            }))
            .filter(p => p.opacity > 0 && p.lifetime > 0)
        );
        lastUpdate = timestamp;
      }
      animationId = requestAnimationFrame(updateParticles);
    };
    
    animationId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Manual mouth cycling
  useEffect(() => {
    if (isTalking && syncMode === 'manual' && !mouthOverride) {
      mouthTimerRef.current = setInterval(() => {
        setCurrentMouthIndex(prev => (prev + 1) % MOUTH_FRAMES.length);
      }, talkSpeed);
    }
    return () => {
      if (mouthTimerRef.current) clearInterval(mouthTimerRef.current);
    };
  }, [isTalking, talkSpeed, syncMode, mouthOverride]);

  // Walking animation (manual + movement)
  useEffect(() => {
    if ((isWalking || isMoving) && (syncMode === 'manual' || isMoving)) {
      walkTimerRef.current = setInterval(() => {
        setCurrentWalkFrame(prev => (prev + 1) % WALK_FRAMES.length);
      }, walkSpeed);
    }
    return () => {
      if (walkTimerRef.current) clearInterval(walkTimerRef.current);
    };
  }, [isWalking, isMoving, walkSpeed, syncMode]);

  // 🛠️ NEW: Movement Animation (Keyframe)
  const startMovement = () => {
    if (isMoving) return;
    
    setIsMoving(true);
    setIsWalking(true);
    setMoveProgress(0);
    moveStartTimeRef.current = performance.now();
    
    const animateMovement = (currentTime) => {
      if (!moveStartTimeRef.current) return;
      
      const elapsed = currentTime - moveStartTimeRef.current;
      const progress = Math.min(elapsed / (moveDuration * 1000), 1);
      
      setMoveProgress(progress);
      
      // Calculate new X position
      const newX = startX + (endX - startX) * progress;
      setBodyX(newX);
      setWalkX(newX);
      
      if (progress < 1) {
        moveAnimationFrameRef.current = requestAnimationFrame(animateMovement);
      } else {
        setIsMoving(false);
        setIsWalking(false);
      }
    };
    
    moveAnimationFrameRef.current = requestAnimationFrame(animateMovement);
  };

  const stopMovement = () => {
    if (moveAnimationFrameRef.current) {
      cancelAnimationFrame(moveAnimationFrameRef.current);
    }
    setIsMoving(false);
    setIsWalking(false);
  };

  const resetMovement = () => {
    if (moveAnimationFrameRef.current) {
      cancelAnimationFrame(moveAnimationFrameRef.current);
    }
    setIsMoving(false);
    setIsWalking(false);
    setMoveProgress(0);
    setBodyX(startX);
    setWalkX(startX);
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (particleInterval) clearInterval(particleInterval);
      if (mixerProgressInterval.current) clearInterval(mixerProgressInterval.current);
      if (squashTimerRef.current) clearTimeout(squashTimerRef.current);
      if (bobbingFrameRef.current) cancelAnimationFrame(bobbingFrameRef.current);
      if (steppedPoseIntervalRef.current) clearInterval(steppedPoseIntervalRef.current);
      if (moveAnimationFrameRef.current) cancelAnimationFrame(moveAnimationFrameRef.current);
      
      // Clean up mixer audio URLs
      mixerTracks.forEach(track => {
        if (track.url) URL.revokeObjectURL(track.url);
      });
    };
  }, [audioUrl]);

  // MIXER FUNCTIONS
  const handleMixerFileUpload = (trackId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) return;
    
    const url = URL.createObjectURL(file);
    
    setMixerTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        if (track.url) URL.revokeObjectURL(track.url);
        return { ...track, file, url, progress: 0, duration: 0 };
      }
      return track;
    }));
  };

  const playAllTracks = async () => {
    setAllTracksPlaying(true);
    
    const hasSolo = mixerTracks.some(track => track.solo);
    
    for (const track of mixerTracks) {
      const audioElement = mixerAudioRefs.current[track.id];
      if (!audioElement || !track.url) continue;
      
      if (track.muted || (hasSolo && !track.solo)) continue;
      
      audioElement.volume = track.volume * masterVolume;
      audioElement.loop = track.loop;
      
      try {
        await audioElement.play();
        setMixerTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, isPlaying: true } : t
        ));
      } catch (error) {
        console.error(`Error playing ${track.name}:`, error);
      }
    }
    
    if (mixerProgressInterval.current) clearInterval(mixerProgressInterval.current);
    mixerProgressInterval.current = setInterval(() => {
      setMixerTracks(prev => prev.map(track => {
        const audioElement = mixerAudioRefs.current[track.id];
        if (audioElement && audioElement.duration) {
          const progress = (audioElement.currentTime / audioElement.duration) * 100;
          return { ...track, progress, duration: audioElement.duration };
        }
        return track;
      }));
    }, 100);
  };

  const pauseAllTracks = () => {
    setAllTracksPlaying(false);
    
    for (const track of mixerTracks) {
      const audioElement = mixerAudioRefs.current[track.id];
      if (audioElement) {
        audioElement.pause();
        setMixerTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, isPlaying: false } : t
        ));
      }
    }
    
    if (mixerProgressInterval.current) clearInterval(mixerProgressInterval.current);
  };

  const stopAllTracks = () => {
    setAllTracksPlaying(false);
    
    for (const track of mixerTracks) {
      const audioElement = mixerAudioRefs.current[track.id];
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        setMixerTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, isPlaying: false, progress: 0 } : t
        ));
      }
    }
    
    if (mixerProgressInterval.current) clearInterval(mixerProgressInterval.current);
  };

  const toggleTrackMute = (trackId) => {
    setMixerTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, muted: !track.muted } : track
    ));
  };

  const toggleTrackSolo = (trackId) => {
    setMixerTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, solo: !track.solo } : track
    ));
  };

  const toggleTrackLoop = (trackId) => {
    setMixerTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, loop: !track.loop } : track
    ));
  };

  const updateTrackVolume = (trackId, volume) => {
    setMixerTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        const audioElement = mixerAudioRefs.current[trackId];
        if (audioElement) {
          audioElement.volume = volume * masterVolume;
        }
        return { ...track, volume };
      }
      return track;
    }));
  };

  const updateMasterVolume = (volume) => {
    setMasterVolume(volume);
    mixerTracks.forEach(track => {
      const audioElement = mixerAudioRefs.current[track.id];
      if (audioElement) {
        audioElement.volume = track.volume * volume;
      }
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
      setAudioError('Please upload an audio file (MP3, WAV, etc.)');
      return;
    }
    
    setAudioError('');
    setAudioFile(file);
    
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    
    setIsAudioPlaying(false);
    setAudioProgress(0);
    setAudioDuration(0);
    setCurrentAmplitude(0);
    
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
    });
  };

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.5;
      dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playAudio = async () => {
    if (!audioUrl || !audioRef.current) return;
    
    try {
      initializeAudioContext();
      
      if (!audioSourceRef.current) {
        audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        audioSourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
      
      await audioRef.current.play();
      setIsAudioPlaying(true);
      setIsTalking(true);
      setMouthOverride(false);
      
      const updateAmplitude = () => {
        if (!analyserRef.current || !dataArrayRef.current || mouthOverride) {
          animationFrameRef.current = requestAnimationFrame(updateAmplitude);
          return;
        }
        
        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
        
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const value = (dataArrayRef.current[i] - 128) / 128;
          sum += value * value;
        }
        const rms = Math.sqrt(sum / dataArrayRef.current.length);
        
        const dynamicGain = sensitivity * (1 + rms * 2);
        const amplifiedAmplitude = Math.min(rms * dynamicGain, 1);
        setCurrentAmplitude(amplifiedAmplitude);
        
        if (amplifiedAmplitude > 0.35) {
          setCurrentMouthIndex(0);
        } else if (amplifiedAmplitude > 0.18) {
          setCurrentMouthIndex(3);
        } else if (amplifiedAmplitude > 0.06) {
          setCurrentMouthIndex(1);
        } else {
          setCurrentMouthIndex(2);
        }
        
        if (audioRef.current) {
          const progress = (audioRef.current.currentTime / audioDuration) * 100;
          setAudioProgress(progress);
        }
        
        animationFrameRef.current = requestAnimationFrame(updateAmplitude);
      };
      
      updateAmplitude();
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioError('Error playing audio. Please try again.');
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
      setIsTalking(false);
      setCurrentAmplitude(0);
      setAudioProgress(0);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    setIsTalking(false);
    setCurrentAmplitude(0);
    setAudioProgress(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleMouthFrameClick = (index) => {
    setCurrentMouthIndex(index);
    setMouthOverride(true);
    setIsTalking(true);
  };

  const handleMouseDown = (e, layer) => {
    if (layer === 'mouth') return;
    e.preventDefault();
    setDraggingLayer(layer);
    
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    
    let layerX, layerY;
    if (layer === 'body') {
      layerX = bodyX;
      layerY = bodyY;
    } else if (layer === 'head') {
      layerX = headX + stageRect.width / 2;
      layerY = headY;
    }
    
    setDragOffset({
      x: mouseX - (layerX || 0),
      y: mouseY - (layerY || 0),
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingLayer) return;
    
    const stageRect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - stageRect.left;
    const mouseY = e.clientY - stageRect.top;
    
    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;
    
    if (draggingLayer === 'body') {
      setBodyX(newX);
      setBodyY(newY);
    } else if (draggingLayer === 'head') {
      setHeadX(newX - stageRect.width / 2);
      setHeadY(newY);
    }
  };

  const handleMouseUp = () => {
    setDraggingLayer(null);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingLayer, dragOffset]);

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    
    const preset = {
      id: Date.now(),
      name: presetName.trim(),
      body: selectedBody,
      face: selectedFace,
      bodyScale,
      bodyRotation,
      bodyX: Math.round(bodyX),
      bodyY: Math.round(bodyY),
      headScale,
      headRotation,
      headX: Math.round(headX),
      headY: Math.round(headY),
      mouthScale,
      mouthRotation,
      mouthX: Math.round(mouthX),
      mouthY: Math.round(mouthY),
      mouthAspectRatio,
      walkScale,
      walkX: Math.round(walkX),
      walkY: Math.round(walkY),
      walkHeightRatio,
      startX: Math.round(startX),
      endX: Math.round(endX),
      moveDuration,
    };
    
    const updated = [...savedPresets, preset];
    setSavedPresets(updated);
    localStorage.setItem('kopanang_presets', JSON.stringify(updated));
    setPresetName('');
    setShowSaveDialog(false);
  };

  const handleLoadPreset = (preset) => {
    setSelectedBody(preset.body);
    setSelectedFace(preset.face);
    setBodyScale(preset.bodyScale);
    setBodyRotation(preset.bodyRotation);
    setBodyX(preset.bodyX);
    setBodyY(preset.bodyY);
    setHeadScale(preset.headScale);
    setHeadRotation(preset.headRotation);
    setHeadX(preset.headX);
    setHeadY(preset.headY);
    setMouthScale(preset.mouthScale);
    setMouthRotation(preset.mouthRotation);
    setMouthX(preset.mouthX);
    setMouthY(preset.mouthY);
    setMouthAspectRatio(preset.mouthAspectRatio);
    if (preset.walkScale) setWalkScale(preset.walkScale);
    if (preset.walkX !== undefined) setWalkX(preset.walkX);
    if (preset.walkY !== undefined) setWalkY(preset.walkY);
    if (preset.walkHeightRatio) setWalkHeightRatio(preset.walkHeightRatio);
    if (preset.startX !== undefined) setStartX(preset.startX);
    if (preset.endX !== undefined) setEndX(preset.endX);
    if (preset.moveDuration !== undefined) setMoveDuration(preset.moveDuration);
  };

  const handleDeletePreset = (presetId) => {
    const updated = savedPresets.filter(p => p.id !== presetId);
    setSavedPresets(updated);
    localStorage.setItem('kopanang_presets', JSON.stringify(updated));
  };

  const formatTime = (seconds) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const burstParticles = () => {
    generateParticles(particleAmount, particleType, particleColor);
    triggerSquash('impact');
  };

  const triggerSquash = (direction = 'impact') => {
    if (direction === 'impact') {
      setSquash({ x: 1.02, y: 0.98 });
    } else if (direction === 'stretch') {
      setSquash({ x: 0.98, y: 1.02 });
    }
    
    if (squashTimerRef.current) clearTimeout(squashTimerRef.current);
    squashTimerRef.current = setTimeout(() => {
      setSquash({ x: 1, y: 1 });
    }, 100);
  };

  const getParticleStyle = (particle) => {
    const baseStyle = {
      position: 'absolute',
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      opacity: particle.opacity,
      transform: `rotate(${particle.rotation}deg)`,
      pointerEvents: 'none',
      zIndex: 30,
      willChange: 'transform, opacity',
    };
    
    switch (particle.type) {
      case 'sparkles':
        return {
          ...baseStyle,
          background: particle.color,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        };
      case 'dust':
        return {
          ...baseStyle,
          background: particle.color,
          borderRadius: '50%',
          filter: 'blur(2px)',
        };
      case 'confetti':
        return {
          ...baseStyle,
          background: particle.color,
          width: `${particle.size}px`,
          height: `${particle.size * 0.5}px`,
        };
      case 'bubbles':
        return {
          ...baseStyle,
          background: 'transparent',
          border: `2px solid ${particle.color}`,
          borderRadius: '50%',
        };
      default:
        return baseStyle;
    }
  };

  const currentBody = BODY_OPTIONS.find(b => b.id === selectedBody);
  const currentFace = FACE_OPTIONS.find(f => f.id === selectedFace);
  const currentMouth = MOUTH_FRAMES[currentMouthIndex];
  const currentWalk = WALK_FRAMES[currentWalkFrame];

  return (
    <div className="kopanang-test-page">
      <div className="kopanang-test-container">
        <Link to="/animation-lab" className="back-link">← Back to Animation Lab</Link>
        
        <div className="test-header">
          <h1>🧪 Kopanang Animation Tool</h1>
          <p className="test-subtitle">Talking + Walking + Expressions + Audio Mixer + Effects + Anime Techniques + Movement</p>
          <span className="test-badge">DEVELOPER TOOL</span>
        </div>

        <div className="main-layout">
          {/* LEFT: Stage */}
          <div className="stage-container">
            <div 
              className="test-stage" 
              ref={stageRef}
              style={{ cursor: draggingLayer ? 'grabbing' : 'default' }}
            >
              {celShading && <div className="cel-shading-overlay" />}
              {softGlow && <div className="soft-glow-overlay" />}
              {colorGrade !== 'none' && <div className={`color-grade-${colorGrade}`} />}
              
              {particlesEnabled && particles.map(particle => (
                <div
                  key={particle.id}
                  className="particle"
                  style={getParticleStyle(particle)}
                />
              ))}
              
              <div className="character-canvas" style={{ width: `${bodyScale}px`, position: 'relative' }}>
                {isWalking || isMoving ? (
                  <div
                    style={{
                      width: `${walkScale}px`,
                      height: `${walkScale * walkHeightRatio}px`,
                      position: 'relative',
                      top: `${walkY}px`,
                      left: `${walkX}px`,
                      zIndex: 1,
                      pointerEvents: 'none',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: `scale(${squash.x}, ${squash.y})`,
                    }}
                  >
                    <img
                      src={currentWalk.src}
                      alt={`Walking ${currentWalkFrame + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <img 
                      src={currentBody.src} 
                      alt="Body" 
                      className="layer-body-img draggable"
                      style={{
                        width: '100%',
                        transform: `translate(${bodyX}px, ${bodyY}px) rotate(${bodyRotation}deg) scale(${squash.x}, ${squash.y})`,
                        position: 'relative',
                        zIndex: 1,
                        cursor: 'grab',
                        transformOrigin: `${bodyPivotX}px ${bodyPivotY}px`,
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'body')}
                    />

                    <img 
                      src={currentFace.src}
                      alt="Face"
                      className="layer-head-img draggable"
                      style={{
                        width: `${headScale}px`,
                        position: 'absolute',
                        top: `${headY}px`,
                        left: `calc(50% + ${headX}px)`,
                        transform: `translateX(-50%) rotate(${headRotation}deg) scale(${squash.x}, ${squash.y})`,
                        zIndex: 10,
                        cursor: 'grab',
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={(e) => handleMouseDown(e, 'head')}
                    />

                    {isTalking && (
                      <div
                        style={{
                          width: `${mouthScale}px`,
                          height: `${mouthScale * mouthAspectRatio}px`,
                          position: 'absolute',
                          top: `${mouthY}px`,
                          left: `calc(50% + ${mouthX}px)`,
                          transform: `translate(-50%, -50%) rotate(${mouthRotation}deg)`,
                          zIndex: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'none',
                        }}
                      >
                        <img 
                          src={currentMouth.src}
                          alt={`Mouth ${currentMouth.label}`}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            display: 'block',
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="drag-hint">
              💡 <strong>DRAG:</strong> Body & Head | <strong>SLIDERS:</strong> Mouth & Walk | <strong>MOVEMENT:</strong> Set Start/End X
            </div>
          </div>

          {/* RIGHT: Controls with Tabs */}
          <div className="controls-container">
            <div className="tab-navigation">
              <button className={`tab-btn ${activeTab === 'character' ? 'active' : ''}`} onClick={() => setActiveTab('character')}>🧍 Character</button>
              <button className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`} onClick={() => setActiveTab('audio')}>🎵 Audio Sync</button>
              <button className={`tab-btn ${activeTab === 'mixer' ? 'active' : ''}`} onClick={() => setActiveTab('mixer')}>🎚️ Mixer</button>
              <button className={`tab-btn ${activeTab === 'effects' ? 'active' : ''}`} onClick={() => setActiveTab('effects')}>✨ Effects</button>
              <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>💾 Presets</button>
              <button className={`tab-btn ${activeTab === 'anime' ? 'active' : ''}`} onClick={() => setActiveTab('anime')}>🎨 Anime</button>
              <button className={`tab-btn ${activeTab === 'movement' ? 'active' : ''}`} onClick={() => setActiveTab('movement')}>🚶 Movement</button>
            </div>

            <div className="tab-content">
              {/* Character Tab */}
              {activeTab === 'character' && (
                <div className="tab-panel">
                  <div className="control-panel body-panel">
                    <h3>🧍 Body</h3>
                    <div className="slider-row">
                      <label>Width:</label>
                      <input type="range" min="50" max="400" value={bodyScale} onChange={(e) => setBodyScale(Number(e.target.value))} />
                      <span>{bodyScale}px</span>
                    </div>
                    <div className="pose-buttons">
                      {BODY_OPTIONS.map(body => (
                        <button key={body.id} className={`test-btn ${selectedBody === body.id ? 'active' : ''}`} onClick={() => setSelectedBody(body.id)}>{body.label}</button>
                      ))}
                    </div>
                  </div>

                  <div className="control-panel head-panel">
                    <h3>👤 Head</h3>
                    <div className="slider-row">
                      <label>Width:</label>
                      <input type="range" min="20" max="200" value={headScale} onChange={(e) => setHeadScale(Number(e.target.value))} />
                      <span>{headScale}px</span>
                    </div>
                    <div className="pose-buttons">
                      {FACE_OPTIONS.map(face => (
                        <button key={face.id} className={`test-btn ${selectedFace === face.id ? 'active' : ''}`} onClick={() => setSelectedFace(face.id)}>{face.label}</button>
                      ))}
                    </div>
                  </div>

                  <div className="control-panel mouth-panel">
                    <h3>👄 Mouth</h3>
                    <div className="pose-buttons">
                      <button className={`test-btn ${isTalking ? 'active' : ''}`} onClick={() => setIsTalking(true)}>▶ Start</button>
                      <button className="test-btn" onClick={() => setIsTalking(false)}>⏹ Stop</button>
                    </div>
                    
                    <div className="mouth-manual-test">
                      <label>Test Frames:</label>
                      <div className="pose-buttons">
                        {MOUTH_FRAMES.map((mouth, index) => (
                          <button key={mouth.id} className={`test-btn ${currentMouthIndex === index && mouthOverride ? 'active' : ''}`} onClick={() => handleMouthFrameClick(index)}>{mouth.label}</button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="slider-row" style={{ marginTop: '6px' }}>
                      <label>Width:</label>
                      <input type="range" min="5" max="150" value={mouthScale} onChange={(e) => setMouthScale(Number(e.target.value))} />
                      <span>{mouthScale}px</span>
                    </div>
                    <div className="slider-row">
                      <label>Y Position:</label>
                      <input type="range" min="-100" max="200" value={mouthY} onChange={(e) => setMouthY(Number(e.target.value))} />
                      <span>{mouthY}px</span>
                    </div>
                    <div className="slider-row">
                      <label>X Offset:</label>
                      <input type="range" min="-100" max="100" value={mouthX} onChange={(e) => setMouthX(Number(e.target.value))} />
                      <span>{mouthX}px</span>
                    </div>
                    <div className="slider-row">
                      <label>Rotation:</label>
                      <input type="range" min="-45" max="45" value={mouthRotation} onChange={(e) => setMouthRotation(Number(e.target.value))} />
                      <span>{mouthRotation}°</span>
                    </div>
                    <div className="slider-row">
                      <label>Speed:</label>
                      <input type="range" min="100" max="600" value={talkSpeed} onChange={(e) => setTalkSpeed(Number(e.target.value))} />
                      <span>{talkSpeed}ms</span>
                    </div>
                    <div className="mouth-frame-indicator">Frame: <strong>{currentMouth.label}</strong> {mouthOverride && '(Manual)'}</div>
                  </div>

                  <div className="control-panel walk-panel">
                    <h3>🚶 Walking</h3>
                    <div className="pose-buttons">
                      <button className={`test-btn ${isWalking ? 'active' : ''}`} onClick={() => setIsWalking(true)}>▶ Start</button>
                      <button className="test-btn" onClick={() => setIsWalking(false)}>⏹ Stop</button>
                    </div>
                    <div className="slider-row" style={{ marginTop: '8px' }}>
                      <label>Speed:</label>
                      <input type="range" min="100" max="800" value={walkSpeed} onChange={(e) => setWalkSpeed(Number(e.target.value))} />
                      <span>{walkSpeed}ms</span>
                    </div>
                    <div className="slider-row">
                      <label>Scale:</label>
                      <input type="range" min="50" max="300" value={walkScale} onChange={(e) => setWalkScale(Number(e.target.value))} />
                      <span>{walkScale}px</span>
                    </div>
                    <div className="slider-row">
                      <label>Height Ratio:</label>
                      <input type="range" min="1" max="3" step="0.1" value={walkHeightRatio} onChange={(e) => setWalkHeightRatio(Number(e.target.value))} />
                      <span>{walkHeightRatio.toFixed(1)}</span>
                    </div>
                    <div className="slider-row">
                      <label>Y Position:</label>
                      <input type="range" min="-200" max="300" value={walkY} onChange={(e) => setWalkY(Number(e.target.value))} />
                      <span>{walkY}px</span>
                    </div>
                    <div className="slider-row">
                      <label>X Offset:</label>
                      <input type="range" min="-200" max="200" value={walkX} onChange={(e) => setWalkX(Number(e.target.value))} />
                      <span>{walkX}px</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Audio Sync Tab */}
              {activeTab === 'audio' && (
                <div className="tab-panel">
                  <div className="control-panel audio-panel">
                    <h3>🎵 Audio Sync</h3>
                    
                    <div className="audio-upload-area">
                      <input type="file" accept="audio/*" onChange={handleFileUpload} className="audio-file-input" id="audio-upload" />
                      <label htmlFor="audio-upload" className="audio-upload-label">
                        {audioFile ? <span>📁 {audioFile.name}</span> : <span>🎤 Click to upload audio</span>}
                      </label>
                    </div>
                    
                    {audioError && <div className="audio-error">{audioError}</div>}
                    
                    <audio ref={audioRef} src={audioUrl || undefined} onEnded={handleAudioEnded} style={{ display: 'none' }} />
                    
                    <div className="audio-controls">
                      <button className={`test-btn ${isAudioPlaying ? 'active' : ''}`} onClick={isAudioPlaying ? pauseAudio : playAudio} disabled={!audioUrl}>
                        {isAudioPlaying ? '⏸ Pause' : '▶ Play'}
                      </button>
                      <button className="test-btn" onClick={stopAudio} disabled={!audioUrl}>⏹ Stop</button>
                    </div>
                    
                    <div className="audio-progress-container">
                      <div className="audio-progress-bar" style={{ width: `${audioProgress}%` }} />
                    </div>
                    <div className="audio-time-display">
                      <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                      <span>{formatTime(audioDuration)}</span>
                    </div>
                    
                    <div className="amplitude-meter-container">
                      <label>Amplitude:</label>
                      <div className="amplitude-meter">
                        <div className="amplitude-fill" style={{ width: `${currentAmplitude * 100}%`, backgroundColor: currentAmplitude > 0.35 ? '#ff4444' : currentAmplitude > 0.18 ? '#ffaa00' : '#44ff44' }} />
                        <span className="amplitude-value">{Math.round(currentAmplitude * 100)}%</span>
                      </div>
                    </div>
                    
                    <div className="slider-row">
                      <label>Sensitivity:</label>
                      <input type="range" min="1" max="10" step="0.5" value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} />
                      <span>{sensitivity}x</span>
                    </div>
                    
                    <div className="sync-mode-toggle">
                      <label>Sync Mode:</label>
                      <div className="mode-buttons">
                        <button className={`test-btn ${syncMode === 'audio' ? 'active' : ''}`} onClick={() => setSyncMode('audio')}>🎵 Audio Sync</button>
                        <button className={`test-btn ${syncMode === 'manual' ? 'active' : ''}`} onClick={() => setSyncMode('manual')}>🔄 Manual Cycle</button>
                      </div>
                    </div>
                    
                    <div className="slider-row">
                      <label>Volume:</label>
                      <input type="range" min="0" max="1" step="0.01" value={audioVolume} onChange={(e) => { setAudioVolume(Number(e.target.value)); if (audioRef.current) audioRef.current.volume = Number(e.target.value); }} />
                      <span>{Math.round(audioVolume * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Audio Mixer Tab */}
              {activeTab === 'mixer' && (
                <div className="tab-panel">
                  <div className="control-panel mixer-panel">
                    <h3>🎚️ Audio Mixer</h3>
                    
                    <div className="master-controls">
                      <div className="master-buttons">
                        <button className={`test-btn ${allTracksPlaying ? 'active' : ''}`} onClick={allTracksPlaying ? pauseAllTracks : playAllTracks}>
                          {allTracksPlaying ? '⏸ Pause All' : '▶ Play All'}
                        </button>
                        <button className="test-btn" onClick={stopAllTracks}>⏹ Stop All</button>
                      </div>
                      <div className="slider-row">
                        <label>Master Volume:</label>
                        <input type="range" min="0" max="1" step="0.01" value={masterVolume} onChange={(e) => updateMasterVolume(Number(e.target.value))} />
                        <span>{Math.round(masterVolume * 100)}%</span>
                      </div>
                    </div>
                    
                    {mixerTracks.map(track => (
                      <div key={track.id} className="mixer-track">
                        <div className="track-header">
                          <h4>{track.name}</h4>
                          <div className="track-buttons">
                            <button className={`track-btn ${track.muted ? 'muted' : ''}`} onClick={() => toggleTrackMute(track.id)} title="Mute">{track.muted ? '🔇' : '🔊'}</button>
                            <button className={`track-btn ${track.solo ? 'solo' : ''}`} onClick={() => toggleTrackSolo(track.id)} title="Solo">S</button>
                            <button className={`track-btn ${track.loop ? 'loop' : ''}`} onClick={() => toggleTrackLoop(track.id)} title="Loop">🔁</button>
                          </div>
                        </div>
                        
                        <div className="track-upload">
                          <input type="file" accept="audio/*" onChange={(e) => handleMixerFileUpload(track.id, e)} className="audio-file-input" id={`mixer-upload-${track.id}`} />
                          <label htmlFor={`mixer-upload-${track.id}`} className="track-upload-label">
                            {track.file ? `📁 ${track.file.name}` : `⬆️ Upload ${track.name}`}
                          </label>
                        </div>
                        
                        <audio ref={el => mixerAudioRefs.current[track.id] = el} src={track.url || undefined} style={{ display: 'none' }} />
                        
                        <div className="track-progress">
                          <div className="track-progress-bar" style={{ width: `${track.progress}%` }} />
                        </div>
                        
                        <div className="slider-row">
                          <label>Volume:</label>
                          <input type="range" min="0" max="1" step="0.01" value={track.volume} onChange={(e) => updateTrackVolume(track.id, Number(e.target.value))} />
                          <span>{Math.round(track.volume * 100)}%</span>
                        </div>
                        
                        <div className="track-fades">
                          <div className="slider-row">
                            <label>Fade In:</label>
                            <input type="range" min="0" max="10" step="0.5" value={track.fadeIn} onChange={(e) => setMixerTracks(prev => prev.map(t => t.id === track.id ? { ...t, fadeIn: Number(e.target.value) } : t))} />
                            <span>{track.fadeIn}s</span>
                          </div>
                          <div className="slider-row">
                            <label>Fade Out:</label>
                            <input type="range" min="0" max="10" step="0.5" value={track.fadeOut} onChange={(e) => setMixerTracks(prev => prev.map(t => t.id === track.id ? { ...t, fadeOut: Number(e.target.value) } : t))} />
                            <span>{track.fadeOut}s</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Effects Tab */}
              {activeTab === 'effects' && (
                <div className="tab-panel">
                  <div className="control-panel particle-panel">
                    <h3>✨ Particle Effects</h3>
                    
                    <div className="particle-toggle">
                      <button className={`test-btn ${particlesEnabled ? 'active' : ''}`} onClick={() => setParticlesEnabled(!particlesEnabled)}>
                        {particlesEnabled ? '✅ Enabled' : '❌ Disabled'}
                      </button>
                    </div>
                    
                    <div className="pose-buttons">
                      <button className={`test-btn ${particleType === 'sparkles' ? 'active' : ''}`} onClick={() => setParticleType('sparkles')}>✨ Sparkles</button>
                      <button className={`test-btn ${particleType === 'dust' ? 'active' : ''}`} onClick={() => setParticleType('dust')}>🌫️ Dust</button>
                      <button className={`test-btn ${particleType === 'confetti' ? 'active' : ''}`} onClick={() => setParticleType('confetti')}>🎊 Confetti</button>
                      <button className={`test-btn ${particleType === 'bubbles' ? 'active' : ''}`} onClick={() => setParticleType('bubbles')}>🫧 Bubbles</button>
                    </div>
                    
                    <div className="slider-row">
                      <label>Color:</label>
                      <input type="color" value={particleColor} onChange={(e) => setParticleColor(e.target.value)} className="color-picker" />
                    </div>
                    
                    <div className="slider-row">
                      <label>Amount:</label>
                      <input type="range" min="10" max="100" value={particleAmount} onChange={(e) => setParticleAmount(Number(e.target.value))} />
                      <span>{particleAmount}</span>
                    </div>
                    
                    <div className="slider-row">
                      <label>Speed:</label>
                      <input type="range" min="0.5" max="5" step="0.5" value={particleSpeed} onChange={(e) => setParticleSpeed(Number(e.target.value))} />
                      <span>{particleSpeed}x</span>
                    </div>
                    
                    <div className="sync-mode-toggle">
                      <label>Trigger:</label>
                      <div className="mode-buttons">
                        <button className={`test-btn ${particleTrigger === 'talking' ? 'active' : ''}`} onClick={() => setParticleTrigger('talking')}>🗣️ Talking</button>
                        <button className={`test-btn ${particleTrigger === 'walking' ? 'active' : ''}`} onClick={() => setParticleTrigger('walking')}>🚶 Walking</button>
                        <button className={`test-btn ${particleTrigger === 'always' ? 'active' : ''}`} onClick={() => setParticleTrigger('always')}>🔄 Always</button>
                      </div>
                    </div>
                    
                    <button className="test-btn burst-btn" onClick={burstParticles}>💥 Burst Now</button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="tab-panel">
                  <div className="presets-section">
                    <h3>💾 Presets</h3>
                    
                    {savedPresets.length > 0 ? (
                      <div className="presets-list">
                        {savedPresets.map(preset => (
                          <div key={preset.id} className="preset-item">
                            <div className="preset-info">
                              <strong>{preset.name}</strong>
                              <span className="preset-detail">{preset.body} | {preset.face}</span>
                            </div>
                            <div className="preset-actions">
                              <button className="test-btn" onClick={() => handleLoadPreset(preset)}>Load</button>
                              <button className="test-btn delete-btn" onClick={() => handleDeletePreset(preset.id)}>🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-presets">No presets saved.</p>
                    )}

                    {showSaveDialog ? (
                      <div className="save-dialog">
                        <input type="text" placeholder="Preset name" value={presetName} onChange={(e) => setPresetName(e.target.value)} className="preset-input" autoFocus />
                        <div className="preset-dialog-buttons">
                          <button className="test-btn" onClick={handleSavePreset}>✅ Save</button>
                          <button className="test-btn" onClick={() => setShowSaveDialog(false)}>❌ Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button className="save-preset-btn" onClick={() => setShowSaveDialog(true)}>💾 Save Position</button>
                    )}
                  </div>
                </div>
              )}

              {/* Anime Techniques Tab */}
              {activeTab === 'anime' && (
                <div className="tab-panel">
                  <div className="control-panel anime-panel">
                    <h3>🎨 Anime Techniques</h3>
                    
                    <div className="anime-section">
                      <h4>🔄 Bopping Idle (Breathing)</h4>
                      <button className={`test-btn ${bobbing ? 'active' : ''}`} onClick={() => setBobbing(!bobbing)}>
                        {bobbing ? '✅ Enabled' : '❌ Disabled'}
                      </button>
                    </div>

                    <div className="anime-section">
                      <h4>🎞️ Stepped Frame Rate (Anime Look)</h4>
                      <button className={`test-btn ${steppedFPS ? 'active' : ''}`} onClick={() => setSteppedFPS(!steppedFPS)}>
                        {steppedFPS ? '✅ Enabled (10fps poses)' : '❌ Disabled (60fps poses)'}
                      </button>
                    </div>

                    <div className="anime-section">
                      <h4>🎨 Cel-Shading</h4>
                      <button className={`test-btn ${celShading ? 'active' : ''}`} onClick={() => setCelShading(!celShading)}>
                        {celShading ? '✅ Enabled' : '❌ Disabled'}
                      </button>
                    </div>

                    <div className="anime-section">
                      <h4>✨ Soft Glow</h4>
                      <button className={`test-btn ${softGlow ? 'active' : ''}`} onClick={() => setSoftGlow(!softGlow)}>
                        {softGlow ? '✅ Enabled' : '❌ Disabled'}
                      </button>
                    </div>

                    <div className="anime-section">
                      <h4>🎨 Color Grading</h4>
                      <div className="pose-buttons">
                        <button className={`test-btn ${colorGrade === 'none' ? 'active' : ''}`} onClick={() => setColorGrade('none')}>None</button>
                        <button className={`test-btn ${colorGrade === 'warm' ? 'active' : ''}`} onClick={() => setColorGrade('warm')}>🌅 Warm</button>
                        <button className={`test-btn ${colorGrade === 'cool' ? 'active' : ''}`} onClick={() => setColorGrade('cool')}>🌙 Cool</button>
                        <button className={`test-btn ${colorGrade === 'dramatic' ? 'active' : ''}`} onClick={() => setColorGrade('dramatic')}>🎭 Dramatic</button>
                      </div>
                    </div>

                    <div className="anime-section">
                      <h4>💥 Squash & Stretch</h4>
                      <div className="pose-buttons">
                        <button className="test-btn" onClick={() => triggerSquash('impact')}>💥 Impact</button>
                        <button className="test-btn" onClick={() => triggerSquash('stretch')}>🚀 Stretch</button>
                      </div>
                    </div>

                    <div className="anime-section">
                      <h4>📌 Pivot Rotation</h4>
                      <button className={`test-btn ${pivotRotate ? 'active' : ''}`} onClick={() => setPivotRotate(!pivotRotate)}>
                        {pivotRotate ? '✅ Enabled' : '❌ Disabled'}
                      </button>
                      {pivotRotate && (
                        <>
                          <div className="slider-row">
                            <label>Pivot X:</label>
                            <input type="range" min="-100" max="100" value={bodyPivotX} onChange={(e) => setBodyPivotX(Number(e.target.value))} />
                            <span>{bodyPivotX}px</span>
                          </div>
                          <div className="slider-row">
                            <label>Pivot Y:</label>
                            <input type="range" min="-100" max="100" value={bodyPivotY} onChange={(e) => setBodyPivotY(Number(e.target.value))} />
                            <span>{bodyPivotY}px</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 🛠️ NEW: Movement Tab */}
              {activeTab === 'movement' && (
                <div className="tab-panel">
                  <div className="control-panel movement-panel">
                    <h3>🚶 Movement (Keyframe)</h3>
                    
                    <div className="movement-section">
                      <h4>📍 Position</h4>
                      <div className="slider-row">
                        <label>Start X:</label>
                        <input type="range" min="-500" max="500" value={startX} onChange={(e) => setStartX(Number(e.target.value))} />
                        <span>{startX}px</span>
                      </div>
                      <div className="slider-row">
                        <label>End X:</label>
                        <input type="range" min="-500" max="500" value={endX} onChange={(e) => setEndX(Number(e.target.value))} />
                        <span>{endX}px</span>
                      </div>
                    </div>

                    <div className="movement-section">
                      <h4>⏱️ Timing</h4>
                      <div className="slider-row">
                        <label>Duration:</label>
                        <input type="range" min="0.5" max="10" step="0.5" value={moveDuration} onChange={(e) => setMoveDuration(Number(e.target.value))} />
                        <span>{moveDuration}s</span>
                      </div>
                      <div className="slider-row">
                        <label>Walk Speed:</label>
                        <input type="range" min="100" max="800" value={walkSpeed} onChange={(e) => setWalkSpeed(Number(e.target.value))} />
                        <span>{walkSpeed}ms</span>
                      </div>
                    </div>

                    <div className="movement-section">
                      <h4>🎬 Controls</h4>
                      <div className="pose-buttons">
                        <button className={`test-btn ${isMoving ? 'active' : ''}`} onClick={startMovement} disabled={isMoving}>
                          ▶ Play Animation
                        </button>
                        <button className="test-btn" onClick={stopMovement} disabled={!isMoving}>
                          ⏹ Stop
                        </button>
                        <button className="test-btn" onClick={resetMovement}>
                          🔄 Reset
                        </button>
                      </div>
                    </div>

                    <div className="movement-progress">
                      <label>Progress:</label>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${moveProgress * 100}%` }} />
                      </div>
                      <span>{Math.round(moveProgress * 100)}%</span>
                    </div>

                    <div className="movement-hint">
                      💡 Set Start X and End X, then click "Play Animation" to see Kopanang walk from point A to point B.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KopanangTest;