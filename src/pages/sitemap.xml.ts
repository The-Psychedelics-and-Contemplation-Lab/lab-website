import type { APIRoute } from 'astro';
import { site } from '../site.config';
const paths = [
  '/', '/research/',
  '/psychedelic-research/',
  '/psychedelic-research/ketamine-for-refractory-depression/',
  '/psychedelic-research/psychedelics-and-music/',
  '/psychedelic-research/psychedelic-research-methodologies/',
  '/psychedelic-research/real-world-psilocybin-therapy/',
  '/contemplative-research/',
  '/contemplative-research/meditation-and-the-plasticity-of-the-self/',
  '/contemplative-research/imagination-and-invisible-presence/',
  '/contemplative-research/interpersonal-transmission-of-contemplative-states/',
  '/contemplative-research/contemplative-practice-in-ecological-context/',
  '/people/', '/publications/', '/media/', '/contact/',
];
export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
