import { describe, it, expect, beforeAll } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('Inject', () => {
  let html = '';

  beforeAll(async () => {
    html = await readFile('./dist/inject/index.html', { encoding: 'utf8' });
  });

  it('Should inject sprite into HTML', () => {
    expect(html).toContain('<svg data-my-attr="hey"');
  });

  it('Should contain defs', () => {
    expect(html).toContain('<defs>...</defs>');
  });

  it('Should transform icon', () => {
    expect(html).toContain('<circle cx="8" cy="8" r="8" fill="blue"></circle>');
  });

  it('Should transform icon id', () => {
    expect(html).toContain('my-transformed-icon-id');
  });

  it('Should not to contain unused icon ', () => {
    expect(html).not.toContain('arrow-up-z-a');
  });

  it('Should transform symbol', () => {
    expect(html).toContain('data-transformed-symbol');
  });

});
