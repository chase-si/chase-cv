# Site context

## Locale routing

Public tool routes live under `app/[locale]/…` and share **next-intl** messages, site navigation, sitemap entries, and metadata helpers in `lib/site.ts`.

| Path (default locale `en`) | Chinese (`zh`) | Indexed in sitemap |
| -------------------------- | -------------- | ------------------ |
| `/`                        | `/zh`          | yes                |
| `/magic-cursor`            | `/zh/magic-cursor` | yes            |
| `/image-to-ui`             | `/zh/image-to-ui`  | yes            |
| `/flow`                    | `/zh/flow`     | yes                |

**Decision (2026-06-19, issue #106):** Flow editor uses the same `[locale]` + `messages` pattern as image-to-ui and magic-cursor. The legacy standalone `app/flow` route was removed; `/flow` is served via `localePrefix: "as-needed"` for English and `/zh/flow` for Chinese.

**i18n scope for flow:** Navigation labels and page metadata are localized. Flow editor canvas/tooling copy may remain Chinese until a dedicated UI i18n slice.

## Flow domain code layout

Flow **logic** lives under `lib/flow/`; presentation tokens in `lib/flow/svg-presentation.ts`; React/SVG UI in `components/flow/`. See [README.md](./README.md#flow-domain-imports).
