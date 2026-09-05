---
// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const prerender = true; // 👈 Forces Astro to generate it statically at build time

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('User-agent: *\nAllow: /', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  const sitemapURL = new URL('sitemap.xml', site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain' }
  });
};
