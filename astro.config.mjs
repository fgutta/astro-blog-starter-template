// @ts-chec
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import cloudflare from '@astrojs/cloudflare';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://avantisfs.ca",
	integrations: [mdx(), sitemap()],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
