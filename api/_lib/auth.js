import crypto from 'crypto';

const COOKIE_NAME = 'ignite_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

// scrypt params — balanced for Vercel serverless ( <100ms per hash )
const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

// ---------------------------------------------------------------------------
// Password hashing — scrypt with per-password salt
// Stored format:  scrypt$<base64url-salt>$<base64url-derivedKey>
// Legacy format:  <hex-sha256>  (still accepted via timing-safe compare)
// ---------------------------------------------------------------------------

/**
 * Hash a plaintext password with scrypt.
 * Returns the storage string to put in ADMIN_PASSWORD_HASH.
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS);
  return `scrypt$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

/**
 * Legacy unsalted SHA-256 hash — kept only for backward-compat verification.
 */
function legacySha256(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyScrypt(password, stored) {
  // stored = scrypt$salt$hash  (both base64url)
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, saltB64, hashB64] = parts;
  try {
    const salt = Buffer.from(saltB64, 'base64url');
    const expected = Buffer.from(hashB64, 'base64url');
    if (salt.length === 0 || expected.length !== SCRYPT_KEYLEN) return false;
    const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS);
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function passwordMatches(password) {
  const expectedHash = getEnv('ADMIN_PASSWORD_HASH');

  // New format: scrypt$...
  if (expectedHash.startsWith('scrypt$')) {
    return verifyScrypt(password, expectedHash);
  }

  // Legacy format: hex sha256 — timing-safe compare
  const candidate = legacySha256(password);
  const a = Buffer.from(candidate, 'utf8');
  const b = Buffer.from(expectedHash, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// Session tokens (HMAC, stateless)
// ---------------------------------------------------------------------------

export function createSessionToken() {
  const secret = getEnv('ADMIN_SESSION_SECRET');
  const payload = {
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;

  const secret = getEnv('ADMIN_SESSION_SECRET');
  const [body, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');

  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(body));
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function parseCookies(request) {
  const header = request.headers.cookie ?? '';
  return header.split(';').reduce((cookies, item) => {
    const [rawKey, ...rawValue] = item.trim().split('=');
    if (!rawKey) return cookies;
    cookies[rawKey] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
}

export function getSessionToken(request) {
  return parseCookies(request)[COOKIE_NAME] ?? '';
}

export function hasValidSession(request) {
  try {
    return verifySessionToken(getSessionToken(request));
  } catch {
    return false;
  }
}

export function buildSessionCookie(value) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}
