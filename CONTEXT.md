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

## Floor-plan language

Floor-plan domain **logic, types, and validators** live under `lib/floor-plan/`; contract specifications in `docs/floor-plan-contract.md`.

**FloorPlan**:
The canonical, scale-aware topology shared by templates, user edits, and image importers. It describes vertices, walls, ordered room boundaries, wall-bound openings, and furniture in real-world units.
_Avoid_: Canvas state, CubiCasa result

**Standard plan**:
A curated, read-only FloorPlan that can be copied to start editing.
_Avoid_: User plan, draft

**User plan**:
An editable local copy of a standard plan whose committed changes are saved in the browser.
_Avoid_: Template, standard plan

**Room boundary**:
An ordered cycle of directed wall references that encloses one room.
_Avoid_: Unordered wall IDs

**Opening**:
A door or window attached to one wall by a center-position ratio and a real-world width. MVP openings do not model door leaves or swing direction.
_Avoid_: Free-positioned door, free-positioned window

**Furniture definition**:
A built-in furniture type containing default dimensions, allowed dimension ranges, and default clearance guidance. A user plan may override dimensions on each furniture instance.
_Avoid_: Furniture instance

**Local clearance**:
The immediately measurable free space around an opening or furniture item. It does not mean whole-plan route finding or accessibility compliance.
_Avoid_: Main circulation path, code compliance

**Recognition lab**:
A local, internal workflow that converts a source floor-plan image into a correctable FloorPlan without being part of the main editor release.
_Avoid_: Main editor, automatic floor-plan guarantee
