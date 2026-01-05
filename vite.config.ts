
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Config - https://vitejs.dev/config/

export default defineConfig({
  build: {
    lib: {
      name: 'VitePluginSvgSymbols',
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'node:path',
        'node:crypto',
        'node:fs/promises',
      ],
      output: {
        exports: 'named',
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: './bin.js', dest: './' },
        { src: './index.d.ts', dest: './' },
        { src: './client.d.ts', dest: './' },
        { src: './README.md', dest: './' },
        { src: './package.json', dest: './' },
      ],
    }),
  ],
});
