import React, { useEffect, useRef } from 'react';
import './HoKalla.css';

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  // Game state (FPS tracking)
  const gameState = useRef({
    lastTime: 0,
    fps: 0,
    frameCount: 0,
    fpsUpdateTime: 0,
  });

  // ---------- Renderer ----------
  const initRenderer = (canvas) => {
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
  };

  const drawBackground = (ctx, canvas) => {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.65);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#E0F0FF');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);

    // Grass gradient
    const grassGrad = ctx.createLinearGradient(0, canvas.height * 0.65, 0, canvas.height);
    grassGrad.addColorStop(0, '#4caf50');
    grassGrad.addColorStop(1, '#2e7d32');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

    // Ground line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.65);
    ctx.lineTo(canvas.width, canvas.height * 0.65);
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    ctx.stroke();
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

  // ---------- Game loop ----------
  const startGameLoop = (render) => {
    const loop = (timestamp) => {
      const state = gameState.current;
      if (!state.lastTime) state.lastTime = timestamp;
      state.frameCount++;
      if (timestamp - state.fpsUpdateTime >= 1000) {
        state.fps = Math.round((state.frameCount * 1000) / (timestamp - state.fpsUpdateTime));
        state.frameCount = 0;
        state.fpsUpdateTime = timestamp;
      }

      render(state.fps);
      animFrameId.current = requestAnimationFrame(loop);
    };
    animFrameId.current = requestAnimationFrame(loop);
  };

  // ---------- Resize ----------
  const handleResize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  };

  // ---------- Setup ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { ctx } = initRenderer(canvas);

    // Input init (empty for now)
    const keys = {};
    const keyDown = (e) => { keys[e.key] = true; };
    const keyUp = (e) => { keys[e.key] = false; };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // Resize
    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Render function
    const render = (fps) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(ctx, canvas);
      drawTitle(ctx, canvas);
      drawFPS(ctx, fps);
    };

    // Start loop
    startGameLoop(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      resizeObserver.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div className="ho-kalla-container" ref={containerRef}>
      <canvas ref={canvasRef} className="ho-kalla-canvas" />
    </div>
  );
};

export default HoKalla;