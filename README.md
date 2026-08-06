# brat-codex

Production ready Brat style image, sticker, video, and animated sticker generation library, built for WhatsApp Bot developers.

`brat-codex` renders text onto a clean rounded card, exactly like the iPhone Notes / Apple style look, with full theme, font, and emoji customization. It ships with image rendering, WhatsApp compatible sticker generation, MP4/GIF video generation, and animated WEBP video stickers, with no manual ffmpeg installation required.

---

## Installation

```bash
npm install brat-codex
```

On install, `brat-codex` automatically downloads its bundled open license font and emoji assets in the background. No manual setup is required. If your environment has no internet access during install, the library still works using system fallback fonts and text glyphs.

Node.js 18 or newer is required.

---

## Quick Start

CommonJS

```js
const { brat, bratSticker, bratVideo, bratVideoSticker } = require("brat-codex");

const image = await brat("hello");
const sticker = await bratSticker("hello");
const video = await bratVideo("hello world");
const videoSticker = await bratVideoSticker("hello");
```

ESM

```js
import { brat, bratSticker, bratVideo, bratVideoSticker } from "brat-codex";
```

---

## Default Style

Calling `brat("hello")` with no options renders:

- White rounded card
- Bold centered text
- Apple style font mapping
- Apple style emoji mapping
- Auto scaled font size so text never overflows or crops

This matches the familiar iPhone Notes screenshot look used in the original Brat meme format.

---

## API Reference

### `brat(text, options?)`

Renders a single PNG image.

Returns: `Promise<Buffer>` (PNG)

```js
const image = await brat("Hello");
```

### `bratSticker(text, options?)`

Renders a WhatsApp compatible static sticker.

Returns: `Promise<Buffer>` (WEBP, with sticker EXIF metadata embedded)

```js
const sticker = await bratSticker("Hello", {
  packname: "Codex",
  author: "Fidzz"
});
```

### `bratVideo(text, options?)`

Renders an animated video where words appear progressively.

Returns: `Promise<Buffer>` (MP4 by default, or GIF / animated WEBP depending on `format`)

```js
const video = await bratVideo("Hello World");
```

### `bratVideoSticker(text, options?)`

Renders an animated WEBP sticker, optimized automatically for WhatsApp size and FPS limits.

Returns: `Promise<Buffer>` (animated WEBP)

```js
const sticker = await bratVideoSticker("Hello");
```

---

## Options Reference

All four APIs accept a shared set of styling options, plus API specific options.

### Shared styling options

| Option | Type | Default | Description |
|---|---|---|---|
| `theme` | string | `"apple"` | One of the built in themes, or `"custom"` |
| `background` | string (hex/rgba) | theme default | Overrides outer background color |
| `card` | string (hex/rgba) | theme default | Overrides card background color |
| `text` | string (hex/rgba) | theme default | Overrides text color |
| `width` | number | `1024` | Canvas width in pixels |
| `height` | number | `1024` | Canvas height in pixels |
| `padding` | number | `96` | Outer padding around the card |
| `radius` | number | theme default | Card corner radius |
| `shadow` | number | `0` | Shadow blur amount |
| `shadowColor` | string | theme default | Shadow color |
| `stroke` | number | `0` | Card border width |
| `strokeColor` | string | `null` | Card border color |
| `opacity` | number | `1` | Card opacity |
| `font` | string | `"apple"` | Font name or path to a `.ttf`/`.otf` file |
| `fontWeight` | number | `800` | Font weight used for rendering |
| `minFontSize` | number | `18` | Minimum font size for auto scaling |
| `maxFontSize` | number | `140` | Maximum font size for auto scaling |
| `emoji` | string | `"apple"` | Emoji provider style name |
| `align` | string | `"center"` or auto (RTL) | `"left"`, `"center"`, `"right"`, `"justify"` |
| `lineSpacing` | number | `1.18` | Line height multiplier |

### Theme names

`apple`, `white`, `black`, `dark`, `brat`, `lime`, `purple`, `pink`, `orange`, `sky`, `forest`, `coffee`, `sand`, `rose`, `custom`

```js
await brat("hello", { theme: "black" });
await brat("hello", { theme: "purple" });
```

### Custom theme

```js
await brat("hello", {
  background: "#ffffff",
  card: "#ffffff",
  text: "#000000"
});
```

### Emoji provider names

`apple`, `google`, `twitter`, `samsung`, `microsoft`, `facebook`, `openmoji`, `noto`

All provider names map to the bundled open license emoji sprite set, ensuring consistent rendering across every platform without relying on proprietary emoji artwork. Passing any of these names selects the matching visual style label.

```js
await brat("hello 🔥", { emoji: "google" });
```

