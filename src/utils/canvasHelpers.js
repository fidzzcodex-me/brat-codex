function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawCard(ctx, options) {
  const {
    x,
    y,
    width,
    height,
    radius,
    color,
    shadowColor,
    shadowBlur = 0,
    strokeColor,
    strokeWidth = 0,
    opacity = 1
  } = options;

  ctx.save();
  ctx.globalAlpha = opacity;

  if (shadowColor && shadowBlur > 0) {
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetY = shadowBlur / 3;
  }

  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  if (strokeColor && strokeWidth > 0) {
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }

  ctx.restore();
}

module.exports = { drawRoundedRect, drawCard };
