import fs from 'node:fs';
import { passwordHash } from '../server/portfolio-api.mjs';
// Supply credentials through deployment secrets, never frontend VITE_* variables.
const username = process.env.ADMIN_USERNAME, password = process.env.ADMIN_PASSWORD;
if (!username || !password || password.length < 12) throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD (at least 12 characters), then run npm run admin:setup.');
fs.mkdirSync('server', { recursive: true });
fs.writeFileSync('server/auth.local.json', JSON.stringify({ username, passwordHash: passwordHash(password) }), { mode: 0o600 });
console.log('Admin credential hash configured in ignored local storage.');
