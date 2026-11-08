import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
    },
    envDir: '.',
    envPrefix: ['VITE_', 'GEMINI_', 'EDITOR_'],
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || env.API_KEY || process.env.API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || env.API_KEY || process.env.API_KEY || ''),
      'process.env.GEMINI_MODEL': JSON.stringify(env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.8-flash'),
      'process.env.EDITOR_USERNAME': JSON.stringify(env.EDITOR_USERNAME || process.env.EDITOR_USERNAME || 'admin'),
      'process.env.EDITOR_PASSWORD': JSON.stringify(env.EDITOR_PASSWORD || process.env.EDITOR_PASSWORD || ''),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'import.meta.env.VITE_GEMINI_MODEL': JSON.stringify(env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.8-flash'),
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'import.meta.env.GEMINI_MODEL': JSON.stringify(env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.8-flash'),
      'import.meta.env.VITE_EDITOR_USERNAME': JSON.stringify(env.EDITOR_USERNAME || process.env.EDITOR_USERNAME || 'admin'),
      'import.meta.env.VITE_EDITOR_PASSWORD': JSON.stringify(env.EDITOR_PASSWORD || process.env.EDITOR_PASSWORD || ''),
      'import.meta.env.EDITOR_USERNAME': JSON.stringify(env.EDITOR_USERNAME || process.env.EDITOR_USERNAME || 'admin'),
      'import.meta.env.EDITOR_PASSWORD': JSON.stringify(env.EDITOR_PASSWORD || process.env.EDITOR_PASSWORD || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
