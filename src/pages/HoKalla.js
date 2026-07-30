import React, { useEffect, useRef, useState } from 'react';
import './HoKalla.css';

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const keys = useRef({});
  const touchMoveLeft = useRef(false);
  const touchMoveRight = useRef(false);
  const touchJump = useRef(false);
  const jumpRequested = useRef(false);

  // Sprite image
  const spriteImage = useRef(null);

  // Player state – width/height will be set after image loads
  const player = useRef({
    x: 200,
    y: 0,
    width: 60,        // default; will be overwritten by sprite size
    height: 100,      // default; will be overwritten by sprite size
    vx: 0,
    vy: 0,
    speed: 3.5,
    jumpForce: -9,
    facingRight: true,
    grounded: false,
    animTime: 0,
    state: 'idle',
    landTimer: 0,
    // Sprite scale factor (adjust if image is too big)
    scale: 0.15,      // change this to fit your sprite
  });

  // Camera (fixed for now)
  const camera = useRef({ x: 0, y: 0 });

  // FPS tracking
  const fpsState = useRef({
    lastTime: 0,
    fps: 0,
    frameCount: 0,
    fpsUpdateTime: 0,
  });

  const groundFrac = 0.65;

  // ---------- Load the sprite ----------
  useEffect(() => {
    const img = new Image();
    img.src = '/images/characters/khotso.png';  // adjust path if needed
    img.onload = () => {
      spriteImage.current = img;
      // Set player dimensions based on image size * scale
      const p = player.current;
      p.width = img.naturalWidth * p.scale;
      p.height = img.naturalHeight * p.scale;
    };
    img.onerror = () => {
      console.warn('Khotso sprite not found – using fallback shapes');
    };
  }, []);

  // ---------- Touch handlers ----------
  const handleTouchLeftStart = (e) => { e.preventDefault(); touchMoveLeft.current = true; };
  const handleTouchLeftEnd = (e) => { e.preventDefault(); touchMoveLeft.current = false; };
  const handleTouchRightStart = (e) => { e.preventDefault(); touchMoveRight.current = true; };
  const handleTouchRightEnd = (e) => { e.preventDefault(); touchMoveRight.current = false; };
  const handleTouchJumpStart = (e) => { e.preventDefault(); touchJump.current = true; };
  const handleTouchJumpEnd = (e) => { e.preventDefault(); touchJump.current = false; };

  // ---------- Drawing ----------
  const drawBackground = (ctx, canvas) => {
    const groundY = canvas.height * groundFrac;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#E0F0FF');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, groundY);

    const grassGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
    grassGrad.addColorStop(0, '#4caf50');
    grassGrad.addColorStop(1, '#2e7d32');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawPlayer = (ctx, p) => {
    ctx.save();
    // Player's (x, y) is the bottom‑center (feet)
    const px = p.x;
    const py = p.y;
    ctx.translate(px, py);

    // Face left/right
    if (!p.facingRight) {
      ctx.scale(-1, 1);
    }

    if (spriteImage.current) {
      // Draw the sprite centred horizontally and bottom‑aligned
      ctx.drawImage(
        spriteImage.current,
        -p.width / 2,
        -p.height,
        p.width,
        p.height
      );
    } else {
      // Fallback if image hasn't loaded
      ctx.fillStyle = '#D32F2F';
      ctx.fillRect(-15, -80, 30, 80);
      ctx.fillStyle = '#FFC107';
      ctx.beginPath();
      ctx.arc(0, -90, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
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
    ctx.fillText(`FPS: ${fps}`, 10, 30);
    ctx.restore();
  };

  // ---------- Physics & input ----------
  const update = (canvas) => {
    const p = player.current;
    const groundY = canvas.height * groundFrac;

    let moveDir = 0;
    if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A'] || touchMoveLeft.current) moveDir -= 1;
    if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D'] || touchMoveRight.current) moveDir += 1;
    p.vx = moveDir * p.speed;

    if (
      (keys.current[' '] || keys.current['Space'] ||
       keys.current['ArrowUp'] || keys.current['w'] || keys.current['W'] ||
       touchJump.current)
    ) {
      if (p.grounded && !jumpRequested.current) {
        p.vy = p.jumpForce;
        p.grounded = false;
        jumpRequested.current = true;
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
      if (!p.grounded) p.landTimer = 10;
      p.grounded = true;
    } else {
      p.grounded = false;
    }

    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

    if (moveDir > 0) p.facingRight = true;
    else if (moveDir < 0) p.facingRight = false;

    p.animTime += 1;
    if (!p.grounded) {
      p.state = p.vy < 0 ? 'jump' : 'jump'; // still one state for now
    } else {
      if (p.landTimer > 0) {
        p.state = 'land';
        p.landTimer--;
      } else if (moveDir !== 0) {
        p.state = 'walk';
      } else {
        p.state = 'idle';
      }
    }
  };

  // ---------- Game loop ----------
  const gameLoop = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const fs = fpsState.current;
    if (!fs.lastTime) fs.lastTime = timestamp;
    fs.frameCount++;
    if (timestamp - fs.fpsUpdateTime >= 1000) {
      fs.fps = Math.round((fs.frameCount * 1000) / (timestamp - fs.fpsUpdateTime));
      fs.frameCount = 0;
      fs.fpsUpdateTime = timestamp;
    }

    update(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);
    drawTitle(ctx, canvas);
    drawFPS(ctx, fs.fps);
    drawPlayer(ctx, player.current);

    animFrameId.current = requestAnimationFrame(gameLoop);
  };

  // ---------- Resize & setup ----------
  const handleResize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const p = player.current;
    const groundY = canvas.height * groundFrac;
    p.y = groundY;
    p.vy = 0;
    p.grounded = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const keyDown = (e) => {
      keys.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
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
          <button
            className="touch-btn left-btn"
            onTouchStart={handleTouchLeftStart}
            onTouchEnd={handleTouchLeftEnd}
            onTouchCancel={handleTouchLeftEnd}
            onMouseDown={handleTouchLeftStart}
            onMouseUp={handleTouchLeftEnd}
            onMouseLeave={handleTouchLeftEnd}
          >
            ◀ Move Left
          </button>
          <button
            className="touch-btn jump-btn"
            onTouchStart={handleTouchJumpStart}
            onTouchEnd={handleTouchJumpEnd}
            onTouchCancel={handleTouchJumpEnd}
            onMouseDown={handleTouchJumpStart}
            onMouseUp={handleTouchJumpEnd}
            onMouseLeave={handleTouchJumpEnd}
          >
            ▲ Jump
          </button>
          <button
            className="touch-btn right-btn"
            onTouchStart={handleTouchRightStart}
            onTouchEnd={handleTouchRightEnd}
            onTouchCancel={handleTouchRightEnd}
            onMouseDown={handleTouchRightStart}
            onMouseUp={handleTouchRightEnd}
            onMouseLeave={handleTouchRightEnd}
          >
            ▶ Move Right
          </button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;