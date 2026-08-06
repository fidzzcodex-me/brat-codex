const { renderImage } = require("./src/renderer/imageRenderer");
const { renderSticker } = require("./src/sticker/stickerEngine");
const { renderVideo, renderVideoSticker } = require("./src/video/videoEngine");
const { themes } = require("./src/assets/themes");
const { listAvailableFonts } = require("./src/utils/fontManager");
const { SUPPORTED_PROVIDERS } = require("./src/utils/emojiManager");

async function brat(text, options = {}) {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("brat-codex: text must be a non empty string");
  }
  return renderImage(text, options);
}

async function bratSticker(text, options = {}) {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("brat-codex: text must be a non empty string");
  }
  return renderSticker(text, options);
}

async function bratVideo(text, options = {}) {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("brat-codex: text must be a non empty string");
  }
  return renderVideo(text, options);
}

async function bratVideoSticker(text, options = {}) {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("brat-codex: text must be a non empty string");
  }
  return renderVideoSticker(text, options);
}

const fonts = listAvailableFonts();
const emojis = SUPPORTED_PROVIDERS;

module.exports = {
  brat,
  bratSticker,
  bratVideo,
  bratVideoSticker,
  themes,
  fonts,
  emojis
};
