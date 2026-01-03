
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import useSvgSymbols from './src/index';
import type { SvgSymbolsPluginOptions } from './index';

const options: SvgSymbolsPluginOptions = {
  fileName: 'my-sprite-name-[hash]',
  shouldInjectToHtml: false,
  transformImportName: (name) => {
    if (name === 'catIcon') {
      return name.concat('Transformed');
    }
    return name;
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
    outDir: 'dist/single',
    lib: {
      name: 'VitePluginSvgSymbolsTest',
      entry: fileURLToPath(new URL('./app/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
    },
  },
});
