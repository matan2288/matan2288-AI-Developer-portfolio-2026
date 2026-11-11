import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { executeChatPipeline } from './src/server/chatPipeline.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present
try {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch { }

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Chat Endpoint (RAG Pipeline primary -> Gemini fallback)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { conversationHistory = [], userMessage = '' } = req.body;
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    const result = await executeChatPipeline({
      userMessage,
      conversationHistory,
      env: process.env,
      noKeyReply:
        'The Gemini API key is currently not configured, but I can tell you that Matan is an exceptional Full-Stack Developer specializing in checkout systems, React/Vue development, and Adobe Analytics. Your API key can be found in the Settings > Secrets panel.',
    });

    if (result.statusCode === 200) {
      res.setHeader('X-Chat-Source', result.source);
      return res.json({
        reply: result.reply,
        source: result.source,
        model: result.model,
        ragEndpoint: result.ragEndpoint,
        healthEndpoint: result.healthEndpoint,
        ragFallbackReason: result.ragFallbackReason,
      });
    }

    if (result.statusCode === 503) {
      return res.status(503).json({
        noKey: result.noKey,
        reply: result.reply,
        ragFallbackReason: result.ragFallbackReason,
      });
    }

    return res.status(502).json({
      error: result.error,
      details: result.details,
      ragFallbackReason: result.ragFallbackReason,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Error communicating with chat pipeline',
      reply:
        'Hey there! I hit a minor connection bump talking to my API right now, but feel free to check out my experience timeline below or email me directly at matan2288@gmail.com!',
    });
  }
});

