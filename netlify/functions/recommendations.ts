import siteContent from '../../content/siteContent.json';

interface HandlerEvent {
  httpMethod: string;
  queryStringParameters?: Record<string, string>;
  headers: Record<string, string | undefined>;
  [key: string]: any;
}

interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

type Handler = (event: HandlerEvent, context?: any) => Promise<HandlerResponse>;

function mapSocialCrawlItems(items: any[]) {
  return items.map((item: any) => {
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
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  const shouldRefresh = event.queryStringParameters?.refresh === 'true';

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': shouldRefresh ? 'no-store' : 'public, max-age=3600',
  };

  try {
    if (shouldRefresh) {
      const rawKey = process.env.SOCIALCRAWL_API_KEY || '';
      const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
      if (!apiKey) {
        return {
          statusCode: 503,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'SOCIALCRAWL_API_KEY is not configured in Netlify environment variables.',
          }),
        };
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
        return {
          statusCode: scRes.status,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: `SocialCrawl API responded with ${scRes.status}: ${errText}`,
          }),
        };
      }

      const freshData: any = await scRes.json();
      const items = freshData.data?.items || freshData.items || (Array.isArray(freshData) ? freshData : []);
      const mapped = mapSocialCrawlItems(items);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          source: 'linkedin_socialcrawl_live',
          count: mapped.length,
          data: mapped,
        }),
      };
    }

    const recommendations = siteContent.recommendations || [];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        source: 'linkedin_verified',
        count: recommendations.length,
        data: recommendations,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: err?.message || 'Failed to retrieve recommendations',
      }),
    };
  }
};
