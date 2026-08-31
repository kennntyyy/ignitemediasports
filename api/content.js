import { getStoredContent, setStoredContent } from './_lib/store.js';
import { hasValidSession } from './_lib/auth.js';

const MAX_CONTENT_BYTES = 80 * 1024 * 1024; // 80MB — chunked in store.js to stay under per-value 1MB

async function readJsonBody(request) {
  const chunks = [];
  let total = 0;
  for await (const chunk of request) {
    const buf = Buffer.from(chunk);
    total += buf.length;
    if (total > MAX_CONTENT_BYTES + 50_000) {
      throw new Error(`Payload too large (>${MAX_CONTENT_BYTES} bytes). Remove some uploaded images or use URL references.`);
    }
    chunks.push(buf);
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
      // Extra guard on serialized size (data-URL bloat)
      const serialized = JSON.stringify(body);
      if (serialized.length > MAX_CONTENT_BYTES) {
        response.status(413).json({
          error: `Content too large (${Math.round(serialized.length / 1024)}KB). Limit is ${Math.round(MAX_CONTENT_BYTES / 1024)}KB. Remove some uploaded images or use URL references instead of file uploads.`,
        });
        return;
      }
      const savedContent = await setStoredContent(body);
      response.status(200).json(savedContent);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unable to save content';
      const status = msg.includes('too large') || msg.includes('Payload too large') ? 413 : 400;
      response.status(status).json({ error: msg });
    }
    return;
  }

  response.setHeader('Allow', 'GET, PUT');
  response.status(405).json({ error: 'Method not allowed' });
}
