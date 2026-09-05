---
// src/pages/sitemap.xml.ts
// Main XML sitemap — submit this as the primary sitemap in Google Search Console.
// Reference the hreflang sitemap as a secondary sitemap.
//
// Access at: https://avantisfs.ca/sitemap.xml

export const GET = () => {
  const SITE = 'https://avantisfs.ca';

  interface Page {
    url:        string;
    lastmod:    string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority:   string;
  }

  const pages: Page[] = [
    // ── English (root) ─────────────────────────────
    { url: `${SITE}/`,                 lastmod: '2025-01-01', changefreq: 'monthly', priority: '1.0' },
    { url: `${SITE}/group-insurance/`, lastmod: '2025-01-01', changefreq: 'monthly', priority: '0.8' },
    { url: `${SITE}/other-services/`,  lastmod: '2025-01-01', changefreq: 'monthly', priority: '0.8' },

    // ── French (/fr/) ───────────────────────────────
    { url: `${SITE}/fr/`,                           lastmod: '2025-01-01', changefreq: 'monthly', priority: '0.9' },
    { url: `${SITE}/fr/assurance-collective/`,      lastmod: '2025-01-01', changefreq: 'monthly', priority: '0.8' },
    { url: `${SITE}/fr/autres-services/`,           lastmod: '2025-01-01', changefreq: 'monthly', priority: '0.8' },
  ];

  const urlEntries = pages
    .map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
