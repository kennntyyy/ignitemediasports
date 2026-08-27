import { normalizeContent } from '../defaultContent.js';

const CONTENT_KEY = 'site-content';

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

async function readRedisValue(path) {
  const baseUrl = getEnv('KV_REST_API_URL').replace(/\/$/, '');
  const token = getEnv('KV_REST_API_TOKEN');

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`KV request failed with status ${response.status}`);
  }

  return response.json();
}

async function writeRedisValue(path, body) {
  const baseUrl = getEnv('KV_REST_API_URL').replace(/\/$/, '');
  const token = getEnv('KV_REST_API_TOKEN');

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`KV request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getStoredContent() {
  try {
    const response = await readRedisValue(`/get/${CONTENT_KEY}`);
    const rawValue = response.result;
    if (!rawValue) return normalizeContent();

    const parsed = typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
    return normalizeContent(parsed);
  } catch {
    return normalizeContent();
  }
}

export async function setStoredContent(content) {
  const normalizedContent = normalizeContent(content);
  await writeRedisValue(`/set/${CONTENT_KEY}`, { value: JSON.stringify(normalizedContent) });
  return normalizedContent;
}