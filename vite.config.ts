import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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
    plugins: [
      tailwindcss(),
      react(),
      {
        name: 'dev-api-recommendations',
        configureServer(server) {
          server.middlewares.use('/api/recommendations', (_req, res) => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const recPath = path.resolve(__dirname, 'linkedin_recommendations.json');
              const contentPath = path.resolve(__dirname, 'content/siteContent.json');
              let data = [];

              if (fs.existsSync(recPath)) {
                const raw = JSON.parse(fs.readFileSync(recPath, 'utf-8'));
                const items = raw.data?.items || raw.items || (Array.isArray(raw) ? raw : []);
                data = items.map((item: any) => {
                  const recommender = item.recommender || {};
                  const desc = recommender.description || '';
                  let role = 'Software Engineer';
                  let company = 'Tech';

                  if (desc.includes(' at ')) {
                    const parts = desc.split(' at ');
                    role = parts[0].trim();
                    company = parts[1].trim();
                  } else if (desc.includes(' | ')) {
                    const parts = desc.split(' | ');
                    role = parts[0].trim();
                    company = parts[1].trim().split(' · ')[0].trim();
                  } else if (desc) {
                    role = desc.trim();
                  }

                  if (item.text?.includes('Amdocs') && (company === 'Tech' || company === 'Software Developer')) {
                    company = 'Amdocs';
                  }

                  const avatars = Array.isArray(recommender.avatar) ? recommender.avatar : [];
                  const preferredAvatar = avatars.find((a: any) => a.width === 400 || a.height === 400) || avatars[avatars.length - 1];

                  return {
                    id: recommender.public_identifier ? `rec-${recommender.public_identifier}` : undefined,
                    author: recommender.full_name || `${recommender.first_name || ''} ${recommender.last_name || ''}`.trim(),
                    role,
                    company,
                    quote: item.text?.trim() || '',
                    avatarUrl: preferredAvatar?.url,
                    linkedInUrl: recommender.url || (recommender.public_identifier ? `https://www.linkedin.com/in/${recommender.public_identifier}` : undefined),
                  };
                });
              } else if (fs.existsSync(contentPath)) {
                const siteContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
                data = siteContent.recommendations || [];
              }

              res.end(JSON.stringify({ success: true, count: data.length, data }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err?.message || 'Error fetching recommendations' }));
            }
          });
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_MODEL': JSON.stringify(env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.8-flash'),
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
