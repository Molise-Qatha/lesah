import React, { useEffect, useRef, useState } from 'react';
import './HoKalla.css';

// ---- SPRITE CONFIGURATION ----
const SPRITE_CONFIG = {
  basePath: '/images/characters/khotso/',
  framesPerState: {
    idle: 1,     // uses walk1-removebg-preview.png
    walk: 5,     // walk1 ... walk5 (with suffix)
    jump: 7,     // jump1 ... jump7 (with suffix)
    land: 7,     // land1 ... land7 (with suffix)
    crouch: 7,   // crouch1 ... crouch7 (with suffix)
  },
  animationSpeed: 10, // fps
};

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const keys = useRef({});
  const touchMoveLeft = useRef(false);
  const touchMoveRight = useRef(false);
  const touchJump = useRef(false);
  const jumpRequested = useRef(false);

  const sprites = useRef({
    idle: [],
    walk: [],
    jump: [],
    land: [],
    crouch: [],
  });

  const loadedCount = useRef(0);
  const totalFrames = useRef(0);
  const allLoaded = useRef(false);

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
  });

  const camera = useRef({ x: 0, y: 0 });
  const fpsState = useRef({
    lastTime: 0, fps: 0, frameCount: 0, fpsUpdateTime: 0,
  });
  const groundFrac = 0.65;

  // ---------- Load all frame images (with -removebg-preview suffix) ----------
  useEffect(() => {
    const loadFrames = (prefix, count) => {
      const arr = [];
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        // Construct the new filename: walk1-removebg-preview.png, etc.
        img.src = `${SPRITE_CONFIG.basePath}${prefix}${i}-removebg-preview.png`;
        img.onload = () => {
          loadedCount.current++;
          if (loadedCount.current >= totalFrames.current) {
            allLoaded.current = true;
            if (sprites.current.walk[0] && sprites.current.walk[0].complete) {
              player.current.width = sprites.current.walk[0].naturalWidth;
              player.current.height = sprites.current.walk[0].naturalHeight;
            }
          }
        };
        img.onerror = () => console.warn(`Failed to load ${prefix}${i}-removebg-preview.png`);
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

    // Use walk1-removebg-preview.png for idle
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

  // ---------- Background drawing (unchanged) ----------
  const drawAcaciaTree = (ctx, x, y, size) => {
    ctx.save();
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(x - 3, y - size * 0.6, 6, size * 0.6);
    ctx.strokeStyle = '#8B5A2B'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.4); ctx.lineTo(x - size * 0.4, y - size * 0.8);
    ctx.moveTo(x, y - size * 0.4); ctx.lineTo(x + size * 0.4, y - size * 0.8);
    ctx.moveTo(x, y - size * 0.5); ctx.lineTo(x - size * 0.2, y - size * 0.9);
    ctx.moveTo(x, y - size * 0.5); ctx.lineTo(x + size * 0.2, y - size * 0.9);
    ctx.stroke();
    ctx.fillStyle = '#2E8B57';
    ctx.beginPath();
    ctx.ellipse(x, y - size * 0.85, size * 0.35, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3CB371';
    ctx.beginPath();
    ctx.ellipse(x, y - size * 0.9, size * 0.25, size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawHut = (ctx, x, y, size) => {
    ctx.save();
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(x - size * 0.4, y - size * 0.5, size * 0.8, size * 0.5);
    ctx.strokeStyle = '#8B7355'; ctx.lineWidth = 1;
    ctx.strokeRect(x - size * 0.4, y - size * 0.5, size * 0.8, size * 0.5);
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(x - size * 0.1, y - size * 0.2, size * 0.2, size * 0.2);
    ctx.fillStyle = '#C4A35A';
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.9);
    ctx.lineTo(x - size * 0.5, y - size * 0.5);
    ctx.lineTo(x + size * 0.5, y - size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8B7355'; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.9); ctx.lineTo(x - size * 0.25, y - size * 0.5);
    ctx.moveTo(x, y - size * 0.9); ctx.lineTo(x + size * 0.25, y - size * 0.5);
    ctx.stroke();
    ctx.restore();
  };

  const drawBackground = (ctx, canvas) => {
    const w = canvas.width, h = canvas.height, groundY = h * 0.65;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, '#87CEEB'); skyGrad.addColorStop(0.6, '#B0E0E6'); skyGrad.addColorStop(1, '#E0F0FF');
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, w, groundY);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, groundY); ctx.lineTo(w * 0.25, groundY - 120); ctx.lineTo(w * 0.35, groundY - 60);
    ctx.lineTo(w * 0.6, groundY - 160); ctx.lineTo(w * 0.75, groundY - 80); ctx.lineTo(w, groundY - 40);
    ctx.lineTo(w, groundY); ctx.closePath();
    ctx.fillStyle = '#7B8D7B'; ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, groundY + 20); ctx.quadraticCurveTo(w * 0.2, groundY - 30, w * 0.5, groundY + 10);
    ctx.quadraticCurveTo(w * 0.8, groundY + 40, w, groundY - 10);
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = '#6B8E23'; ctx.fill();
    ctx.restore();
    const grassGrad = ctx.createLinearGradient(0, groundY - 20, 0, h);
    grassGrad.addColorStop(0, '#4caf50'); grassGrad.addColorStop(1, '#2e7d32');
    ctx.fillStyle = grassGrad; ctx.fillRect(0, groundY - 20, w, h - groundY + 20);
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY);
    ctx.strokeStyle = '#388E3C'; ctx.lineWidth = 2; ctx.stroke();
    drawAcaciaTree(ctx, w * 0.15, groundY - 60, 40);
    drawAcaciaTree(ctx, w * 0.85, groundY - 70, 50);
    drawHut(ctx, w * 0.7, groundY - 35, 40);
    ctx.save();
    ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 30; i++) {
      const gx = (i * 37 + 13) % w, gy = groundY + 5 + (i % 5) * 3;
      ctx.beginPath();
      ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx - 4, gy - 6, gx - 3, gy - 12);
      ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx + 4, gy - 6, gx + 3, gy - 12);
      ctx.stroke();
    }
    ctx.restore();
  };

  // ---------- Player drawing ----------
  const drawPlayer = (ctx, p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    if (!p.facingRight) ctx.scale(-1, 1);

    const state = p.state;
    const frames = sprites.current[state];
    if (frames && frames.length > 0) {
      let frameIndex = 0;
      if (state === 'idle') {
        frameIndex = 0; // walk1-removebg-preview.png
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

  const drawTitle = (ctx, canvas) => {
    ctx.save();
    ctx.font = 'bold 36px Arial, sans-serif'; ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 6;
    ctx.textAlign = 'center';
    ctx.fillText('Ho Kalla (Prototype)', canvas.width / 2, 80);
    ctx.restore();
  };

  const drawFPS = (ctx, fps) => {
    ctx.save();
    ctx.font = '16px monospace'; ctx.fillStyle = '#ffff00';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 3;
    ctx.textAlign = 'left'; ctx.fillText(`FPS: ${fps}`, 10, 30);
    ctx.restore();
  };

  // ---------- Physics & input ----------
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);
    drawTitle(ctx, canvas);
    drawFPS(ctx, fs.fps);
    drawPlayer(ctx, player.current);
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