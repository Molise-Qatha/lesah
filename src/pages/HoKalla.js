import React, { useEffect, useRef } from 'react';
import { startGameLoop } from '../game/hoKalla/gameLoop';
import {
  initRenderer,
  clearCanvas,
  drawBackground,
  drawTitle,
  drawFPS,
  getCanvas
} from '../game/hoKalla/renderer';
import { initInput } from '../game/hoKalla/inputManager';
// Entity manager will be used later
// import * as EntityManager from '../game/hoKalla/entityManager';

const HoKalla = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  const handleResize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialise renderer with canvas
    initRenderer(canvas);

    // Initialise input manager
    initInput();

    // Resize handling
    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Render function passed to the loop
    const render = (fps) => {
      clearCanvas();
      drawBackground();
      drawTitle();
      drawFPS(fps);
    };

    // Start the game loop
    animFrameId.current = startGameLoop(render);

    return () => {
      window.removeEventListener('resize', handleResize);
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