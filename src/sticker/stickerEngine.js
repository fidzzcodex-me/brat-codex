const sharp = require("sharp");
const { buildScene } = require("../renderer/imageRenderer");

const EXIF_STICKER_IDENTIFIER = Buffer.from([
  0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
  0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
]);

function buildExifPayload(metadata) {
  const json = {
    "sticker-pack-id": metadata.packId || "brat-codex-" + Date.now(),
    "sticker-pack-name": metadata.packname || "Brat Codex",
    "sticker-pack-publisher": metadata.author || "brat-codex",
    "emojis": metadata.emojis || ["🗣️"],
    "android-app-store-link": metadata.androidLink || "",
    "ios-app-store-link": metadata.iosLink || ""
  };

  const jsonBuffer = Buffer.from(JSON.stringify(json), "utf8");
  const exifHeader = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
    0x07, 0x00
  ]);
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(jsonBuffer.length, 0);

  return Buffer.concat([exifHeader, lengthBuffer, jsonBuffer]);
}

function injectExif(webpBuffer, exifPayload) {
  const exifChunkHeader = Buffer.from("EXIF", "ascii");
  const chunkSize = Buffer.alloc(4);
  chunkSize.writeUInt32LE(exifPayload.length, 0);

  let exifChunk = Buffer.concat([exifChunkHeader, chunkSize, exifPayload]);
  if (exifChunk.length % 2 !== 0) {
    exifChunk = Buffer.concat([exifChunk, Buffer.from([0x00])]);
  }

  const riffHeader = webpBuffer.slice(0, 12);
  const rest = webpBuffer.slice(12);
  const newSize = riffHeader.readUInt32LE(4) + exifChunk.length;

  const newRiffHeader = Buffer.from(riffHeader);
  newRiffHeader.writeUInt32LE(newSize, 4);

  return Buffer.concat([newRiffHeader, rest, exifChunk]);
}

async function renderSticker(text, options = {}) {
  const stickerOptions = Object.assign({}, options, {
    width: options.width || 512,
    height: options.height || 512,
    padding: typeof options.padding === "number" ? options.padding : 48
  });

  const canvas = await buildScene(text, stickerOptions);
  const pngBuffer = await canvas.encode("png");

  const webpBuffer = await sharp(pngBuffer)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: options.quality || 90 })
    .toBuffer();

  const exifPayload = buildExifPayload({
    packname: options.packname,
    author: options.author,
    emojis: options.categories || options.emojiTags,
    packId: options.packId
  });

  return injectExif(webpBuffer, exifPayload);
}

module.exports = { renderSticker, buildExifPayload, injectExif };
