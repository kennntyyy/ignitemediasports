import { getStoredContent, setStoredContent } from './_lib/store.js';
import { hasValidSession } from './_lib/auth.js';

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }
  if (chunks.length === 0) return null;
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const content = await getStoredContent();
    response.status(200).json(content);
    return;
  }

  if (request.method === 'PUT') {
    if (!hasValidSession(request)) {
      response.status(401).json({ error: 'Not authenticated' });
      return;
    }

    try {
      const body = await readJsonBody(request);
      const savedContent = await setStoredContent(body);
      response.status(200).json(savedContent);
    } catch (error) {
      response.status(400).json({ error: error instanceof Error ? error.message : 'Unable to save content' });
    }
    return;
  }

  response.setHeader('Allow', 'GET, PUT');
  response.status(405).json({ error: 'Method not allowed' });
}