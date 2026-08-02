import React, { useEffect, useRef, useState } from 'react';
import './HoKalla.css';

// ---- SPRITE CONFIGURATION ----
const SPRITE_CONFIG = {
  basePath: '/images/characters/khotso/',
  framesPerState: {
    idle: 1,     // uses walk1.png
    walk: 5,     // walk1.png ... walk5.png
    jump: 7,     // jump1.png ... jump7.png
    land: 7,     // land1.png ... land7.png
    crouch: 7,   // crouch1.png ... crouch7.png
  },
  animationSpeed: 10, // fps
};

// ---- ARENA BACKGROUND IMAGE ----
const ARENA_PATH = '/images/arenas/arena1.png'; // <-- change this if your file is named differently

// ---- HEALTH CONFIG ----
const PLAYER_MAX_HEALTH = 100;

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const keys = useRef({});
  const touchMoveLeft = useRef(false);
  const touchMoveRight = useRef(false);
  const touchJump = useRef(false);
  const jumpRequested = useRef(false);

  // Sprite frames
  const sprites = useRef({
    idle: [],
    walk: [],
    jump: [],
    land: [],
    crouch: [],
  });

  // Arena background image
  const arenaImage = useRef(null);
  const arenaLoaded = useRef(false);

  const loadedCount = useRef(0);
  const totalFrames = useRef(0);

  // Player state
  const player = useRef({
    x: 200,
    y: 0,
    width: 150,
    height: 200,
    vx: 0,
    vy: 0,
    speed: 3.5,
    jumpForce: -9,
    facingRight: true,
    grounded: false,
    state: 'idle',
    landTimer: 0,
    currentFrame: 0,
    frameTimer: 0,
    landAnimFinished: false,
    crouching: false,
    health: PLAYER_MAX_HEALTH,   // current health
    maxHealth: PLAYER_MAX_HEALTH,
  });

  const camera = useRef({ x: 0, y: 0 });
  const fpsState = useRef({
    lastTime: 0, fps: 0, frameCount: 0, fpsUpdateTime: 0,
  });
  const groundFrac = 0.65;

  // ---------- Load sprites and arena ----------
  useEffect(() => {
    // Load arena background
    const arenaImg = new Image();
    arenaImg.src = ARENA_PATH;
    arenaImg.onload = () => {
      arenaImage.current = arenaImg;
      arenaLoaded.current = true;
    };
    arenaImg.onerror = () => console.warn('Arena image not found – using fallback green background');

    // Load sprite frames
    const loadFrames = (prefix, count) => {
      const arr = [];
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = `${SPRITE_CONFIG.basePath}${prefix}${i}.png`;
        img.onload = () => {
          loadedCount.current++;
          if (loadedCount.current >= totalFrames.current) {
            if (sprites.current.walk[0] && sprites.current.walk[0].complete) {
              player.current.width = sprites.current.walk[0].naturalWidth;
              player.current.height = sprites.current.walk[0].naturalHeight;
            }
          }
        };
        img.onerror = () => console.warn(`Failed to load ${prefix}${i}.png`);
        arr.push(img);
      }
      return arr;
    };

    sprites.current.walk = loadFrames('walk', SPRITE_CONFIG.framesPerState.walk);
    sprites.current.jump = loadFrames('jump', SPRITE_CONFIG.framesPerState.jump);
    sprites.current.land = loadFrames('land', SPRITE_CONFIG.framesPerState.land);
    sprites.current.crouch = loadFrames('crouch', SPRITE_CONFIG.framesPerState.crouch);

    totalFrames.current =
      SPRITE_CONFIG.framesPerState.walk +
      SPRITE_CONFIG.framesPerState.jump +
      SPRITE_CONFIG.framesPerState.land +
      SPRITE_CONFIG.framesPerState.crouch;

    // Use walk1.png for idle
    const checkWalk = setInterval(() => {
      if (sprites.current.walk[0] && sprites.current.walk[0].complete) {
        sprites.current.idle = [sprites.current.walk[0]];
        clearInterval(checkWalk);
        if (!player.current.width) {
          player.current.width = sprites.current.walk[0].naturalWidth;
          player.current.height = sprites.current.walk[0].naturalHeight;
        }
      }
    }, 50);
  }, []);

  // ---------- Touch handlers ----------
  const handleTouchLeftStart  = (e) => { e.preventDefault(); touchMoveLeft.current = true; };
  const handleTouchLeftEnd    = (e) => { e.preventDefault(); touchMoveLeft.current = false; };
  const handleTouchRightStart = (e) => { e.preventDefault(); touchMoveRight.current = true; };
  const handleTouchRightEnd   = (e) => { e.preventDefault(); touchMoveRight.current = false; };
  const handleTouchJumpStart  = (e) => { e.preventDefault(); touchJump.current = true; };
  const handleTouchJumpEnd    = (e) => { e.preventDefault(); touchJump.current = false; };

  // ---------- Drawing functions ----------
  const drawBackground = (ctx, canvas) => {
    if (arenaLoaded.current && arenaImage.current) {
      // Draw arena stretched to full canvas
      ctx.drawImage(arenaImage.current, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback: plain green
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const drawPlayer = (ctx, p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    if (!p.facingRight) ctx.scale(-1, 1);

    const state = p.state;
    const frames = sprites.current[state];
    if (frames && frames.length > 0) {
      let frameIndex = 0;
      if (state === 'idle') {
        frameIndex = 0;
      } else {
        frameIndex = Math.floor(p.currentFrame) % frames.length;
      }
      const img = frames[frameIndex];
      if (img && img.complete) {
        const drawWidth = p.width || img.naturalWidth;
        const drawHeight = p.height || img.naturalHeight;
        ctx.drawImage(img, -drawWidth / 2, -drawHeight, drawWidth, drawHeight);
      }
    } else {
      // Fallback
      ctx.fillStyle = '#D32F2F'; ctx.fillRect(-15, -80, 30, 80);
      ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(0, -90, 12, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  };

  const drawHUD = (ctx, canvas, p) => {
    // Health bar background
    const barWidth = 200;
    const barHeight = 20;
    const x = 20;
    const y = 20;

    // Name label
    ctx.save();
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 4;
    ctx.fillText('Khotso', x, y - 5);
    ctx.restore();

    // Health bar background
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health bar fill
    const healthPercent = p.health / p.maxHealth;
    const fillWidth = barWidth * healthPercent;
    // Gradient green to red
    const grad = ctx.createLinearGradient(x, y, x + barWidth, y);
    grad.addColorStop(0, '#4caf50');
    grad.addColorStop(0.6, '#ffeb3b');
    grad.addColorStop(1, '#f44336');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, fillWidth, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
  };

  const drawTitle = (ctx, canvas) => {
    ctx.save();
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 6;
    ctx.textAlign = 'center';
    ctx.fillText('Ho Kalla (Prototype)', canvas.width / 2, 80);
    ctx.restore();
  };

  const drawFPS = (ctx, fps) => {
    ctx.save();
    ctx.font = '16px monospace';
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 3;
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${fps}`, 10, canvas.height - 10);
    ctx.restore();
  };

  // ---------- Physics & input (unchanged) ----------
  const update = (canvas, deltaTime) => {
    const p = player.current;
    const groundY = canvas.height * groundFrac;

    const crouchKey = keys.current['ArrowDown'] || keys.current['s'] || keys.current['S'];
    p.crouching = crouchKey && p.grounded;

    let moveDir = 0;
    if (!p.crouching) {
      if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A'] || touchMoveLeft.current) moveDir -= 1;
      if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D'] || touchMoveRight.current) moveDir += 1;
    }
    p.vx = moveDir * p.speed;

    if (
      (keys.current[' '] || keys.current['Space'] ||
       keys.current['ArrowUp'] || keys.current['w'] || keys.current['W'] ||
       touchJump.current)
    ) {
      if (p.grounded && !jumpRequested.current && !p.crouching) {
        p.vy = p.jumpForce;
        p.grounded = false;
        jumpRequested.current = true;
        p.frameTimer = 0;
        p.state = 'jump';
      }
    } else {
      jumpRequested.current = false;
    }

    p.vy += 0.6;
    p.x += p.vx;
    p.y += p.vy;

    if (p.y > groundY) {
      p.y = groundY;
      p.vy = 0;
      if (!p.grounded) {
        p.landTimer = 15;
        p.state = 'land';
        p.frameTimer = 0;
        p.landAnimFinished = false;
      }
      p.grounded = true;
    } else {
      p.grounded = false;
    }

    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

    if (moveDir > 0) p.facingRight = true;
    else if (moveDir < 0) p.facingRight = false;

    if (!p.grounded) {
      p.state = 'jump';
    } else {
      if (p.landTimer > 0) {
        p.state = 'land';
        p.landTimer--;
      } else if (p.crouching) {
        p.state = 'crouch';
        p.frameTimer = 0;
      } else if (moveDir !== 0) {
        p.state = 'walk';
      } else {
        p.state = 'idle';
      }
    }

    const cfg = SPRITE_CONFIG;
    if (p.state === 'walk' || p.state === 'jump') {
      p.frameTimer += (deltaTime / 1000) * cfg.animationSpeed;
    } else if (p.state === 'crouch') {
      p.frameTimer += (deltaTime / 1000) * cfg.animationSpeed;
    } else if (p.state === 'land') {
      if (!p.landAnimFinished) {
        p.frameTimer += (deltaTime / 1000) * cfg.animationSpeed;
        if (Math.floor(p.frameTimer) >= cfg.framesPerState.land) {
          p.frameTimer = cfg.framesPerState.land - 1;
          p.landAnimFinished = true;
        }
      }
    } else if (p.state === 'idle') {
      p.frameTimer = 0;
    }
    p.currentFrame = p.frameTimer;
  };

  // ---------- Game loop ----------
  let lastTimestamp = 0;
  const gameLoop = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    const fs = fpsState.current;
    if (!fs.lastTime) fs.lastTime = timestamp;
    fs.frameCount++;
    if (timestamp - fs.fpsUpdateTime >= 1000) {
      fs.fps = Math.round((fs.frameCount * 1000) / (timestamp - fs.fpsUpdateTime));
      fs.frameCount = 0; fs.fpsUpdateTime = timestamp;
    }

    update(canvas, deltaTime);

    // Render order: background → player → HUD
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);
    drawPlayer(ctx, player.current);
    // Overlays (on top of everything)
    drawTitle(ctx, canvas);
    drawFPS(ctx, canvas, fs.fps);
    drawHUD(ctx, canvas, player.current);

    animFrameId.current = requestAnimationFrame(gameLoop);
  };

  // ---------- Resize & setup ----------
  const handleResize = () => {
    const canvas = canvasRef.current, container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width; canvas.height = height;
    const p = player.current;
    p.y = canvas.height * groundFrac;
    p.vy = 0; p.grounded = true;
    p.state = 'idle';
    p.landTimer = 0;
    p.landAnimFinished = false;
    p.frameTimer = 0;
    p.currentFrame = 0;
    p.crouching = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const keyDown = (e) => {
      keys.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    };
    const keyUp = (e) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    animFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const isTouchDevice = 'ontouchstart' in window;

  return (
    <div className="ho-kalla-container" ref={containerRef}>
      <canvas ref={canvasRef} className="ho-kalla-canvas" />
      {isTouchDevice && (
        <div className="touch-controls">
          <button className="touch-btn left-btn"
            onTouchStart={handleTouchLeftStart} onTouchEnd={handleTouchLeftEnd} onTouchCancel={handleTouchLeftEnd}
            onMouseDown={handleTouchLeftStart} onMouseUp={handleTouchLeftEnd} onMouseLeave={handleTouchLeftEnd}>
            ◀ Move Left
          </button>
          <button className="touch-btn jump-btn"
            onTouchStart={handleTouchJumpStart} onTouchEnd={handleTouchJumpEnd} onTouchCancel={handleTouchJumpEnd}
            onMouseDown={handleTouchJumpStart} onMouseUp={handleTouchJumpEnd} onMouseLeave={handleTouchJumpEnd}>
            ▲ Jump
          </button>
          <button className="touch-btn right-btn"
            onTouchStart={handleTouchRightStart} onTouchEnd={handleTouchRightEnd} onTouchCancel={handleTouchRightEnd}
            onMouseDown={handleTouchRightStart} onMouseUp={handleTouchRightEnd} onMouseLeave={handleTouchRightEnd}>
            ▶ Move Right
          </button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;