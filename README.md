# The Psychedelics & Contemplation Lab — website

Built with [Astro](https://astro.build) and the lab's shared [design-system](https://github.com/The-Psychedelics-and-Contemplation-Lab/design-system). Published automatically to GitHub Pages on every push to `main`.

## Editing content
Texts live in `src/content/` (people bios, research pages, media list in Markdown; `publications.json`) and `src/pages/` (page layout). See `MIGRATION-REPORT.md` for the content map and the media files still to add under `public/uploads/`. Edit a file on GitHub → *Commit changes* → the site rebuilds in about a minute. `src/site.config.ts` holds the site name, accent colour, navigation and affiliation line.

## Working locally
```
npm install
npm run dev        # http://localhost:4321
npm run build && npm run check:html
```
