let lastTime = 0;
let fps = 0;
let frameCount = 0;
let fpsUpdateTime = 0;

export function startGameLoop(render, update) {
  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    
    // FPS counter
    frameCount++;
    if (timestamp - fpsUpdateTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (timestamp - fpsUpdateTime));
      frameCount = 0;
      fpsUpdateTime = timestamp;
    }

    // Optional: call update logic in future
    if (update) update(timestamp);

    render(fps);
    lastTime = timestamp;
    return requestAnimationFrame(loop);
  }
  return requestAnimationFrame(loop);
}