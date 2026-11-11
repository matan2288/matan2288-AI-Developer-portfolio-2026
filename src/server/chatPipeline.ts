import { GoogleGenAI } from '@google/genai';

export type ChatPipelineSource = 'rag' | 'gemini-fallback';

export interface ChatHistoryEntry {
  id?: string;
  role: string;
  text: string;
}

export interface ChatPipelineInput {
  userMessage: string;
  conversationHistory?: ChatHistoryEntry[];
  env: Record<string, string | undefined>;
  timeoutMs?: number;
  noKeyReply?: string;
}

export type ChatPipelineResult =
  | {
      statusCode: 200;
      reply: string;
      source: ChatPipelineSource;
      model?: string;
    }
  | {
      statusCode: 503;
      noKey: true;
      reply: string;
    }
  | {
      statusCode: 502;
      error: string;
      details: string | null;
    };

export const MATAN_SYSTEM_INSTRUCTION = `
You are Matan Elmaliach — speaking as Matan himself in the first person ("I", "my"). You are an AI-driven digital assistant twin representing Matan to hiring managers, engineering managers (EMs), tech leads, and technical recruiters who visit his portfolio.

## Target Audience & Core Persona
- **Engineering Managers / Tech Leads**: Value technical rigor, checkout flow scalability, architectural decisions, code quality, state management, and real production experience handling high-volume telecom clients at Amdocs.
- **Technical Recruiters**: Value years of experience (4 years enterprise experience, 2022–present at Amdocs), core stack (React, TypeScript, Vue, Node.js), location (Tel Aviv; open to hybrid, remote globally, contract), and immediate direct reachability (052-6506696, matan2288@gmail.com, LinkedIn).
- **Tone**: Authentic, professional, humble, highly competent, articulate, and relaxed software engineer. Never sound robotic or generic.

## Grounding & Anti-Hallucination Rules (CRITICAL)
- Only state facts, employers, projects, dates, metrics, certifications, skills, and links that appear explicitly in the Knowledge Base below.
- Never invent or extrapolate details not listed below. If asked about something not covered in the Knowledge Base, clearly state that you don't have that verified detail on hand and offer to connect directly (matan2288@gmail.com).

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
  - **AI Engineer - Agentic AI Workflows & Frontend Platform (Jun 2025 – Present)**: UScellular / T-Mobile. Accelerated engineering velocity across a 10-developer team by architecting AI-native workflows (MCP, Cursor, Copilot), RAG POCs into production standards, 3 JS automation frameworks eliminating boilerplate across 10 developers, GA4/GTM/Firebase analytics, and custom AEM page launches (Apple, Samsung, Google).
  - **Frontend Infrastructure Engineer (Jan 2024 – Jun 2025)**: Altice USA. Built Adobe Analytics infrastructure from scratch (20+ events, bi-weekly SME syncs), OKTA SSO authentication, Drupal/AEM CMS modules, Consul flags, Experian credit checks, mentored 2 engineers (3x capacity).
  - **Frontend Engineer, E-Commerce & Regulated Systems (Jan 2023 – Jan 2024)**: Three UK. Owned core frontend delivery for UK Ofcom-mandated One Touch Switch system for millions, React/TypeScript (Redux-Saga, MUI), FCC broadband compliance, on-site UK production support across 20+ release handovers.
  - **Frontend Developer, E-Commerce & Platform Migration (Jun 2022 – Jan 2023)**: Altice USA. Storefront migration from React/Contentful to Vue.js, Drupal, and PHP on Acquia, rebuilt checkout, cart, BYOD, address validation with 100% parity.
- **Military Background (2013 — 2019)**: Israeli Navy — Diving Gear Technician Squad Commander. Led a squad of 5 maintaining critical life-support apparatus under high pressure. Instilled relentless checklist discipline and composure.
- **Discipline & Vibe**: Longtime competitive powerlifter (squat, bench, deadlift). Brings progressive overload, metric tracking, and systematic debugging to engineering.
- **AI Acceleration**: Practical integration of GenAI tools (Cursor, Agent Orchestration, MCP, RAG, prompt engineering) into the daily software development lifecycle.
`;

