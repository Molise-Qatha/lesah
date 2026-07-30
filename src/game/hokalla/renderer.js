let canvas, ctx;

export function initRenderer(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
}

export function getCanvas() {
  return { canvas, ctx };
}

export function drawBackground() {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.65);
  skyGrad.addColorStop(0, '#87CEEB');   // light blue
  skyGrad.addColorStop(1, '#E0F0FF');   // pale
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);

  // Grass gradient
  const grassGrad = ctx.createLinearGradient(0, canvas.height * 0.65, 0, canvas.height);
  grassGrad.addColorStop(0, '#4caf50');
  grassGrad.addColorStop(1, '#2e7d32');
  ctx.fillStyle = grassGrad;
  ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

  // Simple ground line
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.65);
  ctx.lineTo(canvas.width, canvas.height * 0.65);
  ctx.strokeStyle = '#388E3C';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawTitle() {
  ctx.save();
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 6;
  ctx.textAlign = 'center';
  ctx.fillText('Ho Kalla (Prototype)', canvas.width / 2, 80);
  ctx.restore();
}

export function drawFPS(fps) {
  ctx.save();
  ctx.font = '16px monospace';
  ctx.fillStyle = '#ffff00';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 3;
  ctx.textAlign = 'left';
  ctx.fillText(`FPS: ${fps}`, 10, 30);
  ctx.restore();
}

export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}