import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface FileToCommit {
  path: string;
  content: string;
}

interface CommitPayload {
  files: FileToCommit[];
  message?: string;
  branch?: string;
}

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || process.env.VITE_GITHUB_OWNER || 'matan2288';
    const repo = process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO || '';
    const branch = process.env.GITHUB_BRANCH || process.env.VITE_GITHUB_BRANCH || 'main';

    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'GITHUB_TOKEN is not configured on the server. Please set GITHUB_TOKEN in Netlify Environment Variables.',
        }),
      };
    }

    if (!repo) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'GITHUB_REPO is not configured on the server. Please set GITHUB_REPO in Netlify Environment Variables.',
        }),
      };
    }

    const body: CommitPayload = JSON.parse(event.body || '{}');
    const { files = [], message = 'cms: update content' } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'No files provided to commit' }),
      };
    }

    const headers = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Netlify-TinaCMS-Committer',
      'Content-Type': 'application/json',
    };

    // Commit each file sequentially to GitHub REST API
    const results = [];
    for (const file of files) {
      let existingSha: string | undefined;
      const getFileUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${file.path}?ref=${encodeURIComponent(branch)}`;
      const getRes = await fetch(getFileUrl, { headers });
      if (getRes.ok) {
        const fileInfo = await getRes.json();
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
        throw new Error(`Failed to commit ${file.path}: ${putRes.status} ${errText}`);
      }

      const putData = await putRes.json();
      results.push({ path: file.path, sha: putData.commit?.sha });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: `Successfully committed ${results.length} files to ${owner}/${repo}@${branch}`,
        results,
        commitSha: results[0]?.sha,
      }),
    };
  } catch (err: any) {
    console.error('Content commit error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: err?.message || 'Internal commit error',
      }),
    };
  }
};
