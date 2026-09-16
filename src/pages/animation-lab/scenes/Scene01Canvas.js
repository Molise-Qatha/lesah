/**
 * Scene01Canvas.js
 * Draws the scene to a canvas for recording.
 * Now supports cross-fading between two character poses.
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
    viewZoom,
    camX,
    camY,
    kopanangPrevImgRef,
    leratoPrevImgRef,
    kopanangPrevPose,
    leratoPrevPose,
  } = params;

  const vp = stageRef.current;
  if (!vp) return;

  const vpRect = vp.getBoundingClientRect();
  if (!vpRect.width || !vpRect.height) return;

  const sx = canvas.width / vpRect.width;
  const sy = canvas.height / vpRect.height;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const drawImgByRef = (imgRef, img, alphaOverride = null) => {
    if (!imgRef || !imgRef.current || !img) return;
    const r = imgRef.current.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const x = (r.left - vpRect.left) * sx;
    const y = (r.top - vpRect.top) * sy;
    const w = r.width * sx;
    const h = r.height * sy;
    if (alphaOverride !== null) {
      const prevAlpha = ctx.globalAlpha;
      ctx.globalAlpha = alphaOverride;
      ctx.drawImage(img, x, y, w, h);
      ctx.globalAlpha = prevAlpha;
    } else {
      ctx.drawImage(img, x, y, w, h);
    }
  };

  // Background
  if (layerVisibility.background) {
    drawImgByRef(backgroundImgRef, imagesRef.current['background']);
  }

  // Kopanang — prev (fading) then current
  if (layerVisibility.kopanang) {
    if (kopanangPrevPose && kopanangPrevImgRef?.current) {
      const opacity = parseFloat(window.getComputedStyle(kopanangPrevImgRef.current).opacity || '1');
      drawImgByRef(
        kopanangPrevImgRef,
        imagesRef.current[`kopanang_${kopanangPrevPose}`],
        opacity
      );
    }
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

  // Lerato — prev (fading) then current
  if (layerVisibility.lerato) {
    if (leratoPrevPose && leratoPrevImgRef?.current) {
      const opacity = parseFloat(window.getComputedStyle(leratoPrevImgRef.current).opacity || '1');
      drawImgByRef(
        leratoPrevImgRef,
        imagesRef.current[`lerato_${leratoPrevPose}`],
        opacity
      );
    }
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
      const domX = vpRect.width / 2 + (g.x * viewZoom + camX);
      const domY = vpRect.height / 2 + (g.y * viewZoom + camY);
      const cw = g.size * viewZoom * sx;
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
      const domX = vpRect.width / 2 + (bf.x * viewZoom + camX);
      const domY = vpRect.height / 2 + (bf.y * viewZoom + camY);
      const cw = 60 * bf.scale * viewZoom * sx;
      const ch = img.width ? (img.height / img.width) * cw : cw;

      ctx.drawImage(img, domX * sx - cw / 2, domY * sy - ch / 2, cw, ch);
    });
  }
}