---
// src/pages/hreflang.xml.ts
// Generates a proper hreflang sitemap (separate from the regular sitemap).
// Submit this to Google Search Console alongside your main sitemap.
//
// Access at: https://avantisfs.ca/hreflang.xml
// Format follows Google's recommended hreflang XML sitemap specification.

export const GET = () => {
  const SITE = 'https://avantisfs.ca';

  // All page pairs: [EN canonical URL, FR canonical URL, last modified date]
  const pages: [string, string, string][] = [
    [`${SITE}/`,                      `${SITE}/fr/`,                      '2025-01-01'],
    [`${SITE}/group-insurance/`,      `${SITE}/fr/assurance-collective/`, '2025-01-01'],
    [`${SITE}/other-services/`,       `${SITE}/fr/autres-services/`,      '2025-01-01'],
  ];

  // Build XML entries — Google requires every URL to list ALL alternates
  // including itself, its counterpart, and x-default
  const urlEntries = pages
    .flatMap(([en_url, fr_url, lastmod]) => [
      // EN page entry
      `  <url>
    <loc>${en_url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${en_url === `${SITE}/` ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA"    href="${en_url}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA"    href="${fr_url}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en_url}"/>
  </url>`,
      // FR page entry
      `  <url>
    <loc>${fr_url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${fr_url === `${SITE}/fr/` ? '0.9' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA"    href="${en_url}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA"    href="${fr_url}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en_url}"/>
  </url>`,
    ])
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
