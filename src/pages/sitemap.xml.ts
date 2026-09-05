---
// src/pages/sitemap.xml.ts
// Main XML sitemap — submit this as the primary sitemap in Google Search Console.
// Reference the hreflang sitemap as a secondary sitemap.
//
// Access at: https://avantisfs.ca/sitemap.xml

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  // Define your static or dynamic URLs here (e.g., fetch from a CMS or DB)
  const baseUrl = site ? site.toString().replace(/\/$/, '') : 'https://avantisfs.ca';
  
  const pages = [
    '',
    '/about',
    '/group-insurance',
    '/other-services',
    '/fr',
    '/fr/assrance-collective',
    '/fr/autres-services'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour on Cloudflare
    },
  });
};
