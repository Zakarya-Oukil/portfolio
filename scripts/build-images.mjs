// Builds the site's graded imagery from originals in design-assets/source.
// Usage: node scripts/build-images.mjs
// Outputs to public/img. Originals are never shipped.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'design-assets/source';
const OUT = 'public/img';
fs.mkdirSync(OUT, { recursive: true });

const PAPER = { r: 236, g: 230, b: 216 };      // bone
const GRAPHITE = { r: 26, g: 25, b: 23 };       // graphite

/** Film grain tile: transparent PNG with random light and dark specks. */
async function grainTile(size = 256) {
  const buf = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = Math.random() < 0.5 ? 255 : 0;
    buf[i * 4] = v; buf[i * 4 + 1] = v; buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = Math.floor(Math.random() * 46);
  }
  await sharp(buf, { raw: { width: size, height: size, channels: 4 } }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'grain.png'));
}

/** Portrait as a printed photograph: cropped to 4:5, grayscale, contrast, grain, paper border. */
async function portrait() {
  const input = path.join(SRC, 'portrait-original.jpeg');
  const meta = await sharp(input).metadata();
  const cropH = meta.height;
  const cropW = Math.round(cropH * 0.8);
  const faceX = Math.round(meta.width * 0.5);
  const left = Math.max(0, Math.min(meta.width - cropW, faceX - Math.round(cropW * 0.5)));
  const photoW = 760, photoH = 950, border = 34;
  const base = await sharp(input)
    .extract({ left, top: 0, width: cropW, height: cropH })
    .resize(photoW, photoH, { fit: 'cover', kernel: 'lanczos3' })
    .grayscale().gamma(1.25).linear(1.05, -2)
    .toBuffer();
  // Soft exposure lift around the face only, blended through a radial mask, so the backlit face reads.
  const lifted = await sharp(base).gamma(1.9).toBuffer();
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${photoW}" height="${photoH}"><defs><radialGradient id="g" cx="0.5" cy="0.42" r="0.36"><stop offset="0" stop-color="white"/><stop offset="0.6" stop-color="white" stop-opacity="0.75"/><stop offset="1" stop-color="black"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  const mask = await sharp(Buffer.from(maskSvg)).grayscale().raw().toBuffer();
  const liftedRgba = await sharp(lifted).removeAlpha().joinChannel(mask, { raw: { width: photoW, height: photoH, channels: 1 } }).png().toBuffer();
  const photo = await sharp(base).composite([{ input: liftedRgba }]).toBuffer();
  const noise = Buffer.alloc(photoW * photoH * 4);
  for (let i = 0; i < photoW * photoH; i++) {
    const v = Math.random() < 0.5 ? 255 : 0;
    noise[i * 4] = v; noise[i * 4 + 1] = v; noise[i * 4 + 2] = v; noise[i * 4 + 3] = Math.random() < 0.55 ? 0 : Math.floor(Math.random() * 30);
  }
  const grainy = await sharp(photo).composite([{ input: await sharp(noise, { raw: { width: photoW, height: photoH, channels: 4 } }).png().toBuffer() }]).toBuffer();
  await sharp({ create: { width: photoW + border * 2, height: photoH + border * 2 + 40, channels: 3, background: PAPER } })
    .composite([{ input: grainy, left: border, top: border }])
    .webp({ quality: 88 }).toFile(path.join(OUT, 'portrait.webp'));
  console.log('portrait', photoW + border * 2, 'x', photoH + border * 2 + 40);
}

