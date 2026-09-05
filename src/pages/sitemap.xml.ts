---
// src/pages/sitemap.xml.ts
// Main XML sitemap — submit this as the primary sitemap in Google Search Console.
// Reference the hreflang sitemap as a secondary sitemap.
//
// Access at: https://avantisfs.ca/sitemap.xml

import { getCollection } from 'astro:content';

// Prevent pre-rendering on Cloudflare Edge
export const prerender = false;

// Define your localized fallbacks
const LOCALES = ['en', 'fr'];
const DEFAULT_LOCALE = 'en';

export const GET = async (context) => {
  // Safe fallback if context.site is not populated in configuration
  const baseSite = context.site ? context.site.toString() : 'https://avantisfs.ca';
  const siteUrl = baseSite.replace(/\/$/, '');

  // 1. Fetch collection entries
  const allEntries = await getCollection('blog');

  // 2. Build the standard XML Sitemap layout
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://sitemaps.org">\n`;

  // --- A. Main Site Index Roots ---
  xml += `  <url>\n    <loc>${siteUrl}/</loc>\n  </url>\n`;
  for (const locale of LOCALES) {
    xml += `  <url>\n    <loc>${siteUrl}/${locale}/</loc>\n  </url>\n`;
  }

  // --- B. Asymmetrical Inner Post Mapping Paths ---
  for (const entry of allEntries) {
    // Isolate path parts to figure out locale segments
    const parts = entry.id.split('/');
    const localeSegment = parts[0];
    const entryLocale = LOCALES.includes(localeSegment) ? localeSegment : DEFAULT_LOCALE;

    // Build the unique slug string pathway
    const pageSlug = entry.slug || entry.id.replace(`${entryLocale}/`, '');
    const urlPath = entryLocale === DEFAULT_LOCALE 
      ? `/blog/${pageSlug}/` 
      : `/${entryLocale}/blog/${pageSlug}/`;

    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}${urlPath}</loc>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      // Cache at Cloudflare edge for 1 hour, browser for 10 min
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
};
