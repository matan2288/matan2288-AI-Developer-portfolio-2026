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
    const { username = '', password = '' } = body;

    const expectedUser = (process.env.EDITOR_USERNAME || 'admin').trim();
    const rawExpectedPass = process.env.EDITOR_PASSWORD || '';
    const expectedPass = rawExpectedPass.trim().replace(/^["']|["']$/g, '');

    if (!expectedPass) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'EDITOR_PASSWORD is not configured in Netlify environment variables.',
        }),
      };
    }

    if (username.trim() === expectedUser && password === expectedPass) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Invalid username or password.',
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: err?.message || 'Bad Request',
      }),
    };
  }
};

