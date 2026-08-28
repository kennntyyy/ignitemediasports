#!/usr/bin/env node
import crypto from 'crypto';

const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}
const salt = crypto.randomBytes(16);
const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS);
const hash = `scrypt$${salt.toString('base64url')}$${derived.toString('base64url')}`;
console.log(hash);
console.log('\nSet this as ADMIN_PASSWORD_HASH on Vercel.');
console.log('Legacy SHA-256 hex (for reference only):', crypto.createHash('sha256').update(password).digest('hex'));
