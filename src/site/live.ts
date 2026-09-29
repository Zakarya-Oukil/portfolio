import { useEffect, useState } from 'react';
import { CONTACT } from './site-config';

/**
 * Contact channels, availability facts and CV files, as the owner sets them in the admin.
 * Read once from the public portfolio endpoint and merged over the build-time values. Anything
 * empty stays hidden, so the site never shows a dead link or an unconfirmed claim.
 */
export interface LiveContent {
  email: string; bookingUrl: string; phone: string; whatsapp: string; linkedin: string; instagram: string; github: string; ejptVerify: string;
  facts: [string, string][];
  cv: Record<string, { href: string; filename: string }>;
}

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const http = (value: string) => { try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''; } catch { return ''; } };
const email = (value: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : '');
const phone = (value: string) => (/^\+?[\d\s().-]{7,20}$/.test(value) ? value : '');
const env = import.meta.env as Record<string, string | undefined>;

const BASE: LiveContent = {
  email: CONTACT.email, bookingUrl: CONTACT.bookingUrl, phone: CONTACT.phone, whatsapp: CONTACT.whatsapp, linkedin: CONTACT.linkedin,
  instagram: CONTACT.instagram, github: CONTACT.github, ejptVerify: http(clean(env.VITE_EJPT_VERIFY_URL)), facts: [], cv: {}
};

let cache: LiveContent | null = null;
let pending: Promise<LiveContent> | null = null;

function merge(data: any): LiveContent {
  const recruiter = data?.config?.recruiter ?? {}, pass = data?.config?.recruiterFastPass ?? {};
  const facts: [string, string][] = [['Availability', clean(pass.availability)], ['Work preference', clean(pass.workPreference)], ['Work authorization', clean(pass.workAuthorization)], ['Security clearance', clean(pass.clearance)]].filter(([, value]) => value) as [string, string][];
  const cv: LiveContent['cv'] = {};
  (Array.isArray(pass.roles) ? pass.roles : []).forEach((role: any) => {
    const href = clean(role?.resumeUrl);
    if (role?.id && href && (href.startsWith('/') || http(href))) cv[role.id] = { href, filename: clean(role.resumeFilename) || 'CV.pdf' };
  });
  const generalCv = clean(recruiter.resumeUrl);
  if (generalCv && (generalCv.startsWith('/') || http(generalCv))) cv.general = { href: generalCv, filename: 'Zakarya_Oukil_CV.pdf' };
  return {
    email: email(clean(recruiter.email)) || BASE.email,
    bookingUrl: http(clean(recruiter.bookingUrl)) || BASE.bookingUrl,
    phone: phone(clean(recruiter.phone)) || BASE.phone,
    whatsapp: phone(clean(recruiter.whatsapp)) || BASE.whatsapp,
    linkedin: http(clean(recruiter.linkedinUrl)) || BASE.linkedin,
    instagram: http(clean(recruiter.instagramUrl)) || BASE.instagram,
    github: http(clean(recruiter.githubUrl)) || BASE.github,
    ejptVerify: http(clean(recruiter.ejptVerifyUrl)) || BASE.ejptVerify,
    facts, cv
  };
}

function load(): Promise<LiveContent> {
  if (cache) return Promise.resolve(cache);
  pending ||= fetch('/api/portfolio-data', { cache: 'no-store' })
    .then(res => (res.ok && (res.headers.get('content-type') || '').includes('application/json') ? res.json() : null))
    .then(data => (cache = data ? merge(data) : BASE))
    .catch(() => (cache = BASE));
  return pending;
}

export function useLiveContent(): LiveContent {
  const [value, setValue] = useState<LiveContent>(cache || BASE);
  useEffect(() => { let alive = true; load().then(next => { if (alive) setValue(next); }); return () => { alive = false; }; }, []);
  return value;
}

export const mailtoFor = (address: string, subject: string) => (address ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : '');
