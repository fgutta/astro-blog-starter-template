---
// src/pages/hreflang.xml.ts
// Generates a proper hreflang sitemap (separate from the regular sitemap).
// Submit this to Google Search Console alongside your main sitemap.
//
// Access at: https://avantisfs.ca/hreflang.xml
// Format follows Google's recommended hreflang XML sitemap specification.

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

  // 2. Map completely unmatched slugs using an object dictionary
  const translationGroups = {};

  for (const entry of allEntries) {
    // Isolate path parts to figure out locale segments
    const parts = entry.id.split('/');
    const localeSegment = parts[0];
    const entryLocale = LOCALES.includes(localeSegment) ? localeSegment : DEFAULT_LOCALE;
    
    // Group keys using either a custom frontmatter ID or the raw trailing path filename
    const cleanId = parts.slice(1).join('/') || entry.id;
    const translationId = entry.data && entry.data.translationId ? entry.data.translationId : cleanId;

    // Build unique slug string pathways
    const pageSlug = entry.slug || entry.id.replace(`${entryLocale}/`, '');
    const urlPath = entryLocale === DEFAULT_LOCALE 
      ? `/${pageSlug}/` 
      : `/${entryLocale}/${pageSlug}/`;

    if (!translationGroups[translationId]) {
      translationGroups[translationId] = [];
    }

    translationGroups[translationId].push({
      locale: entryLocale,
      urlPath: `${siteUrl}${urlPath}`,
    });
  }

  // 3. Construct XML structure
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://sitemaps.org" xmlns:xhtml="http://w3.org">\n`;

  // --- A. Direct Index Paths ---
  xml += `  <url>\n`;
  xml += `    <loc>${siteUrl}/</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />\n`;
  for (const locale of LOCALES) {
    xml += `    <xhtml:link rel="alternate" hreflang="${locale}" href="${siteUrl}/${locale}/" />\n`;
  }
  xml += `  </url>\n`;

  // --- B. Asymmetrical Inner Post Mapping Paths ---
  for (const groupKey in translationGroups) {
    const alternates = translationGroups[groupKey];

    // Identify standard x-default alternative
    const defaultTranslation = alternates.find(alt => alt.locale === DEFAULT_LOCALE) || alternates[0];

    for (const current of alternates) {
      xml += `  <url>\n`;
      xml += `    <loc>${current.urlPath}</loc>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultTranslation.urlPath}" />\n`;

      // Bidirectional matching loop pairs
      for (const alt of alternates) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${alt.urlPath}" />\n`;
      }
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
};
