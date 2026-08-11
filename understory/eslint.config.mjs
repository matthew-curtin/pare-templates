import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      /**
       * This template navigates with plain `<a>` on purpose, everywhere,
       * and the rule that objects is worth answering rather than
       * silencing at each call site.
       *
       * `next/link` client-routes, and a client route is not a document
       * navigation — which means the browser never runs a CROSS-DOCUMENT
       * VIEW TRANSITION, and that transition is the single most
       * elaborate thing this design does. Every tile carries a
       * `view-transition-name` keyed on its slug, so moving from one
       * week to the next makes each plant fly from its old cell to its
       * new one and the wall visibly re-packs. That is the site's whole
       * argument, animated, and it costs zero JavaScript: `@view-
       * transition { navigation: auto }` in the stylesheet and real
       * hrefs in the markup.
       *
       * The trade is real — a full document load per navigation rather
       * than a patched-in RSC payload — and it is the right one here.
       * All 52 week pages and all 58 plant pages are statically
       * pre-rendered, so a navigation is a cached HTML file, and the
       * transition covers the load. Swap this back to `<Link>` and the
       * template still works; it just cuts between states instead of
       * moving between them, and the reason for the architecture stops
       * being visible.
       */
      "@next/next/no-html-link-for-pages": "off",
    },
  },
]);

export default eslintConfig;
