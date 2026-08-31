import { normalizeContent } from '../defaultContent.js';

const CONTENT_KEY = 'site-content';
const CHUNK_SIZE = 900_000; // keep each Redis value under 1MB
const CHUNKS_META_KEY = `${CONTENT_KEY}:chunks`;

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

async function deleteRedisValue(path) {
  const baseUrl = getEnv('KV_REST_API_URL').replace(/\/$/, '');
  const token = getEnv('KV_REST_API_TOKEN');
  await fetch(`${baseUrl}/del/${path.split('/').pop()}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
}

export async function getStoredContent() {
  try {
    // Try chunked format first
    const meta = await readRedisValue(`/get/${CHUNKS_META_KEY}`);
    const numChunks = meta?.result ? Number(meta.result) : 0;
    if (numChunks > 0) {
      const parts = [];
      for (let i = 0; i < numChunks; i++) {
        const r = await readRedisValue(`/get/${CONTENT_KEY}:${i}`);
        if (r?.result) parts.push(typeof r.result === 'string' ? r.result : JSON.stringify(r.result));
      }
      const raw = parts.join('');
      if (raw) {
        const parsed = JSON.parse(raw);
        return normalizeContent(parsed);
      }
    }

    // Fallback: single key
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
  const serialized = JSON.stringify(normalizedContent);

  if (serialized.length <= CHUNK_SIZE) {
    // Small: single key, clean up any old chunks
    await writeRedisValue(`/set/${CONTENT_KEY}`, serialized);
    // best-effort cleanup of chunked keys
    try {
      const meta = await readRedisValue(`/get/${CHUNKS_META_KEY}`);
      const n = meta?.result ? Number(meta.result) : 0;
      if (n > 0) {
        for (let i = 0; i < n; i++) await deleteRedisValue(`/del/${CONTENT_KEY}:${i}`);
        await deleteRedisValue(`/del/${CHUNKS_META_KEY}`);
      }
    } catch {}
    return normalizedContent;
  }

  // Large: split into chunks
  const numChunks = Math.ceil(serialized.length / CHUNK_SIZE);
  for (let i = 0; i < numChunks; i++) {
    const chunk = serialized.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    await writeRedisValue(`/set/${CONTENT_KEY}:${i}`, chunk);
  }
  await writeRedisValue(`/set/${CHUNKS_META_KEY}`, String(numChunks));

  // Remove stale single key if it exists (optional, keeps old data from confusing get)
  // Keep it as fallback — not deleted, chunked read takes priority

  return normalizedContent;
}
