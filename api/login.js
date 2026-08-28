import { buildSessionCookie, createSessionToken, passwordMatches } from './_lib/auth.js';

// In-memory rate limiter (per serverless instance).
// 5 attempts per 10 minutes per IP, then 429. Resets on success.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map(); // ip -> { count, resetAt }

function getClientIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim();
  return request.socket?.remoteAddress ?? 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  entry.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

function clearAttempts(ip) {
  attempts.delete(ip);
}

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

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    response.setHeader('Retry-After', String(limit.retryAfter));
    response.status(429).json({ error: 'Too many login attempts. Try again later.' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const password = String(body?.password ?? '');

    if (!passwordMatches(password)) {
      response.setHeader('X-RateLimit-Remaining', String(limit.remaining));
      response.status(401).json({ error: 'Incorrect password' });
      return;
    }

    clearAttempts(ip);
    const token = createSessionToken();
    response.setHeader('Set-Cookie', buildSessionCookie(token));
    response.status(200).json({ authenticated: true });
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Unable to log in' });
  }
}
