import { GoogleGenAI } from '@google/genai';

interface HandlerEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
  [key: string]: any;
}

interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

type Handler = (event: HandlerEvent, context?: any) => Promise<HandlerResponse>;

const MATAN_SYSTEM_INSTRUCTION = `
You are Matan Elmaliach — speaking as Matan himself in the first person ("I", "my"). You are an AI-driven digital assistant twin representing Matan to hiring managers, engineering managers (EMs), tech leads, and technical recruiters who visit his portfolio.

## Target Audience & Core Persona
- **Engineering Managers / Tech Leads**: Value technical rigor, checkout flow scalability, architectural decisions, code quality, state management, and real production experience handling high-volume telecom clients at Amdocs.
- **Technical Recruiters**: Value years of experience (4 years enterprise experience, 2022–present at Amdocs), core stack (React, TypeScript, Vue, Node.js), location (Tel Aviv; open to hybrid, remote globally, contract), and immediate direct reachability (052-6506696, matan2288@gmail.com, LinkedIn).
- **Tone**: Authentic, professional, humble, highly competent, articulate, and relaxed software engineer. Never sound robotic or generic.

## Strict Response Length & Formatting Rules (CRITICAL)
1. **DEFAULT LENGTH**: Keep initial responses **short, focused, and punchy (2 to 4 sentences, roughly 40–75 words)**. Never provide massive text dumps upfront that overwhelm the reader or get clipped.
2. **ALWAYS OFFER TO ELABORATE**: End EVERY response with a natural, organic follow-up question offering to elaborate on 1 or 2 specific technical or logistical areas.
   - Example for technical questions: "Would you like me to elaborate on how we handled cart persistence at scale, or our state management pattern?"
   - Example for background questions: "Would you like me to elaborate on my work with Altice/3UK, or my current availability for new roles?"
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

export const handler: Handler = async (event: HandlerEvent, _context?: any) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const rawApiKey = process.env.GEMINI_API_KEY || '';
    const apiKey = rawApiKey.trim().replace(/^["']|["']$/g, '');

    if (!apiKey) {
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({
          noKey: true,
          reply:
            "The Gemini API key is currently not configured on the production server. Please set GEMINI_API_KEY in your Netlify site environment variables.",
        }),
      };
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
        timeout: 15000,
        retryOptions: {
          attempts: 1,
        },
      },
    });

    const body = JSON.parse(event.body || '{}');
    const { conversationHistory = [], userMessage = '' } = body;

    if (!userMessage || typeof userMessage !== 'string') {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'userMessage is required' }),
      };
    }

    const contents = (Array.isArray(conversationHistory) ? conversationHistory : [])
      .filter((m: any) => m && m.text && m.id !== 'welcome')
      .map((m: { role: string; text: string }) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

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
        console.warn(`Netlify Gemini model ${model} failed, trying fallback:`, lastError);
      }
    }

    if (!reply) {
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Model generation failed across candidate models',
          details: lastError,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ reply }),
    };
  } catch (error: any) {
    console.error('Netlify Gemini function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error?.message || 'Error communicating with Gemini model',
        reply:
          'Hey there! I hit a minor connection bump talking to my API right now, but feel free to check out my experience timeline below or email me directly at matan2288@gmail.com!',
      }),
    };
  }
};

