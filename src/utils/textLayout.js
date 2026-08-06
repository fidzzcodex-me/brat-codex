const RTL_REGEX = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;

function detectRTL(text) {
  return RTL_REGEX.test(text);
}

function wrapLine(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    const width = ctx.measureText(candidate).width;
    if (width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function wrapParagraphs(ctx, text, maxWidth) {
  const paragraphs = text.split("\n");
  const lines = [];
  for (const paragraph of paragraphs) {
    if (paragraph.trim().length === 0) {
      lines.push("");
      continue;
    }
    const wrapped = wrapLine(ctx, paragraph, maxWidth);
    lines.push(...wrapped);
  }
  return lines;
}

function computeAutoFontSize(ctx, text, fontFamily, options) {
  const {
    maxWidth,
    maxHeight,
    minFontSize = 18,
    maxFontSize = 140,
    lineHeightRatio = 1.18,
    fontWeight = 700
  } = options;

  let fontSize = maxFontSize;
  let lines = [];

  while (fontSize >= minFontSize) {
    ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
    lines = wrapParagraphs(ctx, text, maxWidth);
    const lineHeight = fontSize * lineHeightRatio;
    const totalHeight = lines.length * lineHeight;

    let widestLine = 0;
    for (const line of lines) {
      const width = ctx.measureText(line).width;
      if (width > widestLine) widestLine = width;
    }

    if (totalHeight <= maxHeight && widestLine <= maxWidth) {
      break;
    }
    fontSize -= 2;
  }

  if (fontSize < minFontSize) fontSize = minFontSize;
  ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
  lines = wrapParagraphs(ctx, text, maxWidth);

  return { fontSize, lines, lineHeight: fontSize * lineHeightRatio };
}

function computeLineX(ctx, line, align, boxX, boxWidth) {
  const width = ctx.measureText(line).width;
  if (align === "center") {
    return boxX + (boxWidth - width) / 2;
  }
  if (align === "right" || align === "justify") {
    return boxX + (boxWidth - width);
  }
  return boxX;
}

module.exports = {
  detectRTL,
  wrapLine,
  wrapParagraphs,
  computeAutoFontSize,
  computeLineX
};
