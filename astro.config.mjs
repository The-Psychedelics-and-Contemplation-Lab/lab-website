import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { satteri } from '@astrojs/markdown-satteri';
import { defineHastPlugin } from 'satteri';
import { site } from './src/site.config';
// While the site is tested on github.io it lives under /<repo>/ ; once the
// custom domain is switched on, set PUBLIC_SITE_BASE="" in the workflow.
const base = process.env.PUBLIC_SITE_BASE ?? site.base;
const prefix = base.replace(/\/$/, '');

/**
 * Markdown post-processing shared by every content file (a Sätteri hast plugin):
 *  - outbound links get target="_blank" rel="noopener noreferrer" (the ↗ icon is automatic);
 *  - internal links / images written as "/people/" or "/uploads/…" get the base prefix;
 *  - an <img> whose file is not (yet) in public/ is dropped so the page never shows a broken image
 *    (the missing files are listed in MIGRATION-REPORT.md).
 * Raw HTML inside Markdown is passed through untouched, so write target/rel there by hand.
 */
const siteLinks = defineHastPlugin({
  name: 'pcl-site-links',
  element: {
    filter: ['a', 'img', 'h2'],
    visit(node, ctx) {
      const p = node.properties ?? {};
      // Section headings of long Markdown pages reveal on scroll (art-direction pass).
      if (node.tagName === 'h2') {
        const cls = Array.isArray(p.className) ? p.className : typeof p.className === 'string' ? p.className.split(/\s+/) : [];
        if (!cls.includes('reveal')) ctx.setProperty(node, 'className', [...cls, 'reveal']);
        return;
      }
      if (node.tagName === 'a' && typeof p.href === 'string') {
        if (/^https?:\/\//.test(p.href)) { ctx.setProperty(node, 'target', '_blank'); ctx.setProperty(node, 'rel', 'noopener noreferrer'); }
        else if (p.href.startsWith('/')) ctx.setProperty(node, 'href', prefix + p.href);
      }
      if (node.tagName === 'img' && typeof p.src === 'string' && p.src.startsWith('/')) {
        if (!existsSync(join(process.cwd(), 'public', p.src))) {
          const parent = ctx.parent(node);
          // Drop the image, and the paragraph around it when the image was its only content.
          if (parent && parent.type === 'element' && parent.tagName === 'p' && ctx.textContent(parent).trim() === '') ctx.removeNode(parent);
          else ctx.removeNode(node);
          return;
        }
        ctx.setProperty(node, 'src', prefix + p.src);
        ctx.setProperty(node, 'loading', 'lazy');
        ctx.setProperty(node, 'decoding', 'async');
      }
    },
  },
});

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? site.previewUrl,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  markdown: { processor: satteri({ hastPlugins: [siteLinks] }) },
});
