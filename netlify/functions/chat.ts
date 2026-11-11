import { executeChatPipeline } from '../../src/server/chatPipeline.ts';

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
    const body = JSON.parse(event.body || '{}');
    const { conversationHistory = [], userMessage = '' } = body;

    if (!userMessage || typeof userMessage !== 'string') {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'userMessage is required' }),
      };
    }

    const result = await executeChatPipeline({
      userMessage,
      conversationHistory,
      env: process.env,
      timeoutMs: 15000,
    });

    if (result.statusCode === 200) {
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'X-Chat-Source': result.source,
        },
        body: JSON.stringify({
          reply: result.reply,
          source: result.source,
        }),
      };
    }

    return {
      statusCode: result.statusCode,
      headers: corsHeaders,
      body: JSON.stringify({
        error: result.error,
        ...(result.statusCode === 502 ? { code: result.code } : {}),
        reply: result.reply,
      }),
    };
  } catch (error: any) {
    console.error('Netlify chat function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error?.message || 'Error communicating with chat pipeline',
        reply:
          'Hey there! I hit a minor connection bump talking to my API right now, but feel free to check out my experience timeline below or email me directly at matan2288@gmail.com!',
      }),
    };
  }
};

