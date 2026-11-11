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
    envPrefix: ['VITE_'],
    plugins: [
      tailwindcss(),
      react(),
      {
        name: 'dev-api-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }
            res.setHeader('Content-Type', 'application/json');

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { executeChatPipeline } = await import('./src/server/chatPipeline.ts');
                const parsed = JSON.parse(body || '{}');
                const { conversationHistory = [], userMessage = '' } = parsed;

                if (!userMessage || typeof userMessage !== 'string') {
                  res.statusCode = 400;
                  return res.end(JSON.stringify({ error: 'userMessage is required' }));
                }

                const result = await executeChatPipeline({
                  userMessage,
                  conversationHistory,
                  env: { ...process.env, ...env },
                });

                res.statusCode = result.statusCode;
                if (result.statusCode === 200) {
                  res.setHeader('X-Chat-Source', result.source);
                  return res.end(JSON.stringify({
                    reply: result.reply,
                    source: result.source,
                  }));
                }

                return res.end(JSON.stringify({
                  error: result.error,
                  ...(result.statusCode === 502 ? { code: result.code } : {}),
                  reply: result.reply,
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err?.message || 'Chat generation failed' }));
              }
            });
          });
        },
      },
      {
        name: 'dev-api-editor-auth',
        configureServer(server) {
          server.middlewares.use('/api/editor-auth', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }
            res.setHeader('Content-Type', 'application/json');
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const { username = '', password = '' } = parsed;
                const expectedUser = (env.EDITOR_USERNAME || process.env.EDITOR_USERNAME || 'admin').trim();
                const expectedPass = (env.EDITOR_PASSWORD || process.env.EDITOR_PASSWORD || '').trim().replace(/^["']|["']$/g, '');

                if (!expectedPass) {
                  res.statusCode = 500;
                  return res.end(JSON.stringify({ success: false, error: 'EDITOR_PASSWORD not configured' }));
                }

                if (username.trim() === expectedUser && password === expectedPass) {
                  return res.end(JSON.stringify({ success: true }));
                }

                res.statusCode = 401;
                res.end(JSON.stringify({ success: false, error: 'Invalid username or password' }));
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: err?.message || 'Bad Request' }));
              }
            });
          });
        },
      },
      {
        name: 'dev-api-recommendations',
        configureServer(server) {
          server.middlewares.use('/api/recommendations', async (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const recPath = path.resolve(__dirname, 'linkedin_recommendations.json');
              const contentPath = path.resolve(__dirname, 'content/siteContent.json');
              const url = new URL(req.url || '', 'http://localhost');
              const shouldRefresh = url.searchParams.get('refresh') === 'true';

              if (shouldRefresh) {
                const rawKey = env.SOCIALCRAWL_API_KEY || process.env.SOCIALCRAWL_API_KEY || '';
                const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
                if (!apiKey) {
                  res.statusCode = 503;
                  return res.end(JSON.stringify({ success: false, error: 'SOCIALCRAWL_API_KEY is not configured in .env' }));
                }
                const fetchUrl = 'https://www.socialcrawl.dev/v1/linkedin/profile/recommendations?url=https://www.linkedin.com/in/matan-elmaliach/&type=received&max_credits=10';
                const scRes = await fetch(fetchUrl, {
                  headers: { 'x-api-key': apiKey, 'Accept': 'application/json' },
                });
                if (!scRes.ok) {
                  const errText = await scRes.text();
                  res.statusCode = scRes.status;
                  return res.end(JSON.stringify({ success: false, error: `SocialCrawl API responded with ${scRes.status}: ${errText}` }));
                }
                const freshData = await scRes.json();
                fs.writeFileSync(recPath, JSON.stringify(freshData, null, 2), 'utf-8');
              }

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
                    const parts = desc.split(' | ').map((p: string) => p.trim());
                    const atSegment = parts.find((p: string) => p.includes('@'));
                    if (atSegment) {
                      const atParts = atSegment.split('@');
                      role = atParts[0].trim();
                      company = atParts[1].trim();
                    } else {
                      role = parts[0];
                      company = parts[1].split(' · ')[0].trim();
                    }
                  } else if (desc.includes('@')) {
                    const parts = desc.split('@');
                    role = parts[0].trim();
                    company = parts[1].trim();
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
      'import.meta.env.EDITOR_USERNAME': JSON.stringify(env.EDITOR_USERNAME || process.env.EDITOR_USERNAME || 'admin'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
