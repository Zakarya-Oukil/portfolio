/**
 * Public contact configuration. Static-host safe: read at build time from env, no server needed.
 * Set in a `.env.local` (local) or in the Vercel project settings:
 *   VITE_CONTACT_EMAIL=you@example.com
 *   VITE_BOOKING_URL=https://cal.com/you/15min
 * A missing value hides the matching action instead of showing a dead or placeholder link.
 */
const env = import.meta.env as Record<string, string | undefined>;

const validEmail = (value?: string) => (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? value.trim() : '');
const validHttp = (value?: string) => {
  try { const url = new URL((value || '').trim()); return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''; } catch { return ''; }
};

export const CONTACT = {
  email: validEmail(env.VITE_CONTACT_EMAIL),
  bookingUrl: validHttp(env.VITE_BOOKING_URL),
  github: validHttp(env.VITE_GITHUB_URL),
  linkedin: validHttp(env.VITE_LINKEDIN_URL)
};

export const mailto = (subject: string, body = '') =>
  CONTACT.email ? `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}` : '';
