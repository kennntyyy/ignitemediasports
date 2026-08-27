import { buildSessionCookie, createSessionToken, passwordMatches } from './_lib/auth.js';

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }
  if (chunks.length === 0) return null;
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const password = String(body?.password ?? '');

    if (!passwordMatches(password)) {
      response.status(401).json({ error: 'Incorrect password' });
      return;
    }

    const token = createSessionToken();
    response.setHeader('Set-Cookie', buildSessionCookie(token));
    response.status(200).json({ authenticated: true });
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Unable to log in' });
  }
}