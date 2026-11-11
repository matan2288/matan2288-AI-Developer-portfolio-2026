export type ChatPipelineSource = 'rag';

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
}

export type ChatPipelineResult =
  | {
      statusCode: 200;
      reply: string;
      source: ChatPipelineSource;
    }
  | {
      statusCode: 503;
      error: string;
      reply: string;
    }
  | {
      statusCode: 502;
      error: string;
      code: string;
      reply: string;
    };

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

async function callRagPipeline(
  userMessage: string,
  history: ChatHistoryEntry[],
  ragUrl: string,
  healthUrl: string,
  authToken: string,
  timeoutMs: number
): Promise<{ reply?: string; code?: string; reason?: string }> {
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
          code: `health_http_${healthRes.status}`,
          reason: `RAG health check (${healthUrl}) returned HTTP ${healthRes.status}`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        code: 'health_error',
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
        code: `ask_http_${askRes.status}`,
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
        code: 'ask_empty_reply',
        reason: `RAG endpoint (${ragUrl}) returned an empty reply`,
      };
    }

    return { reply };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = err instanceof Error && err.name === 'TimeoutError';
    return {
      code: isTimeout ? 'ask_timeout' : 'ask_error',
      reason: `RAG request (${ragUrl}) failed: ${msg}`,
    };
  }
}

/**
 * Executes the RAG-only chat pipeline via server-side BFF proxy without exposing
 * upstream RAG URLs or Bearer tokens to browser clients.
 */
export async function executeChatPipeline({
  userMessage,
  conversationHistory = [],
  env,
  timeoutMs = 15000,
}: ChatPipelineInput): Promise<ChatPipelineResult> {
  const history = Array.isArray(conversationHistory) ? conversationHistory : [];
  const ragUrl = resolveRagEndpoint(env);
  const authToken =
    cleanEnv(env.API_AUTH_TOKEN) ||
    cleanEnv(env.RAG_AUTH_TOKEN) ||
    cleanEnv(env.RAG_API_KEY) ||
    cleanEnv(env.API_KEY);

  if (!ragUrl) {
    console.warn('[ChatPipeline] Neither RAG_URL nor RAG_API_URL is configured.');
    return {
      statusCode: 503,
      error: 'RAG endpoint is not configured',
      reply: 'The RAG pipeline endpoint is not configured on the server.',
    };
  }

  // Run /health preflight for explicit RAG_HEALTH_URL or local loopback servers;
  // remote serverless endpoints (e.g. Modal) go straight to /ask to avoid cold-start double latency.
  const explicitHealthUrl = cleanEnv(env.RAG_HEALTH_URL);
  const healthUrl = explicitHealthUrl || (isLoopbackUrl(ragUrl) ? deriveHealthUrl(ragUrl) : '');
  const ragResult = await callRagPipeline(
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

  console.warn(`[ChatPipeline] ${ragResult.reason || 'RAG pipeline unavailable'}`);
  return {
    statusCode: 502,
    error: 'RAG pipeline unavailable',
    code: ragResult.code || 'rag_unavailable',
    reply:
      'I could not reach my knowledge base right now. Please try again in a moment or email me directly at matan2288@gmail.com.',
  };
}