/** Halftone: luminance sampled on a grid, drawn as bone dots on graphite. */
async function halftone(file, outName, { width = 1600, height = 1000, cell = 8, contrast = 1.25 } = {}) {
  const cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
  const { data } = await sharp(path.join(SRC, file)).resize(cols, rows, { fit: 'cover' }).grayscale().normalise().linear(contrast, -20).raw().toBuffer({ resolveWithObject: true });
  const dots = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const lum = data[y * cols + x] / 255;
    const r = Math.pow(lum, 0.9) * cell * 0.62;
    if (r > 0.45) dots.push(`<circle cx="${(x * cell + cell / 2).toFixed(1)}" cy="${(y * cell + cell / 2).toFixed(1)}" r="${r.toFixed(2)}"/>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="rgb(${GRAPHITE.r},${GRAPHITE.g},${GRAPHITE.b})"/><g fill="rgb(${PAPER.r},${PAPER.g},${PAPER.b})">${dots.join('')}</g></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(path.join(OUT, outName));
  console.log(outName, dots.length, 'dots');
}


/** Real screenshot as a printed exhibit: grayscale print with grain and a paper border, plus a color copy. */
async function exhibit(file, outName, { width = 1600, height = 1000, border = 28 } = {}) {
  const input = path.join(SRC, file);
  const shot = await sharp(input).resize(width, height, { fit: 'cover', position: 'left top' }).toBuffer();
  await sharp(shot).webp({ quality: 90 }).toFile(path.join(OUT, outName.replace('.webp', '-color.webp')));
  const gray = await sharp(shot).grayscale().linear(1.08, -6).toBuffer();
  const noise = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const v = Math.random() < 0.5 ? 255 : 0;
    noise[i * 4] = v; noise[i * 4 + 1] = v; noise[i * 4 + 2] = v; noise[i * 4 + 3] = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * 26);
  }
  const grainy = await sharp(gray).composite([{ input: await sharp(noise, { raw: { width, height, channels: 4 } }).png().toBuffer() }]).toBuffer();
  await sharp({ create: { width: width + border * 2, height: height + border * 2, channels: 3, background: PAPER } })
    .composite([{ input: grainy, left: border, top: border }]).webp({ quality: 86 }).toFile(path.join(OUT, outName));
  console.log(outName, 'exhibit from real screenshot');
}

/** Natural-color 4:5 portrait (editorial) and a wide graded plate (cinematic), both with the face-only exposure lift. */
async function portraitVariants() {
  const input = path.join(SRC, 'portrait-original.jpeg');
  const meta = await sharp(input).metadata();
  const liftMaskSvg = (w, h, cx, cy, r) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><radialGradient id="g" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="white"/><stop offset="0.6" stop-color="white" stop-opacity="0.7"/><stop offset="1" stop-color="black"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  async function lift(buf, w, h, cx, cy, r, gam) {
    const base = await sharp(buf).gamma(1.18).toBuffer();
    const lifted = await sharp(base).gamma(gam).toBuffer();
    const mask = await sharp(Buffer.from(liftMaskSvg(w, h, cx, cy, r))).grayscale().raw().toBuffer();
    const rgba = await sharp(lifted).removeAlpha().joinChannel(mask, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
    return sharp(base).composite([{ input: rgba }]).toBuffer();
  }
  const cropH = meta.height, cropW = Math.round(cropH * 0.8), left = Math.max(0, Math.min(meta.width - cropW, Math.round(meta.width * 0.5 - cropW * 0.5)));
  const tall = await sharp(input).extract({ left, top: 0, width: cropW, height: cropH }).resize(900, 1125, { fit: 'cover', kernel: 'lanczos3' }).toBuffer();
  await sharp(await lift(tall, 900, 1125, 0.5, 0.42, 0.36, 1.7)).modulate({ saturation: 0.8 }).webp({ quality: 88 }).toFile(path.join(OUT, 'portrait-color.webp'));
  const wide = await sharp(input).resize(1800, 1200, { fit: 'cover', kernel: 'lanczos3' }).toBuffer();
  await sharp(await lift(wide, 1800, 1200, 0.5, 0.45, 0.28, 1.6)).modulate({ saturation: 0.55 }).webp({ quality: 86 }).toFile(path.join(OUT, 'portrait-wide.webp'));
  console.log('portrait variants');
}

await grainTile();
await portraitVariants();
await portrait();
if (fs.existsSync(path.join(SRC, 'live-spider-arsenal.png'))) await exhibit('live-spider-arsenal.png', 'work-spider.webp');
else await halftone('work-spider.jpg', 'work-spider.webp');
for (const [file, out] of [['work-sentinel.jpg', 'work-sentinel.webp'], ['work-zakos.jpg', 'work-zakos.webp']]) {
  if (fs.existsSync(path.join(SRC, file))) await halftone(file, out);
  else console.warn('missing source', file);
}
