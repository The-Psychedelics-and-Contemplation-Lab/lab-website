import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** True when a file referenced as "/uploads/…" is present in public/ at build time. */
export const hasPublicFile = (p?: string) => !!p && existsSync(join(process.cwd(), 'public', p));

/** "Kyle Greenway" → "KG"; "Julien Thibault Lévesque" → "JL". */
export const initials = (name: string) => {
  const parts = name.split(/\s+/).filter((w) => /^[A-ZÀ-Ý]/.test(w));
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
};
