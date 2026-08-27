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

// IMPORTANT: Upstash's REST API expects the raw value as the POST body itself,
// not wrapped in a JSON object. Sending { value: "..." } causes the entire
// wrapper object to be stored as the value, one level too deep.
async function writeRedisValue(path, rawStringValue) {
  const baseUrl = getEnv('KV_REST_API_URL').replace(/\/$/, '');
  const token = getEnv('KV_REST_API_TOKEN');

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: rawStringValue,
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
  await writeRedisValue(`/set/${CONTENT_KEY}`, JSON.stringify(normalizedContent));
  return normalizedContent;
}