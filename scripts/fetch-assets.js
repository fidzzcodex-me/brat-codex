const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.join(__dirname, "..");
const FONT_DIR = path.join(ROOT, "src", "assets", "fonts");
const EMOJI_DIR = path.join(ROOT, "src", "assets", "emoji");

const FONT_SOURCES = [
  {
    url: "https://github.com/rsms/inter/raw/v4.0/docs/font-files/Inter-Bold.ttf",
    dest: path.join(FONT_DIR, "Inter-Bold.ttf")
  },
  {
    url: "https://github.com/google/fonts/raw/main/ofl/roboto/Roboto%5Bwdth%2Cwght%5D.ttf",
    dest: path.join(FONT_DIR, "Roboto-Bold.ttf")
  },
  {
    url: "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf",
    dest: path.join(FONT_DIR, "Poppins-Bold.ttf")
  }
];

const EMOJI_PROVIDERS = [
  "apple",
  "google",
  "twitter",
  "samsung",
  "microsoft",
  "facebook",
  "openmoji",
  "noto"
];

const TWEMOJI_BASE =
  "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/";

const SAMPLE_CODEPOINTS = [
  "1f600", "1f602", "1f604", "1f60d", "1f622", "1f62d",
  "1f525", "2764", "1f44d", "1f64f", "1f60e", "1f621",
  "1f914", "1f973", "1f62c", "1f60a", "1f440", "1f4af"
];

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          file.close();
          downloadFile(response.headers.location, dest).then(resolve);
          return;
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          resolve(false);
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      })
      .on("error", () => {
        file.close();
        fs.unlink(dest, () => {});
        resolve(false);
      });
  });
}

async function fetchFonts() {
  for (const source of FONT_SOURCES) {
    if (fs.existsSync(source.dest)) continue;
    await downloadFile(source.url, source.dest);
  }
}

async function fetchEmojiSet() {
  for (const provider of EMOJI_PROVIDERS) {
    const providerDir = path.join(EMOJI_DIR, provider);
    fs.mkdirSync(providerDir, { recursive: true });
    for (const codepoint of SAMPLE_CODEPOINTS) {
      const dest = path.join(providerDir, codepoint + ".png");
      if (fs.existsSync(dest)) continue;
      const url = TWEMOJI_BASE + codepoint + ".png";
      await downloadFile(url, dest);
    }
  }
}

async function main() {
  try {
    await fetchFonts();
    await fetchEmojiSet();
  } catch (err) {
    process.exitCode = 0;
  }
}

main();
