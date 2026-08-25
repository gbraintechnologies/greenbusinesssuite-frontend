import fs from "fs";
import path from "path";
import sharp from "sharp";

const dir = "public/svg";
const outDir = "public/brand";
fs.mkdirSync(outDir, { recursive: true });

const files = [
  "greensuite_logo_dark.svg",
  "greensuite_logo_light.svg",
  "greensuite_logo_v_dark.svg",
  "greensuite_logo_v_light.svg",
  "greensuite_logo_v_white.svg",
];

function extractPng(svg) {
  const m = svg.match(/data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)/);
  if (!m) throw new Error("no embed");
  return Buffer.from(m[2], "base64");
}

for (const file of files) {
  const svg = fs.readFileSync(path.join(dir, file), "utf8");
  const buf = extractPng(svg);
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 28 && g < 28 && b < 28) data[i + 3] = 0;
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * channels + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 8;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const outName = file.replace(".svg", ".png");

  await sharp(data, { raw: { width, height, channels } })
    .extract({ left: minX, top: minY, width: cw, height: ch })
    .png()
    .toFile(path.join(outDir, outName));

  console.log(outName, `${cw}x${ch}`);
}