### Font names

`apple`, `sfpro`, `arial`, `roboto`, `inter`, `poppins`, `helvetica`, or a direct path to a custom font file.

```js
await brat("hello", { font: "Poppins" });
await brat("hello", { font: "./fonts/my-custom-font.ttf" });
```

`apple`, `sfpro`, and `inter` all resolve to the bundled Inter typeface family, since Apple's proprietary SF Pro font cannot be legally redistributed inside an open source npm package. Visually it keeps the same clean geometric sans-serif look used in the original Brat style.

### Auto font scaling

Font size is automatically reduced, line by line, until the full text fits inside the card without overflowing or being cropped. Long paragraphs, short text, and emoji heavy strings are all handled automatically.

---

## Sticker specific options

| Option | Type | Default | Description |
|---|---|---|---|
| `packname` | string | `"Brat Codex"` | Sticker pack name embedded in EXIF metadata |
| `author` | string | `"brat-codex"` | Sticker pack author embedded in EXIF metadata |
| `categories` / `emojiTags` | string[] | `["🗣️"]` | Emoji metadata tags for the sticker |
| `packId` | string | auto generated | Sticker pack identifier |
| `quality` | number | `90` | WEBP encoding quality |

```js
const sticker = await bratSticker("hello", {
  packname: "Codex",
  author: "Fidzz",
  categories: ["😂", "🔥"]
});
```

---

## Video specific options

| Option | Type | Default | Description |
|---|---|---|---|
| `format` | `"mp4"` \| `"gif"` \| `"webp"` | `"mp4"` | Output container/codec |
| `fps` | number | `12` | Frames per second |
| `duration` | number | `2.5` | Duration in seconds |
| `quality` | number | `70` | WEBP quality (webp format only) |
| `animateWords` | boolean | `true` | Progressive word reveal animation |
| `onProgress` | function | `undefined` | Progress callback, called with `{ current, total, stage }` |
| `signal` | AbortSignal | `undefined` | Allows cancelling an in-progress render |

```js
const controller = new AbortController();

const video = await bratVideo("Hello World", {
  format: "mp4",
  fps: 15,
  duration: 3,
  onProgress: (progress) => {
    console.log(progress.stage, progress.current, "/", progress.total);
  },
  signal: controller.signal
});
```

No ffmpeg installation is required on the host system. `brat-codex` uses a bundled ffmpeg binary via `ffmpeg-static`, downloaded automatically as part of the normal `npm install` dependency resolution.

---

## Using with WhatsApp Bots

### Baileys / WhiskeySockets

```js
const { brat, bratSticker, bratVideo, bratVideoSticker } = require("brat-codex");

sock.sendMessage(chat, {
  sticker: await bratSticker("hello")
});

sock.sendMessage(chat, {
  video: await bratVideo("hello")
});

sock.sendMessage(chat, {
  image: await brat("hello"),
  caption: "Brat style image"
});

sock.sendMessage(chat, {
  sticker: await bratVideoSticker("hello")
});
```

### levvleys

```js
const { bratSticker } = require("brat-codex");

await client.sendSticker(chat, await bratSticker("hello", {
  packname: "My Bot",
  author: "Me"
}));
```

### Express

```js
const express = require("express");
const { brat } = require("brat-codex");

const app = express();

app.get("/brat", async (req, res) => {
  const text = req.query.text || "hello";
  const theme = req.query.theme || "apple";
  const image = await brat(text, { theme });
  res.set("Content-Type", "image/png");
  res.send(image);
});

app.listen(3000);
```

### CLI usage

`brat-codex` is a library, not a CLI, but a minimal CLI wrapper can be built in a few lines:

```js
#!/usr/bin/env node
const { brat } = require("brat-codex");
const fs = require("fs");

const text = process.argv.slice(2).join(" ") || "hello";

brat(text).then((buffer) => {
  fs.writeFileSync("brat-output.png", buffer);
  console.log("Saved brat-output.png");
});
```

---

## TypeScript

Full type declarations are bundled, including autocomplete for every theme name, emoji provider, and option field.

```ts
import { brat, BratBaseOptions } from "brat-codex";

const options: BratBaseOptions = {
  theme: "purple",
  emoji: "google"
};

const image = await brat("hello", options);
```

---

## Performance Notes

- Rendering is fully async and safe to run in parallel across multiple requests.
- Video rendering writes frames to a temporary OS directory and cleans up automatically after encoding, even if an error occurs.
- Emoji and font assets are cached in memory per render call to avoid repeated disk reads.
- Large paragraphs are handled through progressive font size reduction rather than truncation, so text is never cropped.

---

## License

MIT
