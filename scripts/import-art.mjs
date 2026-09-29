import { constants } from 'node:fs';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Usage: npm run art:import -- "C:\\Users\\you\\Pictures\\Art"');
const catalog = JSON.parse(await readFile('content/artworks.json', 'utf8'));
await mkdir('static/art/originals', { recursive: true });
for (const art of catalog) {
  if (basename(art.file) !== art.file) throw new Error(`Expected a filename: ${art.file}`);
  try {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(art.id)) throw new Error(`Invalid artwork ID: ${art.id}`);
    await copyFile(resolve(source, art.file), resolve('static/art/originals', art.id + extname(art.file).toLowerCase()), constants.COPYFILE_EXCL);
    console.log(`Imported ${art.file}`);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    console.log(`Already imported: ${art.file}`);
  }
}
