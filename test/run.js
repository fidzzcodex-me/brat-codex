const assert = require("assert");
const path = require("path");
const brat = require(path.join(__dirname, "..", "index.js"));

async function main() {
  const image = await brat.brat("Hello Brat");
  assert.ok(Buffer.isBuffer(image));
  assert.ok(image.length > 0);

  const sticker = await brat.bratSticker("Hello Brat", {
    packname: "Test",
    author: "Codex"
  });
  assert.ok(Buffer.isBuffer(sticker));
  assert.ok(sticker.length > 0);

  const themedImage = await brat.brat("Custom Theme", { theme: "purple" });
  assert.ok(Buffer.isBuffer(themedImage));

  console.log("All smoke tests passed");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
