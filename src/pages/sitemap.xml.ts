import type { APIRoute } from 'astro';
import { site } from '../site.config';

// Every real page of the site. Legacy WordPress slugs (/about/, /contact/, /services/) are
// redirect stubs and are deliberately left out.
const research = Object.keys(import.meta.glob('./research/*.astro'))
  .map((f) => f.replace('./research/', '/research/').replace('.astro', '/').replace('/index/', '/'));
const paths = [
  '/', '/research/', '/psychedelic-research/', '/contemplative-research/', '/people/', '/publications/', '/media/',
  ...research.filter((p) => p !== '/research/'),
];

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
