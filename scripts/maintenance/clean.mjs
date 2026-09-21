import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
// Only fixed, generated artifacts may be removed. Never accept a CLI path.
for (const name of ['dist', 'server.js']) {
  const target = path.resolve(root, name);
  if (path.dirname(target) !== path.resolve(root)) throw new Error('Invalid clean target');
  await rm(target, { recursive: true, force: true });
}
console.log('Removed generated build artifacts.');
