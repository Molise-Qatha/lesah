import React, { useEffect, useRef, useState } from 'react';
import './HoKalla.css';

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const keys = useRef({});

  // Touch movement flags
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  // Player state
  const player = useRef({
    x: 200,                  // starting position
    y: 0,                    // will be set on resize based on ground
    width: 40,
    height: 80,
    vx: 0,
    vy: 0,
    speed: 3,
    facingRight: true,
    grounded: false,
    animTime: 0,
    state: 'idle',           // 'idle' | 'walk'
  });

  // FPS tracking
  const fpsState = useRef({
    lastTime: 0,
    fps: 0,
    frameCount: 0,
    fpsUpdateTime: 0,
  });

  // Ground level (relative to canvas)
  const groundY = useRef(0.65);

  // ---------- Drawing helpers ----------
  const drawBackground = (ctx, canvas) => {
    const groundYVal = canvas.height * groundY.current;
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundYVal);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#E0F0FF');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, groundYVal);

    // Grass
    const grassGrad = ctx.createLinearGradient(0, groundYVal, 0, canvas.height);
    grassGrad.addColorStop(0, '#4caf50');
    grassGrad.addColorStop(1, '#2e7d32');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, groundYVal, canvas.width, canvas.height - groundYVal);

    // Ground line
    ctx.beginPath();
    ctx.moveTo(0, groundYVal);
    ctx.lineTo(canvas.width, groundYVal);
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawPlayer = (ctx, p) => {
    // Simple stick figure placeholder
    ctx.save();
    ctx.translate(p.x, p.y);

    // Head
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, -p.height * 0.8, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -p.height * 0.8 + 12);
    ctx.lineTo(0, -p.height * 0.2);
    ctx.stroke();

    // Arms (oscillate for animation)
    const armSwing = Math.sin(p.animTime * 0.3) * 0.5; // idle subtle movement
    const armSwingWalk = Math.sin(p.animTime * 0.3) * 0.8; // walk swing
    const swing = p.state === 'walk' ? armSwingWalk : armSwing * 0.5;
    ctx.save();
    ctx.translate(0, -p.height * 0.6);
    ctx.rotate(swing);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    ctx.rotate(-2 * swing);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-20, 0);
    ctx.stroke();
    ctx.restore();

    // Legs (oscillate)
    const legSwing = Math.sin(p.animTime * 0.3) * 0.4;
    const legSwingWalk = Math.sin(p.animTime * 0.3) * 0.7;
    const legSw = p.state === 'walk' ? legSwingWalk : legSwing * 0.3;
    ctx.save();
    ctx.translate(0, -p.height * 0.2);
    ctx.rotate(legSw);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, 20);
    ctx.stroke();
    ctx.rotate(-2 * legSw);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, 20);
    ctx.stroke();
    ctx.restore();

    // Feet
    ctx.beginPath();
    ctx.arc(8, -p.height * 0.2 + 20, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#8B4513';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-8, -p.height * 0.2 + 20, 4, 0, Math.PI * 2);
    ctx.fill();

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
    const groundLevel = canvas.height * groundY.current;

    // Movement input (keyboard + touch)
    let moveDir = 0;
    if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A'] || moveLeft) moveDir -= 1;
    if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D'] || moveRight) moveDir += 1;

    p.vx = moveDir * p.speed;

    // Gravity
    p.vy += 0.6; // gravity
    p.x += p.vx;
    p.y += p.vy;

    // Ground collision
    const playerBottom = p.y + p.height * 0.2 + 20; // approximate feet position
    if (playerBottom > groundLevel) {
      p.y = groundLevel - (p.height * 0.2 + 20);
      p.vy = 0;
      p.grounded = true;
    } else {
      p.grounded = false;
    }

    // Keep player in bounds
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

    // Update facing direction
    if (moveDir > 0) p.facingRight = true;
    else if (moveDir < 0) p.facingRight = false;

    // Animation state and timer
    p.animTime += 1;
    p.state = (moveDir !== 0) ? 'walk' : 'idle';
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

    // Update player physics
    update(canvas);

    // Render
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
    // Reset player Y to ground on resize
    const p = player.current;
    const groundLevel = canvas.height * groundY.current;
    p.y = groundLevel - (p.height * 0.2 + 20); // place feet on ground
    p.vy = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Keyboard input
    const keyDown = (e) => { keys.current[e.key] = true; };
    const keyUp = (e) => { keys.current[e.key] = false; };
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

  // Touch button handlers
  const handleLeftDown = () => setMoveLeft(true);
  const handleLeftUp = () => setMoveLeft(false);
  const handleRightDown = () => setMoveRight(true);
  const handleRightUp = () => setMoveRight(false);

  return (
    <div className="ho-kalla-container" ref={containerRef}>
      <canvas ref={canvasRef} className="ho-kalla-canvas" />
      {isTouchDevice && (
        <div className="touch-controls">
          <button
            className="touch-btn left-btn"
            onTouchStart={handleLeftDown}
            onTouchEnd={handleLeftUp}
            onMouseDown={handleLeftDown}
            onMouseUp={handleLeftUp}
            onMouseLeave={handleLeftUp}
          >
            ◀ Move Left
          </button>
          <button
            className="touch-btn right-btn"
            onTouchStart={handleRightDown}
            onTouchEnd={handleRightUp}
            onMouseDown={handleRightDown}
            onMouseUp={handleRightUp}
            onMouseLeave={handleRightUp}
          >
            ▶ Move Right
          </button>
        </div>
      )}
    </div>
  );
};

export default HoKalla;