const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const { buildScene } = require("../renderer/imageRenderer");

function createTempWorkspace() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "brat-codex-"));
  return dir;
}

function cleanupWorkspace(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (err) {}
}

function splitWords(text) {
  return text.split(/\s+/).filter(Boolean);
}

function buildFrameTexts(text, totalFrames) {
  const words = splitWords(text);
  if (words.length === 0) return [text];

  const frames = [];
  const framesPerWord = Math.max(1, Math.floor(totalFrames / words.length));

  for (let i = 0; i < words.length; i++) {
    const partial = words.slice(0, i + 1).join(" ");
    for (let f = 0; f < framesPerWord; f++) {
      frames.push(partial);
    }
  }

  while (frames.length < totalFrames) {
    frames.push(text);
  }

  return frames.slice(0, totalFrames);
}

async function generateFrames(text, options, workspace, onProgress, signal) {
  const fps = options.fps || 12;
  const duration = options.duration || 2.5;
  const totalFrames = Math.max(1, Math.round(fps * duration));

  const frameTexts = options.animateWords === false
    ? new Array(totalFrames).fill(text)
    : buildFrameTexts(text, totalFrames);

  const framePaths = [];

  for (let i = 0; i < frameTexts.length; i++) {
    if (signal && signal.aborted) {
      throw new Error("Rendering cancelled");
    }

    const canvas = await buildScene(frameTexts[i], options);
    const buffer = await canvas.encode("png");
    const framePath = path.join(workspace, "frame-" + String(i).padStart(5, "0") + ".png");
    fs.writeFileSync(framePath, buffer);
    framePaths.push(framePath);

    if (typeof onProgress === "function") {
      onProgress({ current: i + 1, total: frameTexts.length, stage: "frames" });
    }
  }

  return { framePaths, fps };
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      reject(err);
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("ffmpeg exited with code " + code + "\n" + stderr));
      }
    });
  });
}

async function encodeMp4(workspace, fps, outputPath) {
  const inputPattern = path.join(workspace, "frame-%05d.png");
  const args = [
    "-y",
    "-framerate", String(fps),
    "-i", inputPattern,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    outputPath
  ];
  await runFfmpeg(args);
}

async function encodeAnimatedWebp(workspace, fps, outputPath, quality) {
  const inputPattern = path.join(workspace, "frame-%05d.png");
  const args = [
    "-y",
    "-framerate", String(fps),
    "-i", inputPattern,
    "-loop", "0",
    "-vcodec", "libwebp",
    "-lossless", "0",
    "-q:v", String(quality || 70),
    "-preset", "default",
    "-an",
    outputPath
  ];
  await runFfmpeg(args);
}

async function encodeGif(workspace, fps, outputPath) {
  const inputPattern = path.join(workspace, "frame-%05d.png");
  const args = [
    "-y",
    "-framerate", String(fps),
    "-i", inputPattern,
    "-vf", "split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
    outputPath
  ];
  await runFfmpeg(args);
}

async function renderVideo(text, options = {}) {
  const workspace = createTempWorkspace();
  try {
    const { fps } = await generateFrames(
      text,
      options,
      workspace,
      options.onProgress,
      options.signal
    );

    const format = options.format || "mp4";
    const outputPath = path.join(workspace, "output." + format);

    if (typeof options.onProgress === "function") {
      options.onProgress({ current: 0, total: 1, stage: "encode" });
    }

    if (format === "gif") {
      await encodeGif(workspace, fps, outputPath);
    } else if (format === "webp") {
      await encodeAnimatedWebp(workspace, fps, outputPath, options.quality);
    } else {
      await encodeMp4(workspace, fps, outputPath);
    }

    if (typeof options.onProgress === "function") {
      options.onProgress({ current: 1, total: 1, stage: "done" });
    }

    const buffer = fs.readFileSync(outputPath);
    return buffer;
  } finally {
    cleanupWorkspace(workspace);
  }
}

async function renderVideoSticker(text, options = {}) {
  const stickerOptions = Object.assign({}, options, {
    width: options.width || 512,
    height: options.height || 512,
    padding: typeof options.padding === "number" ? options.padding : 48,
    format: "webp",
    fps: options.fps || 10,
    duration: options.duration || 2.2,
    quality: options.quality || 60
  });

  return renderVideo(text, stickerOptions);
}

module.exports = { renderVideo, renderVideoSticker, generateFrames };
