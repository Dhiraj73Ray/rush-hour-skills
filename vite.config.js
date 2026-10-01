import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
  // DEV — playground
  if (command === 'serve') {
    return {
      plugins: [react()],
      server: { port: 5174 },
    };
  }

  // BUILD — library
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