// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // WRANGLER_CONFIG lets a single build target a specific wrangler config
    // (e.g. the separate `wrangler.si.jsonc` instance). Unset -> default wrangler.jsonc.
    cloudflare({ viteEnvironment: { name: "ssr" }, configPath: process.env.WRANGLER_CONFIG }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