// Editor Authentication Endpoint
app.post('/api/editor-auth', (req: Request, res: Response) => {
  try {
    const { username = '', password = '' } = req.body || {};
    const expectedUser = (process.env.EDITOR_USERNAME || 'admin').trim();
    const rawExpectedPass = process.env.EDITOR_PASSWORD || '';
    const expectedPass = rawExpectedPass.trim().replace(/^["']|["']$/g, '');

    if (!expectedPass) {
      return res.status(500).json({
        success: false,
        error: 'EDITOR_PASSWORD is not configured on the server.',
      });
    }

    if (username.trim() === expectedUser && password === expectedPass) {
      return res.json({ success: true });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid username or password',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err?.message || 'Bad Request',
    });
  }
});

// Recommendations API Endpoint (serving verified LinkedIn recommendations via SocialCrawl data)
app.get('/api/recommendations', async (req: Request, res: Response) => {
  try {
    const shouldRefresh = req.query.refresh === 'true';
    const rawApiKey = process.env.SOCIALCRAWL_API_KEY || '';
    const apiKey = rawApiKey.trim().replace(/^["']|["']$/g, '');

    if (shouldRefresh) {
      if (!apiKey) {
        return res.status(503).json({
          success: false,
          error: 'SOCIALCRAWL_API_KEY is not configured in .env or server environment.',
        });
      }
      const fetchUrl = 'https://www.socialcrawl.dev/v1/linkedin/profile/recommendations?url=https://www.linkedin.com/in/matan-elmaliach/&type=received&max_credits=10';
      const scRes = await fetch(fetchUrl, {
        headers: {
          'x-api-key': apiKey,
          'Accept': 'application/json',
        },
      });
      if (!scRes.ok) {
        const errText = await scRes.text();
        return res.status(scRes.status).json({
          success: false,
          error: `SocialCrawl API responded with ${scRes.status}: ${errText}`,
        });
      }
      const freshData = await scRes.json();
      fs.writeFileSync(path.resolve(__dirname, 'linkedin_recommendations.json'), JSON.stringify(freshData, null, 2), 'utf-8');
    }

    // Read stored JSON
    const jsonPath = path.resolve(__dirname, 'linkedin_recommendations.json');
    if (fs.existsSync(jsonPath)) {
      const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const items = raw.data?.items || raw.items || (Array.isArray(raw) ? raw : []);

      const mapped = items.map((item: any) => {
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

      return res.json({
        success: true,
        source: 'linkedin_socialcrawl',
        count: mapped.length,
        data: mapped,
      });
    }

    // Fallback to siteContent.json
    const siteContentPath = path.resolve(__dirname, 'content/siteContent.json');
    if (fs.existsSync(siteContentPath)) {
      const siteContent = JSON.parse(fs.readFileSync(siteContentPath, 'utf-8'));
      return res.json({
        success: true,
        source: 'site_content',
        count: siteContent.recommendations?.length || 0,
        data: siteContent.recommendations || [],
      });
    }

    return res.status(404).json({ success: false, error: 'No recommendations found' });
  } catch (err: any) {
    console.error('Error serving recommendations API:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to fetch recommendations' });
  }
});

// Secure Content Commit Endpoint (commits to GitHub API or local fs if token is not configured)
app.post('/api/content-commit', async (req: Request, res: Response) => {
  try {
    const { files = [], message = 'cms: update content' } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files provided to commit' });
    }

    const rawToken = process.env.GITHUB_TOKEN || '';
    const token = rawToken.trim().replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '').replace(/^token\s+/i, '').trim();
    const owner = (process.env.GITHUB_OWNER || process.env.VITE_GITHUB_OWNER || 'matan2288').trim().replace(/^["']|["']$/g, '');
    const repo = (process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO || '').trim().replace(/^["']|["']$/g, '');
    const branch = (process.env.GITHUB_BRANCH || process.env.VITE_GITHUB_BRANCH || 'main').trim().replace(/^["']|["']$/g, '');

    // If GITHUB_TOKEN and GITHUB_REPO are available, commit to GitHub REST API
    if (token && repo) {
      const headers = {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Express-TinaCMS-Committer',
        'Content-Type': 'application/json',
      };

      const results = [];
      for (const file of files) {
        let existingSha: string | undefined;
        const getFileUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${file.path}?ref=${encodeURIComponent(branch)}`;
        const getRes = await fetch(getFileUrl, { headers });
        if (getRes.ok) {
          const fileInfo: any = await getRes.json();
          existingSha = fileInfo.sha;
        }

        const contentBase64 = Buffer.from(file.content, 'utf-8').toString('base64');
        const putFileUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${file.path}`;
        const putRes = await fetch(putFileUrl, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: `${message} (${file.path})`,
            content: contentBase64,
            branch,
            sha: existingSha,
          }),
        });

        if (!putRes.ok) {
          const errText = await putRes.text();
          throw new Error(`GitHub commit error for ${file.path}: ${putRes.status} ${errText}`);
        }

        const putData: any = await putRes.json();
        results.push({ path: file.path, sha: putData.commit?.sha });
      }

      // Also ensure local disk files are kept in sync
      for (const file of files) {
        try {
          const filePath = path.resolve(__dirname, file.path);
          const dirPath = path.dirname(filePath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          fs.writeFileSync(filePath, file.content, 'utf-8');
        } catch (localWriteErr) {
          console.warn('Local disk sync warning:', localWriteErr);
        }
      }

      return res.json({
        success: true,
        message: `Committed ${results.length} files to GitHub (${owner}/${repo}@${branch}) and synced local disk`,
        commitSha: results[0]?.sha,
        results,
      });
    }

    // Fallback in local/dev environment: persist directly to disk
    const saved = [];
    for (const file of files) {
      const filePath = path.resolve(__dirname, file.path);
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, file.content, 'utf-8');
      saved.push(file.path);
    }

    return res.json({
      success: true,
      message: `Saved ${saved.length} files to local disk (set GITHUB_TOKEN & GITHUB_REPO to commit to remote)`,
      savedFiles: saved,
      local: true,
    });
  } catch (err: any) {
    console.error('Server content commit error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to save or commit content',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
