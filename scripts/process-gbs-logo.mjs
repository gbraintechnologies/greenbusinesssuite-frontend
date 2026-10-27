import fs from "fs";
import path from "path";
import sharp from "sharp";

const src =
  "C:/Users/USER/.cursor/projects/c-Users-USER-Documents-github-greenbusinesssuite-frontend/assets/Minimalist_Green_Geometric_G_Logo-a7ff48fd-03e5-4da7-be46-00d5b61fc174.jpg";
const outDir = "public/brand";
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync("public/favicon", { recursive: true });

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

function isBg(i) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  // exterior paper white only (logo mark white is similar but enclosed)
  return r > 240 && g > 240 && b > 240;
}

// Flood-fill from edges so interior white mark stays opaque
const visited = new Uint8Array(width * height);
const queue = [];
function enqueue(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const idx = y * width + x;
  if (visited[idx]) return;
  const i = idx * channels;
  if (!isBg(i)) return;
  visited[idx] = 1;
  data[i + 3] = 0;
  queue.push(idx);
}

for (let x = 0; x < width; x++) {
  enqueue(x, 0);
  enqueue(x, height - 1);
}
for (let y = 0; y < height; y++) {
  enqueue(0, y);
  enqueue(width - 1, y);
}

while (queue.length) {
  const idx = queue.pop();
  const x = idx % width;
  const y = (idx / width) | 0;
  enqueue(x + 1, y);
  enqueue(x - 1, y);
  enqueue(x, y + 1);
  enqueue(x, y - 1);
}

let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = data[(y * width + x) * channels + 3];
    if (a > 8) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}

const pad = 6;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(width - 1, maxX + pad);
maxY = Math.min(height - 1, maxY + pad);
const cw = maxX - minX + 1;
const ch = maxY - minY + 1;

const markBuf = await sharp(data, { raw: { width, height, channels } })
  .extract({ left: minX, top: minY, width: cw, height: ch })
  .png()
  .toBuffer();

const mark512 = await sharp(markBuf)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp(mark512).toFile(path.join(outDir, "gbs-mark.png"));
await sharp(mark512).toFile(path.join(outDir, "gbs-logo.png"));
await sharp(mark512)
  .resize(180, 180)
  .png()
  .toFile(path.join(outDir, "gbs-mark-sm.png"));
await sharp(mark512).resize(64, 64).png().toFile("public/favicon/favicon-64.png");
await sharp(mark512).resize(32, 32).png().toFile("public/favicon/favicon-32.png");
await sharp(mark512)
  .resize(180, 180)
  .png()
  .toFile("public/favicon/apple-touch-icon.png");
await sharp(mark512).resize(32, 32).png().toFile("app/favicon.ico");

async function lockup(filename, textColor) {
  const markH = 128;
  const mark = await sharp(mark512).resize(markH, markH).png().toBuffer();
  const textSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="128">
      <text x="0" y="56" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="${textColor}">Green Business</text>
      <text x="0" y="100" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="600" fill="${textColor}">Suite</text>
    </svg>`
  );
  const textPng = await sharp(textSvg).png().toBuffer();
  await sharp({
    create: {
      width: markH + 28 + 560,
      height: markH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: mark, left: 0, top: 0 },
      { input: textPng, left: markH + 28, top: 0 },
    ])
    .png()
    .toFile(path.join(outDir, filename));
  console.log(filename);
}

await lockup("greensuite_logo_on_light.png", "#0B3D2E");
await lockup("greensuite_logo_dark.png", "#0B3D2E");
await lockup("greensuite_logo_light.png", "#FFFFFF");
await lockup("greensuite_logo_white.png", "#FFFFFF");

async function vlockup(filename, textColor) {
  const markH = 180;
  const mark = await sharp(mark512).resize(markH, markH).png().toBuffer();
  const textSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="90">
      <text x="150" y="36" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="${textColor}">Green Business</text>
      <text x="150" y="70" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" fill="${textColor}">Suite</text>
    </svg>`
  );
  const textPng = await sharp(textSvg).png().toBuffer();
  await sharp({
    create: {
      width: 300,
      height: markH + 18 + 90,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: mark, left: Math.round((300 - markH) / 2), top: 0 },
      { input: textPng, left: 0, top: markH + 18 },
    ])
    .png()
    .toFile(path.join(outDir, filename));
  console.log("v", filename);
}

await vlockup("greensuite_logo_v_dark.png", "#0B3D2E");
await vlockup("greensuite_logo_v_light.png", "#FFFFFF");
await vlockup("greensuite_logo_v_white.png", "#FFFFFF");

console.log("done", `${cw}x${ch}`);
