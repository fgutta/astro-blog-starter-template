---
// src/pages/robots.txt.ts
export const GET = () => {
  const body = `User-agent: *
Allow: /

# Primary sitemap
Sitemap: https://avantisfs.ca/sitemap.xml

# Hreflang sitemap (bilingual alternate links)
Sitemap: https://avantisfs.ca/hreflang.xml

# Disallow Astro build artifacts
Disallow: /_astro/
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
