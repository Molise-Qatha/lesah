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

  // Jump input (keyboard/touch)
  const jumpRequested = useRef(false);

  // Player state
  const player = useRef({
    x: 200,
    y: 0,
    width: 50,
    height: 100,
    vx: 0,
    vy: 0,
    speed: 3.5,
    jumpForce: -9,
    facingRight: true,
    grounded: false,
    animTime: 0,
    state: 'idle',       // 'idle' | 'walk' | 'jump' | 'land'
    landTimer: 0,
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

  // Ground level (as fraction of canvas height)
  const groundFrac = 0.65;

  // ---------- Touch button handlers ----------
  const handleTouchLeftStart = (e) => {
    e.preventDefault();
    touchMoveLeft.current = true;
  };
  const handleTouchLeftEnd = (e) => {
    e.preventDefault();
    touchMoveLeft.current = false;
  };
  const handleTouchRightStart = (e) => {
    e.preventDefault();
    touchMoveRight.current = true;
  };
  const handleTouchRightEnd = (e) => {
    e.preventDefault();
    touchMoveRight.current = false;
  };
  const handleTouchJumpStart = (e) => {
    e.preventDefault();
    touchJump.current = true;
  };
  const handleTouchJumpEnd = (e) => {
    e.preventDefault();
    touchJump.current = false;
  };

  // ---------- Drawing helpers ----------
  const drawBackground = (ctx, canvas) => {
    const groundY = canvas.height * groundFrac;
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#E0F0FF');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, groundY);

    // Grass
    const grassGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
    grassGrad.addColorStop(0, '#4caf50');
    grassGrad.addColorStop(1, '#2e7d32');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    // Ground line
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawPlayer = (ctx, p) => {
    ctx.save();
    // Translate to player position (feet on ground)
    // The player's (x, y) is the center-bottom of the character (feet)
    const px = p.x;
    const py = p.y;
    ctx.translate(px, py);

    // Face direction
    if (!p.facingRight) {
      ctx.scale(-1, 1);
    }

    // ---- Improved Basotho fighter placeholder ----
    const anim = p.animTime;

    // Legs
    const legSpread = p.state === 'walk' ? Math.sin(anim * 0.3) * 12 : 0;
    const legLength = 35;
    const legThick = 6;

    // Left leg
    ctx.save();
    ctx.translate(-6, -10);
    ctx.rotate(legSpread * 0.02);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-legThick / 2, 0, legThick, legLength);
    ctx.restore();

    // Right leg
    ctx.save();
    ctx.translate(6, -10);
    ctx.rotate(-legSpread * 0.02);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-legThick / 2, 0, legThick, legLength);
    ctx.restore();

    // Feet (shoes)
    ctx.fillStyle = '#654321';
    ctx.fillRect(-10, legLength - 5, 20, 8);

    // Body (Basotho blanket - simple rectangle)
    ctx.fillStyle = '#D32F2F'; // red blanket
    ctx.fillRect(-18, -70, 36, 60);
    // Blanket pattern
    ctx.fillStyle = '#FFC107';
    ctx.fillRect(-12, -60, 24, 10);
    ctx.fillRect(-12, -40, 24, 10);

    // Arms
    const armSwing = p.state === 'walk' ? Math.sin(anim * 0.3) * 0.6 : 0;
    const armLen = 30;
    const armThick = 5;

    // Left arm
    ctx.save();
    ctx.translate(-18, -55);
    ctx.rotate(armSwing);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-armThick / 2, 0, armThick, armLen);
    ctx.restore();

    // Right arm
    ctx.save();
    ctx.translate(18, -55);
    ctx.rotate(-armSwing);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-armThick / 2, 0, armThick, armLen);
    ctx.restore();

    // Head
    ctx.fillStyle = '#8D5524';
    ctx.beginPath();
    ctx.arc(0, -80, 14, 0, Math.PI * 2);
    ctx.fill();

    // Basotho hat (mokorotlo) - cone shape
    ctx.fillStyle = '#B8860B';
    ctx.beginPath();
    ctx.moveTo(-16, -82);
    ctx.lineTo(0, -110);
    ctx.lineTo(16, -82);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Eyes and mouth (simple)
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(-4, -85, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, -85, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-4, -85, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, -85, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -75, 2, 0, Math.PI);
    ctx.stroke();

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

    // Movement input
    let moveDir = 0;
    if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A'] || touchMoveLeft.current) moveDir -= 1;
    if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D'] || touchMoveRight.current) moveDir += 1;
    p.vx = moveDir * p.speed;

    // Jump request (keyboard or touch)
    if (
      (keys.current[' '] || keys.current['Space'] ||
       keys.current['ArrowUp'] || keys.current['w'] || keys.current['W'] ||
       touchJump.current)
    ) {
      if (p.grounded && !jumpRequested.current) {
        p.vy = p.jumpForce;
        p.grounded = false;
        jumpRequested.current = true; // prevent holding jump to multi-jump
      }
    } else {
      jumpRequested.current = false;
    }

    // Gravity
    p.vy += 0.6;
    p.x += p.vx;
    p.y += p.vy;

    // Ground collision
    const feetBottom = p.y; // y is feet position
    if (feetBottom > groundY) {
      p.y = groundY;
      p.vy = 0;
      if (!p.grounded) {
        // Just landed
        p.landTimer = 10;
      }
      p.grounded = true;
    } else {
      p.grounded = false;
    }

    // Keep player inside canvas horizontally
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

    // Update facing direction
    if (moveDir > 0) p.facingRight = true;
    else if (moveDir < 0) p.facingRight = false;

    // Animation state
    p.animTime += 1;
    if (!p.grounded) {
      if (p.vy < 0) p.state = 'jump';
      else if (p.vy > 0 && p.landTimer <= 0) p.state = 'jump'; // falling
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

    // FPS
    const fs = fpsState.current;
    if (!fs.lastTime) fs.lastTime = timestamp;
    fs.frameCount++;
    if (timestamp - fs.fpsUpdateTime >= 1000) {
      fs.fps = Math.round((fs.frameCount * 1000) / (timestamp - fs.fpsUpdateTime));
      fs.frameCount = 0;
      fs.fpsUpdateTime = timestamp;
    }

    // Update
    update(canvas);

    // Render (camera offset applied later)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // For future scrolling: translate context by camera offset
    // For now camera is (0,0)
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
    // Place player on ground
    const p = player.current;
    const groundY = canvas.height * groundFrac;
    p.y = groundY;
    p.vy = 0;
    p.grounded = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Keyboard listeners
    const keyDown = (e) => {
      keys.current[e.key] = true;
      // Prevent page scrolling on arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    const keyUp = (e) => {
      keys.current[e.key] = false;
    };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // Resize
    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Start game loop
    animFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // Touch device detection
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