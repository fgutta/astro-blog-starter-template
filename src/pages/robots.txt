---
// src/pages/robots.txt.ts
// Prevent pre-rendering on Cloudflare Edge
export const prerender = false;

export const GET = async (context) => {
  // Safe fallback if context.site is not populated in configuration
  const baseSite = context.site ? context.site.toString() : 'https://avantisfs.ca';
  const siteUrl = baseSite.replace(/\/$/, '');

  // Define standard robots instructions
  let robots = `User-agent: *\n`;
  robots += `Allow: /\n`;
  robots += `Disallow: /api/\n`; // Optional: Block internal edge API routes if any
  robots += `\n`;
  
  // Dynamically attach the absolute path to your language sitemap
  robots += `Sitemap: ${siteUrl}/sitemap.xml\n`;
robots += `Sitemap: ${siteUrl}/hreflang.xml\n`;


  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      // Cache at Cloudflare edge for 12 hours, browser for 1 hour
      'Cache-Control': 'public, max-age=3600, s-maxage=43200',
    },
  });
};
