---
// src/pages/hreflang.xml.ts
// Generates a proper hreflang sitemap (separate from the regular sitemap).
// Submit this to Google Search Console alongside your main sitemap.
//
// Access at: https://avantisfs.ca/hreflang.xml
// Format follows Google's recommended hreflang XML sitemap specification.

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Force runtime rendering on Cloudflare Edge
export const prerender = false;

// Define your supported locales
const LOCALES = ['en-CA', 'fr-CA'];
const DEFAULT_LOCALE = 'en-CA';

export const GET: APIRoute = async (context) => {
  // Fallback to absolute site URL defined in astro.config
  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://avantisfs.ca';

  // 1. Collect your dynamic routes (e.g., from Content Collections)
  const blogEntries = await getCollection('blog');
  
  // 2. Identify distinct page slugs (assuming identical cross-locale slug paths)
  const uniqueSlugs = [...new Set(blogEntries.map((entry) => entry.id))];

  // 3. Build XML structure
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://sitemaps.org" xmlns:xhtml="http://w3.org">\n`;

  // --- A. Generate static main pages (e.g., home page) ---
  xml += `  <url>\n`;
  xml += `    <loc>${siteUrl}/</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />\n`;
  for (const locale of LOCALES) {
    xml += `    <xhtml:link rel="alternate" hreflang="${locale}" href="${siteUrl}/${locale}/" />\n`;
  }
  xml += `  </url>\n`;

  // --- B. Generate dynamic multi-language collection items ---
  for (const slug of uniqueSlugs) {
    for (const currentLocale of LOCALES) {
      // Determine page URL
      const currentUrl = currentLocale === DEFAULT_LOCALE 
        ? `${siteUrl}/blog/${slug}/` 
        : `${siteUrl}/${currentLocale}/blog/${slug}/`;

      xml += `  <url>\n`;
      xml += `    <loc>${currentUrl}</loc>\n`;
      
      // x-default maps to the fallback locale
      const defaultUrl = `${siteUrl}/blog/${slug}/`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />\n`;

      // Generate localized pairs for alternate tags
      for (const altLocale of LOCALES) {
        const altUrl = altLocale === DEFAULT_LOCALE 
          ? `${siteUrl}/blog/${slug}/` 
          : `${siteUrl}/${altLocale}/blog/${slug}/`;
          
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}" />\n`;
      }
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  // 4. Return XML payload optimized for Cloudflare CDN caching
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      // Cache response at the Cloudflare edge for 1 hour, browser for 10 min
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
};
