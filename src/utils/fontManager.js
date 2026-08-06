const fs = require("fs");
const path = require("path");
const { GlobalFonts } = require("@napi-rs/canvas");

const FONT_DIR = path.join(__dirname, "..", "assets", "fonts");

const FAMILY_MAP = {
  apple: "InterDisplay",
  sfpro: "InterDisplay",
  arial: "Arial",
  roboto: "Roboto",
  inter: "InterDisplay",
  poppins: "Poppins",
  helvetica: "Arial",
  default: "InterDisplay"
};

const FILE_MAP = {
  InterDisplay: "Inter-Bold.ttf",
  Roboto: "Roboto-Bold.ttf",
  Poppins: "Poppins-Bold.ttf"
};

const registered = new Set();

function registerFontFile(filePath, family) {
  if (registered.has(family)) return family;
  if (!fs.existsSync(filePath)) return null;
  try {
    GlobalFonts.registerFromPath(filePath, family);
    registered.add(family);
    return family;
  } catch (err) {
    return null;
  }
}

function resolveFont(input) {
  if (!input) {
    return loadBuiltIn("default");
  }
  if (typeof input === "string") {
    const lower = input.toLowerCase().trim();
    if (lower.endsWith(".ttf") || lower.endsWith(".otf")) {
      const absolute = path.isAbsolute(input) ? input : path.join(process.cwd(), input);
      const family = "CustomFont" + Buffer.from(absolute).toString("hex").slice(0, 8);
      const registeredFamily = registerFontFile(absolute, family);
      if (registeredFamily) return registeredFamily;
      return loadBuiltIn("default");
    }
    if (FAMILY_MAP[lower]) {
      return loadBuiltIn(lower);
    }
    return loadBuiltIn("default");
  }
  return loadBuiltIn("default");
}

function loadBuiltIn(key) {
  const family = FAMILY_MAP[key] || FAMILY_MAP.default;
  const fileName = FILE_MAP[family];
  if (!fileName) return family;
  const filePath = path.join(FONT_DIR, fileName);
  const result = registerFontFile(filePath, family);
  return result || "sans-serif";
}

function listAvailableFonts() {
  return Object.keys(FAMILY_MAP).filter((key) => key !== "default");
}

module.exports = { resolveFont, listAvailableFonts };