function cleanEnv(raw: string | undefined): string {
  return (raw || '').trim().replace(/^["']|["']$/g, '');
}

function isLoopbackUrl(urlStr: string): boolean {
  try {
    const { hostname } = new URL(urlStr);
    return hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '::1';
  } catch {
    return false;
  }
}

function deriveHealthUrl(ragUrl: string): string {
  try {
    const parsed = new URL(ragUrl);
    return `${parsed.origin}/health`;
  } catch {
    return '';
  }
}

function extractRagReply(data: unknown): string {
  if (typeof data === 'string') {
    return data.trim();
  }
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    for (const key of ['reply', 'answer', 'response', 'text', 'output', 'result']) {
      const val = record[key];
      if (typeof val === 'string' && val.trim()) {
        return val.trim();
      }
    }
  }
  return '';
}

function resolveRagEndpoint(env: Record<string, string | undefined>): string {
  const directUrl = cleanEnv(env.RAG_URL);
  if (directUrl) return directUrl;

  const baseUrl = cleanEnv(env.RAG_API_URL);
  if (!baseUrl) return '';

  const trimmed = baseUrl.replace(/\/+$/, '');
  return trimmed.endsWith('/ask') ? trimmed : `${trimmed}/ask`;
}

function buildRagHeaders(authToken: string, isPost: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (isPost) {
    headers['Content-Type'] = 'application/json';
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
}

async function postToRag(
  ragUrl: string,
  payload: Record<string, unknown>,
  authToken: string,
  timeoutMs: number
): Promise<globalThis.Response> {
  return fetch(ragUrl, {
    method: 'POST',
    headers: buildRagHeaders(authToken, true),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  });
}

async function tryRagPipeline(
  userMessage: string,
  history: ChatHistoryEntry[],
  ragUrl: string,
  healthUrl: string,
  authToken: string,
  timeoutMs: number
): Promise<{ reply?: string; reason?: string }> {
  if (healthUrl) {
    const healthTimeoutMs = isLoopbackUrl(healthUrl) ? 1500 : Math.min(timeoutMs, 5000);
    try {
      const healthRes = await fetch(healthUrl, {
        method: 'GET',
        headers: buildRagHeaders(authToken, false),
        signal: AbortSignal.timeout(healthTimeoutMs),
      });
      if (!healthRes.ok) {
        return {
          reason: `RAG health check (${healthUrl}) returned HTTP ${healthRes.status}`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        reason: `RAG health check (${healthUrl}) failed: ${msg}`,
      };
    }
  }

  const sanitizedHistory = history
    .filter((m) => m && m.text && m.id !== 'welcome')
    .map((m) => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      text: m.text,
    }));

  try {
    let askRes = await postToRag(
      ragUrl,
      {
        question: userMessage,
        history: sanitizedHistory,
        query: userMessage,
        userMessage,
        conversationHistory: sanitizedHistory,
      },
      authToken,
      timeoutMs
    );

    // Retry with stricter schemas if the RAG server uses Pydantic extra='forbid'
    if (askRes.status === 422) {
      askRes = await postToRag(
        ragUrl,
        { question: userMessage, history: sanitizedHistory },
        authToken,
        timeoutMs
      );
      if (askRes.status === 422) {
        askRes = await postToRag(ragUrl, { question: userMessage }, authToken, timeoutMs);
      }
      if (askRes.status === 422) {
        askRes = await postToRag(ragUrl, { query: userMessage }, authToken, timeoutMs);
      }
    }

    if (!askRes.ok) {
      const errBody = await askRes.text().catch(() => '');
      return {
        reason: `RAG endpoint (${ragUrl}) returned HTTP ${askRes.status}${errBody ? `: ${errBody.slice(0, 200)}` : ''}`,
      };
    }

    const contentType = askRes.headers.get('content-type') || '';
    const parsedData: unknown = contentType.includes('application/json')
      ? await askRes.json()
      : await askRes.text();

    const reply = extractRagReply(parsedData);
    if (!reply) {
      return {
        reason: `RAG endpoint (${ragUrl}) returned an empty reply`,
      };
    }

    return { reply };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      reason: `RAG request (${ragUrl}) failed: ${msg}`,
    };
  }
}

/**
 * Executes the chat pipeline via server-side BFF proxy: attempts the configured RAG endpoint first
 * (with optional /health preflight and Bearer auth), then falls back to Gemini without exposing
 * upstream RAG URLs or tokens to the browser.
 */
export async function executeChatPipeline({
  userMessage,
  conversationHistory = [],
  env,
  timeoutMs = 15000,
  noKeyReply,
}: ChatPipelineInput): Promise<ChatPipelineResult> {
  const history = Array.isArray(conversationHistory) ? conversationHistory : [];
  const ragUrl = resolveRagEndpoint(env);
  const authToken = cleanEnv(env.API_AUTH_TOKEN) || cleanEnv(env.RAG_AUTH_TOKEN);

  if (ragUrl) {
    // Run /health preflight for explicit RAG_HEALTH_URL or local loopback servers;
    // remote serverless endpoints (e.g. Modal) go straight to /ask to avoid cold-start double latency.
    const explicitHealthUrl = cleanEnv(env.RAG_HEALTH_URL);
    const healthUrl = explicitHealthUrl || (isLoopbackUrl(ragUrl) ? deriveHealthUrl(ragUrl) : '');
    const ragResult = await tryRagPipeline(
      userMessage,
      history,
      ragUrl,
      healthUrl,
      authToken,
      timeoutMs
    );

    if (ragResult.reply) {
      console.info(`[ChatPipeline] Answered via RAG (${ragUrl})`);
      return {
        statusCode: 200,
        reply: ragResult.reply,
        source: 'rag',
      };
    }

    console.warn(
      `[ChatPipeline] ${ragResult.reason || 'RAG pipeline unavailable'}; falling back to Gemini.`
    );
  }

  const apiKey = cleanEnv(env.GEMINI_API_KEY);
  if (!apiKey) {
    return {
      statusCode: 503,
      noKey: true,
      reply:
        noKeyReply ||
        'The Gemini API key is currently not configured. Please set GEMINI_API_KEY in your environment variables.',
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      timeout: timeoutMs,
      retryOptions: {
        attempts: 1,
      },
    },
  });

  const contents = history
    .filter((m) => m && m.text && m.id !== 'welcome')
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  const configuredModel = cleanEnv(env.GEMINI_MODEL) || 'gemini-3.1-flash-lite';
  const candidateModels = Array.from(
    new Set([configuredModel, 'gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'])
  ).filter(Boolean);

  let lastError: string | null = null;
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: MATAN_SYSTEM_INSTRUCTION,
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      });
      if (response.text) {
        console.info(`[ChatPipeline] Answered via Gemini fallback (${model})`);
        return {
          statusCode: 200,
          reply: response.text,
          source: 'gemini-fallback',
          model,
        };
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`Gemini model ${model} failed, trying fallback:`, lastError);
    }
  }

  return {
    statusCode: 502,
    error: 'Model generation failed across candidate models',
    details: lastError,
  };
}

