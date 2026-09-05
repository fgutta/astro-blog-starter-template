---
// src/pages/hreflang.xml.ts
// Generates a proper hreflang sitemap (separate from the regular sitemap).
// Submit this to Google Search Console alongside your main sitemap.
//
// Access at: https://avantisfs.ca/hreflang.xml
// Format follows Google's recommended hreflang XML sitemap specification.

import { getCollection } from 'astro:content';

// Force dynamic execution on Cloudflare edge
export const prerender = false;

// Define your localized fallback constants
const LOCALES = ['en', 'fr'];
const DEFAULT_LOCALE = 'en';

// Explicitly type the route using global namespaces to prevent import errors
export const GET = async (context: import('astro').APIContext) => {
  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://avantisfs.ca';

  // 1. Fetch your content entries
  const allEntries = await getCollection('blog');

  // 2. Group different slugs by a shared translation ID (e.g., entry.data.translationId)
  // If you don't use a custom frontmatter ID, this code falls back to using the file name slug
  const translationGroups: Record<string, Array<{ locale: string; urlPath: string }>> = {};

  for (const entry of allEntries) {
    // Determine the locale of this specific entry
    // (Assumes a folder structure like src/content/blog/en/hello.md or a frontmatter 'lang' property)
    const [localeSegment, ...slugParts] = entry.id.split('/');
    const entryLocale = LOCALES.includes(localeSegment) ? localeSegment : DEFAULT_LOCALE;
    
    // Fallback logic if you don't use a dedicated cross-language ID in frontmatter:
    // It strips out the language prefix to try matching identical filename paths
    const cleanId = slugParts.join('/') || entry.id;
    const translationId = entry.data?.translationId || cleanId;

    // Resolve what the true public URL route looks like for this item
    const pageSlug = entry.slug || entry.id.replace(`${entryLocale}/`, '');
    const urlPath = entryLocale === DEFAULT_LOCALE 
      ? `/blog/${pageSlug}/` 
      : `/${entryLocale}/blog/${pageSlug}/`;

    if (!translationGroups[translationId]) {
      translationGroups[translationId] = [];
    }

    translationGroups[translationId].push({
      locale: entryLocale,
      urlPath: `${siteUrl}${urlPath}`,
    });
  }

  // 3. Build XML layout
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://sitemaps.org" xmlns:xhtml="http://w3.org">\n`;

  // --- A. Base System (Main Pages Routing) ---
  xml += `  <url>\n`;
  xml += `    <loc>${siteUrl}/</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />\n`;
  for (const locale of LOCALES) {
    xml += `    <xhtml:link rel="alternate" hreflang="${locale}" href="${siteUrl}/${locale}/" />\n`;
  }
  xml += `  </url>\n`;

  // --- B. Dynamic System (Unmatched Slugs Mapping) ---
  for (const groupKey in translationGroups) {
    const alternates = translationGroups[groupKey];

    // Find the default locale URL fallback to act as x-default
    const defaultTranslation = alternates.find(alt => alt.locale === DEFAULT_LOCALE) || alternates[0];

    for (const current of alternates) {
      xml += `  <url>\n`;
      xml += `    <loc>${current.urlPath}</loc>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultTranslation.urlPath}" />\n`;

      // Reciprocally output every matched translation in this group
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
