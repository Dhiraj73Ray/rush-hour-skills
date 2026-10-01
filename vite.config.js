import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  // DEV or DEMO build — playground app
  if (command === 'serve' || mode === 'demo') {
    return {
      plugins: [react(), cssInjectedByJsPlugin()],
      server: { port: 5174 },
      build: {
        outDir: 'dist-demo',
        emptyOutDir: true,
      },
    };
  }

  // LIBRARY build (default)
  return {
    plugins: [react()],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'RushHourSkills',
        formats: ['es', 'umd'],
        fileName: (format) => `rush-hour-skills.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'style.css';
            return assetInfo.name;
          },
        },
      },
      cssCodeSplit: false,
    },
  };
});