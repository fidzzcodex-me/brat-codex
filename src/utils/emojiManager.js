const fs = require("fs");
const path = require("path");
const { parse } = require("twemoji-parser");

const EMOJI_DIR = path.join(__dirname, "..", "assets", "emoji");

const SUPPORTED_PROVIDERS = [
  "apple",
  "google",
  "twitter",
  "samsung",
  "microsoft",
  "facebook",
  "openmoji",
  "noto"
];

function normalizeProvider(name) {
  if (typeof name !== "string") return "apple";
  const lower = name.toLowerCase().trim();
  return SUPPORTED_PROVIDERS.includes(lower) ? lower : "apple";
}

function extractEmojis(text) {
  const entities = parse(text, { assetType: "png" });
  return entities.map((entity) => ({
    text: entity.text,
    indices: entity.indices,
    codepoints: entity.url.split("/").pop().replace(".png", "")
  }));
}

function getEmojiFilePath(codepoints, provider) {
  const providerDir = path.join(EMOJI_DIR, normalizeProvider(provider));
  const fileName = codepoints + ".png";
  const filePath = path.join(providerDir, fileName);
  if (fs.existsSync(filePath)) return filePath;
  const fallbackDir = path.join(EMOJI_DIR, "apple");
  const fallbackPath = path.join(fallbackDir, fileName);
  if (fs.existsSync(fallbackPath)) return fallbackPath;
  return null;
}

function splitTextWithEmojis(text) {
  const entities = extractEmojis(text);
  if (entities.length === 0) {
    return [{ type: "text", value: text }];
  }
  const segments = [];
  let cursor = 0;
  for (const entity of entities) {
    const [start, end] = entity.indices;
    if (start > cursor) {
      segments.push({ type: "text", value: text.slice(cursor, start) });
    }
    segments.push({
      type: "emoji",
      value: entity.text,
      codepoints: entity.codepoints
    });
    cursor = end;
  }
  if (cursor < text.length) {
    segments.push({ type: "text", value: text.slice(cursor) });
  }
  return segments;
}

module.exports = {
  SUPPORTED_PROVIDERS,
  normalizeProvider,
  extractEmojis,
  getEmojiFilePath,
  splitTextWithEmojis
};
