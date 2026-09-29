import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const catalog = JSON.parse(await readFile('content/artworks.json', 'utf8'));
const ids = new Set();
await mkdir('static/art/previews', { recursive: true });
await mkdir('src/lib/generated', { recursive: true });
const works = [];

for (const art of catalog) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(art.id) || ids.has(art.id)) {
    throw new Error(`Artwork IDs must be unique URL-safe slugs: ${art.id}`);
  }
  ids.add(art.id);
  if (basename(art.file) !== art.file || !art.title || !art.alt || !art.category) {
    throw new Error(`Invalid artwork entry: ${art.id}`);
  }
  const originalName = art.id + extname(art.file).toLowerCase();
  const input = await readFile(join('static/art/originals', originalName));
  const metadata = await sharp(input).metadata();
  const dimensions = metadata.autoOrient ?? metadata;
  const width = dimensions.width;
  const height = metadata.pageHeight ?? dimensions.height;
  const hash = createHash('sha256').update(input).digest('hex').slice(0, 10);
  const widths = [...new Set([480, 960, 1600].map((size) => Math.min(size, width)))];
  const previews = [];
  for (const size of widths) {
    const filename = `${art.id}-${hash}-${size}.webp`;
    const output = join('static/art/previews', filename);
    await sharp(input, { page: 0, pages: 1 })
      .rotate()
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: size > 960 ? 92 : 86, effort: 5 })
      .toFile(output);
    previews.push({ src: `/art/previews/${filename}`, width: size });
  }
  works.push({
    ...art, width, height,
    original: `/art/originals/${originalName}`,
    bytes: input.length,
    animated: (metadata.pages ?? 1) > 1,
    previews
  });
}
await writeFile('src/lib/generated/artworks.json', JSON.stringify(works, null, 2) + '\n');
console.log(`Prepared ${works.length} artworks. Original files are unchanged.`);
