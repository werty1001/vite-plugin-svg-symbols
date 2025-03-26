import { createHash } from 'node:crypto';
import { relative, sep } from 'node:path';

import type { OutputChunk, OutputBundle } from 'rollup';
import type { SymbolPayload } from '../index.d';


// Diff

export const generateImportName = (aliasPath: string, filePath: string) => {
  const name = relative(aliasPath, filePath).split(sep).join('_')
    .replace(/[-_]([a-z0-9])/gi, (_, char) => char.toUpperCase())
    .replace('.svg', '');
  return name.concat('Icon');
};

export const generateHash = (content: string, length = 8) =>
  createHash('sha256').update(content).digest('hex').slice(0, length);

export const normalizeExtname = (name: string, ext = '.svg') =>
  name.replace(ext, '').trim().concat(ext);

export const wrapSpriteBody = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`;


// Symbol

export const getSymbolId = (href: string) => {
  const [, id = ''] = href.split('#');
  return id;
};

export const generateSymbolId = (filePath: string, rootPath: string) => {
  const relativePath = relative(rootPath, filePath)
    .replace('.svg', '')
    .replace('node_modules'.concat(sep), '')
    .replace('src'.concat(sep), '');
  return relativePath.split(sep).join('-');
};

export const createSymbol = (
  iconCode: string,
  iconPath: string,
  id: string,
  shouldInheritAttrs: string[]
): [string, SymbolPayload] => {
  const svgRegex = /<svg([^>]*)>([\s\S]*?)<\/svg>/;
  const attrRegex = /([a-zA-Z-]+)\s*=\s*["']([^"']*)["']/g;

  const [, attrs = '', body = ''] = iconCode.match(svgRegex) || [];
  const svgBody = body.trim().replace(/>((\r\n|\n|\r)(\s+)?)</g, '><');
  
  const svgAttrs: SymbolPayload['svgAttrs'] = { viewBox: '0 0 24 24' };
  const parsedAttrs = attrs.matchAll(attrRegex);

  if (parsedAttrs) {
    for (const match of parsedAttrs) {
      const [, key, value] = match;
      svgAttrs[key.trim()] = value.trim()
    }
  }

  const inheritAttrs = shouldInheritAttrs.reduce((acc, el) => {
    const value = svgAttrs[el];
    if (value) {
      acc.push([el, `"${value}"`].join('='));
    }
    return acc;
  }, [] as string[]).join(' ');

  const symbolBody = inheritAttrs ? `<g ${inheritAttrs}>${svgBody}</g>` : svgBody;
  const symbolViewBox = svgAttrs.viewBox;

  return [`<symbol viewBox="${symbolViewBox}" id="${id}">${symbolBody}</symbol>`, {
    symbolId: id,
    symbolBody,
    symbolViewBox,
    svgBody,
    svgPath: iconPath,
    svgAttrs,
  }];
};


// Bundle

export const getUsedIds = (bundle: OutputBundle, stub: string) => {
  const regex = new RegExp(stub.concat('#([^\'"`]*)'), 'gi');
  const ids = Object.keys(bundle).reduce((acc, key) => {
    if (key.endsWith('.js') || key.endsWith('.mjs')) {
      const chunk = bundle[key] as OutputChunk;
      const used = chunk.code.match(regex) || [];
      acc.push(...used);
    }
    return acc;
  }, [] as string[]);
  return new Set(ids);
};

export const replaceStub = (bundle: OutputBundle, regex: RegExp, href: string) => {
  Object.keys(bundle).forEach((key) => {
    if (!key.endsWith('.js') && !key.endsWith('.mjs')) return;
    const chunk = bundle[key] as OutputChunk;
    if (chunk.code) {
      chunk.code = chunk.code.replace(regex, href);
    }
  });
};

