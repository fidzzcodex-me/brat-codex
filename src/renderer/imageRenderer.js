const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const { resolveTheme } = require("../assets/themes");
const { resolveFont } = require("../utils/fontManager");
const { computeAutoFontSize, computeLineX, detectRTL } = require("../utils/textLayout");
const { drawCard } = require("../utils/canvasHelpers");
const { splitTextWithEmojis, getEmojiFilePath } = require("../utils/emojiManager");
const { loadImage } = require("@napi-rs/canvas");

async function buildScene(text, options = {}) {
  const width = options.width || 1024;
  const height = options.height || 1024;
  const padding = typeof options.padding === "number" ? options.padding : 96;

  const themeName = options.theme || "apple";
  const baseTheme = resolveTheme(themeName);

  const background = options.background || baseTheme.background;
  const cardColor = options.card || baseTheme.card;
  const textColor = options.text || baseTheme.text;
  const radius = typeof options.radius === "number" ? options.radius : baseTheme.radius;
  const shadowBlur = typeof options.shadow === "number" ? options.shadow : 0;
  const shadowColor = options.shadowColor || baseTheme.shadow;
  const strokeColor = options.strokeColor || null;
  const strokeWidth = options.stroke || 0;
  const opacity = typeof options.opacity === "number" ? options.opacity : 1;

  const align = options.align || (detectRTL(text) ? "right" : "center");
  const lineSpacing = options.lineSpacing || 1.18;
  const emojiProvider = options.emoji || "apple";

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const cardX = padding / 2;
  const cardY = padding / 2;
  const cardWidth = width - padding;
  const cardHeight = height - padding;

  drawCard(ctx, {
    x: cardX,
    y: cardY,
    width: cardWidth,
    height: cardHeight,
    radius,
    color: cardColor,
    shadowColor,
    shadowBlur,
    strokeColor,
    strokeWidth,
    opacity
  });

  const fontFamily = resolveFont(options.font);
  const innerPadding = padding * 1.1;
  const textMaxWidth = width - innerPadding * 2;
  const textMaxHeight = height - innerPadding * 2;

  const { fontSize, lines, lineHeight } = computeAutoFontSize(ctx, text, fontFamily, {
    maxWidth: textMaxWidth,
    maxHeight: textMaxHeight,
    minFontSize: options.minFontSize || 18,
    maxFontSize: options.maxFontSize || 140,
    lineHeightRatio: lineSpacing,
    fontWeight: options.fontWeight || 800
  });

  ctx.font = (options.fontWeight || 800) + " " + fontSize + "px " + fontFamily;
  ctx.fillStyle = textColor;
  ctx.textBaseline = "alphabetic";

  const totalTextHeight = lines.length * lineHeight;
  let cursorY = (height - totalTextHeight) / 2 + fontSize;

  const emojiCache = new Map();

  for (const line of lines) {
    const lineX = computeLineX(ctx, line, align, innerPadding, textMaxWidth);
    await drawLineWithEmojis(ctx, line, lineX, cursorY, fontSize, emojiProvider, emojiCache);
    cursorY += lineHeight;
  }

  return canvas;
}

async function drawLineWithEmojis(ctx, line, startX, baselineY, fontSize, emojiProvider, cache) {
  const segments = splitTextWithEmojis(line);
  let cursorX = startX;

  for (const segment of segments) {
    if (segment.type === "text") {
      ctx.fillText(segment.value, cursorX, baselineY);
      cursorX += ctx.measureText(segment.value).width;
      continue;
    }

    const filePath = getEmojiFilePath(segment.codepoints, emojiProvider);
    if (!filePath) {
      ctx.fillText(segment.value, cursorX, baselineY);
      cursorX += ctx.measureText(segment.value).width;
      continue;
    }

    const cacheKey = filePath;
    let image = cache.get(cacheKey);
    if (!image) {
      image = await loadImage(filePath);
      cache.set(cacheKey, image);
    }

    const emojiSize = fontSize * 1.05;
    const emojiY = baselineY - emojiSize * 0.85;
    ctx.drawImage(image, cursorX, emojiY, emojiSize, emojiSize);
    cursorX += emojiSize * 1.05;
  }
}

async function renderImage(text, options = {}) {
  const canvas = await buildScene(text, options);
  return canvas.encode("png");
}

module.exports = { renderImage, buildScene };
