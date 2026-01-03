
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import useSvgSymbols from './src/index';
import type { SvgSymbolsPluginOptions } from './index';

const options: SvgSymbolsPluginOptions = {
  shouldInjectToHtml: true,
  injectAttrs: {
    'data-my-attr': 'hey',
  },
  transformSprite: (body) => {
    return '<defs>...</defs>'.concat(body);
  },
  transformIconId: (iconId) => {
    if (iconId.endsWith('cat')) {
      return 'my-transformed-icon-id';
    }
    return iconId;
  },
  transformIcon: (iconCode, iconPath) => {
    if (iconPath.endsWith('circle.svg')) {
      return '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="blue"></circle></svg>';
    }
    return iconCode;
  },
  transformSymbol: (symbolCode, payload) => {
    const { symbolId, symbolBody, symbolViewBox } = payload;
    if (symbolId.endsWith('rect')) {
      return `<symbol viewBox="${symbolViewBox}" id="${symbolId}" data-transformed-symbol="yes">${symbolBody}</symbol>`;
    }
    return symbolCode;
  },
};

export default defineConfig({
  plugins: [
    useSvgSymbols(options),
  ],
  resolve: {
    alias: {
      '@icons': fileURLToPath(new URL('./app/icons', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist/inject',
  },
});
