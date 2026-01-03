
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Config - https://vitejs.dev/config/

export default defineConfig({
  build: {
    lib: {
      name: 'VitePluginSvgSymbolsBin',
      entry: fileURLToPath(new URL('./src/bin.ts', import.meta.url)),
      formats: ['cjs'],
      fileName: 'exec',
    },
    emptyOutDir: false,
    rollupOptions: {
      external: [
        'node:process',
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
      ],
    }),
  ],
});
