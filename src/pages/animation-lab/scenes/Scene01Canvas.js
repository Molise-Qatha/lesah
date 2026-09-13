/**
 * Scene01Canvas.js
 *
 * Draws the scene to a canvas for recording.
 * Reads the actual DOM positions of each visible element using
 * getBoundingClientRect(), so the canvas output matches the preview
 * exactly — no more anchor/mismatch issues.
 */

export function drawSceneToCanvas(canvas, ctx, params) {
  const {
    stageRef,
    imagesRef,
    backgroundImgRef,
    kopanangImgRef,
    leratoImgRef,
    kopanangMouthImgRef,
    leratoMouthImgRef,
    layerVisibility,
    selectedKopanangPose,
    selectedLeratoPose,
    kopanangTalking,
    leratoTalking,
    mouthIndex,
    grassEnabled,
    grassSway,
    grassPositions,
    butterflyEnabled,
    butterflies,
    MOUTH_FRAMES,
  } = params;

  const vp = stageRef.current;
  if (!vp) return;

  const vpRect = vp.getBoundingClientRect();
  if (!vpRect.width || !vpRect.height) return;

  const sx = canvas.width / vpRect.width;
  const sy = canvas.height / vpRect.height;

  // Clear the canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw an <img> element using its real DOM bounding rect
  const drawImgByRef = (imgRef, img) => {
    if (!imgRef || !imgRef.current || !img) return;
    const r = imgRef.current.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const x = (r.left - vpRect.left) * sx;
    const y = (r.top - vpRect.top) * sy;
    const w = r.width * sx;
    const h = r.height * sy;
    ctx.drawImage(img, x, y, w, h);
  };

  // Background
  if (layerVisibility.background) {
    drawImgByRef(backgroundImgRef, imagesRef.current['background']);
  }

  // Kopanang + mouth
  if (layerVisibility.kopanang) {
    drawImgByRef(
      kopanangImgRef,
      imagesRef.current[`kopanang_${selectedKopanangPose}`]
    );
    if (kopanangTalking) {
      drawImgByRef(
        kopanangMouthImgRef,
        imagesRef.current[`mouth_${MOUTH_FRAMES[mouthIndex].id}`]
      );
    }
  }

  // Lerato + mouth
  if (layerVisibility.lerato) {
    drawImgByRef(
      leratoImgRef,
      imagesRef.current[`lerato_${selectedLeratoPose}`]
    );
    if (leratoTalking) {
      drawImgByRef(
        leratoMouthImgRef,
        imagesRef.current[`mouth_${MOUTH_FRAMES[mouthIndex].id}`]
      );
    }
  }

  // Grass
  if (grassEnabled) {
    grassPositions.forEach((g, idx) => {
      const img = imagesRef.current[`grass_${idx}`];
      if (!img) return;
      const domX = vpRect.width / 2 + g.x;
      const domY = vpRect.height / 2 + g.y;
      const cw = g.size * sx;
      const ch = img.width ? (img.height / img.width) * cw : cw;
      const swayDeg = grassSway * (0.5 + idx * 0.15);

      ctx.save();
      ctx.translate(domX * sx, domY * sy);
      ctx.rotate((swayDeg * Math.PI) / 180);
      ctx.drawImage(img, -cw / 2, -ch, cw, ch);
      ctx.restore();
    });
  }

  // Butterflies
  if (butterflyEnabled) {
    butterflies.forEach((bf) => {
      const img = imagesRef.current[`butterfly_${bf.frame}`];
      if (!img) return;
      const domX = vpRect.width / 2 + bf.x;
      const domY = vpRect.height / 2 + bf.y;
      const cw = 60 * bf.scale * sx;
      const ch = img.width ? (img.height / img.width) * cw : cw;

      ctx.drawImage(img, domX * sx - cw / 2, domY * sy - ch / 2, cw, ch);
    });
  }
}