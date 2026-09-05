// src/env.d.ts
/// <reference types="astro/client" />

type Env = {
  // Define your Cloudflare bindings here
  MY_KV: KVNamespace; 
  MY_DB: D1Database;
};

// Properly map Cloudflare Runtime into Astro's Locals
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare global {
  namespace App {
    interface Locals extends Runtime {}
  }
}
