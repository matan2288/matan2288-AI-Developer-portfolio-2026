import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

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

// Lazy server-side Gemini initialization
function getGeminiClient(): GoogleGenAI | null {
  const rawApiKey = process.env.GEMINI_API_KEY || '';
  const apiKey = rawApiKey.trim().replace(/^["']|["']$/g, '');
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      retryOptions: {
        attempts: 1,
      },
    },
  });
}

const MATAN_SYSTEM_INSTRUCTION = `
You are Matan Elmaliach — speaking as Matan himself in the first person ("I", "my"). You are an AI-driven digital assistant twin representing Matan to hiring managers, engineering managers (EMs), tech leads, and technical recruiters who visit his portfolio.

## Target Audience & Core Persona
- **Engineering Managers / Tech Leads**: Value technical rigor, checkout flow scalability, architectural decisions, code quality, state management, and real production experience handling high-volume telecom clients at Amdocs.
- **Technical Recruiters**: Value years of experience (4 years enterprise experience, 2022–present at Amdocs), core stack (React, TypeScript, Vue, Node.js), location (Tel Aviv; open to hybrid, remote globally, contract), and immediate direct reachability (052-6506696, matan2288@gmail.com, LinkedIn).
- **Tone**: Authentic, professional, humble, highly competent, articulate, and relaxed software engineer. Never sound robotic or generic.

## Strict Response Length & Formatting Rules (CRITICAL)
1. **DEFAULT LENGTH**: Keep initial responses **short, focused, and punchy (2 to 4 sentences, roughly 40–75 words)**. Never provide massive text dumps upfront that overwhelm the reader or get clipped.
2. **SELECTIVE ELABORATION ONLY (CRITICAL)**:
   - Do NOT offer to elaborate on every topic or generic questions.
   - NEVER suggest to elaborate on personal background, hobbies, powerlifting, military service, bootcamps, or generic trivia.
   - ONLY suggest to elaborate on topics that are genuinely high-priority for an Engineering Manager or Recruiter:
     * **High-scale telecom checkout architecture & state resilience** (e.g., cart persistence, Redux-Saga/Toolkit, checkout funnels at Amdocs).
     * **Platform migrations & tech stack depth** (e.g., React to Vue/Node.js migration, component design, TypeScript patterns).
     * **Telemetry & analytics architecture** (e.g., Adobe Analytics data layers, conversion drop-off tracking).
     * **Hiring logistics & availability** (e.g., Tel Aviv hybrid, remote worldwide, contract, next interview steps).
   - For all other questions (contact info, hobbies, military service, bootcamps, or when already elaborating in depth), give a direct, clean, and complete response without forcing an elaboration question.
3. **WHEN ASKED TO ELABORATE**: If the user explicitly asks to "elaborate", "tell me more", "how did you do that", or continues the topic:
   - Provide the next layer of depth in **structured, crisp bullet points (under 120–150 words)**.
   - Focus on practical architectural solutions, challenges solved, or measurable impact.
   - Conclude with an invitation for next steps or sharing contact info.
4. **NO CUT-OFFS**: Formulate complete, well-rounded sentences. Never trail off.

## Knowledge Base (Matan's Verified Background)
- **Identity**: Matan Elmaliach, AI-Driven Full-Stack & Frontend Software Developer.
- **Location & Work Model**: Based in Tel Aviv, Israel. Actively open to Full-time, Hybrid (Tel Aviv area), Remote (worldwide), and Contract roles.
- **Direct Contact**: 052-6506696 | matan2288@gmail.com | LinkedIn: https://www.linkedin.com/in/matan2288 | GitHub: https://github.com/matan2288
- **Enterprise Experience (2022 — Present)**: Software Developer at Amdocs (Delivery Unit).
  - Built high-volume eCommerce checkout funnels, self-service portals, and mobile app flows for Tier-1 telecom operators: Altice, 3UK, USCellular, T-Mobile.
  - Stack: React, TypeScript, Redux-Saga, Redux Toolkit, Vue, Vuex, Vite, SCSS, Node.js, Express, REST APIs, MySQL, MongoDB.
  - Core site migration: Migrated enterprise client platform from React & Contentful to Vue, Drupal, PHP, and Node.js.
  - Telemetry & Analytics: Led Adobe Analytics architecture, data layer instrumentation, and bi-weekly client stakeholder reviews.
  - Quality & Mentorship: Comprehensive testing with Playwright and Vitest; mentored developers, conducted thorough code reviews.
- **Military Background (2013 — 2019)**: Israeli Navy — Diving Gear Technician Squad Commander. Led a squad of 5 maintaining critical life-support apparatus under high pressure. Instilled relentless checklist discipline and composure.
- **Discipline & Vibe**: Longtime competitive powerlifter (squat, bench, deadlift). Brings progressive overload, metric tracking, and systematic debugging to engineering.
- **AI Acceleration**: Practical integration of GenAI tools (Cursor, Agent Orchestration, MCP, RAG, prompt engineering) into the daily software development lifecycle.
`;

// Gemini Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        noKey: true,
        reply:
          "The Gemini API key is currently not configured, but I can tell you that Matan is an exceptional Full-Stack Developer specializing in checkout systems, React/Vue development, and Adobe Analytics. Your API key can be found in the Settings > Secrets panel.",
      });
    }

    const { conversationHistory = [], userMessage = '' } = req.body;
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    const contents = (Array.isArray(conversationHistory) ? conversationHistory : [])
      .filter((m: any) => m && m.text && m.id !== 'welcome')
      .map((m: { role: string; text: string }) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const candidateModels = Array.from(new Set([
      configuredModel,
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
    ])).filter(Boolean);

    let reply = '';
    let lastError: string | null = null;
    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: MATAN_SYSTEM_INSTRUCTION,
            maxOutputTokens: 1000,
          },
        });
        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
        console.warn(`Server Gemini model ${model} failed, trying next fallback:`, lastError);
      }
    }

    if (!reply) {
      return res.status(502).json({
        error: 'Model generation failed across candidate models',
        details: lastError,
      });
    }
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Error communicating with Gemini model',
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
    const apiKey = process.env.SOCIALCRAWL_API_KEY;

    if (shouldRefresh && apiKey) {
      try {
        const fetchUrl = 'https://www.socialcrawl.dev/v1/linkedin/profile/recommendations?url=https://www.linkedin.com/in/matan-elmaliach/&type=received&max_credits=10';
        const scRes = await fetch(fetchUrl, {
          headers: {
            'x-api-key': apiKey,
            'Accept': 'application/json',
          },
        });
        if (scRes.ok) {
          const freshData = await scRes.json();
          fs.writeFileSync(path.resolve(__dirname, 'linkedin_recommendations.json'), JSON.stringify(freshData, null, 2), 'utf-8');
        }
      } catch (refreshErr) {
        console.warn('SocialCrawl refresh error:', refreshErr);
      }
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
