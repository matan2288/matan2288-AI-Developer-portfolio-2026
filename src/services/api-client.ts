import { ChatMessage } from "../features/dashboard/types";

const RAG_UNAVAILABLE_REPLY =
  "I could not reach my knowledge base right now. Please try again in a moment or email me directly at matan2288@gmail.com.";

/**
 * Main chat handler for Matan's digital assistant twin.
 * Proxies through /api/chat (BFF -> RAG pipeline) keeping upstream URLs and auth tokens server-side.
 */
export const chatWithMatanPersona = async (
  conversationHistory: ChatMessage[],
  userMessage: string
): Promise<string> => {
  try {
    const payload = JSON.stringify({
      conversationHistory,
      userMessage,
    });
    const headers = {
      'Content-Type': 'application/json',
    };

    // Primary endpoint: /api/chat (rewritten to /.netlify/functions/chat on prod or served by dev server)
    let res = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: payload,
    });

    // Netlify fallback if direct rewrite wasn't applied
    if (res.status === 404) {
      try {
        const netlifyRes = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers,
          body: payload,
        });
        if (netlifyRes.status !== 404) {
          res = netlifyRes;
        }
      } catch (fallbackErr) {
        console.warn('Netlify function direct fallback error:', fallbackErr);
      }
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && data.reply) {
        const source = data.source || res.headers.get('X-Chat-Source') || 'rag';
        console.info(`[Matan Twin] Source: ${source}`);
        return data.reply;
      }

      console.warn('[Matan Twin] RAG unavailable:', data.code || data.error || res.status);
      if (data.reply) {
        return data.reply;
      }
    }
  } catch (error) {
    console.warn(
      '[Matan Twin] Chat endpoint unreachable:',
      error instanceof Error ? error.message : String(error)
    );
  }

  return RAG_UNAVAILABLE_REPLY;
};
