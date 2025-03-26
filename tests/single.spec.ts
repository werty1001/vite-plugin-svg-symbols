import { describe, it, expect, beforeAll } from 'vitest';
import { readdir, readFile } from 'node:fs/promises';

describe('Single', () => {
  let sprite = '';

  beforeAll(async () => {
    const files = await readdir('./dist/single/assets');
    const spriteName = files.find((el) => el.startsWith('my-sprite-name')) || '';
    sprite = await readFile(`./dist/single/assets/${spriteName}`, { encoding: 'utf8' });
  });

  it('Should generate sprite', () => {
    expect(sprite.length).toBeGreaterThan(0);
  });

  it('Should contain cat and dog icons', () => {
    expect(sprite).toContain('app-icons-dog');
    expect(sprite).toContain('app-icons-cat');
  });

});
