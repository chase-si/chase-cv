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

The floor-plan product helps a user compare predefined furniture specifications inside a curated plan. Domain logic, types, and validators live under `lib/floor-plan/`; the target contract is documented in `docs/floor-plan-contract.md`.

**Floor plan**:
A scale-aware residential topology made from vertices, walls, ordered room boundaries, and wall-bound openings in real-world units.
_Avoid_: Placement scenario, canvas state

**Candidate plan**:
A newly collected floor plan awaiting basic data validation and human visual review before it joins the catalog.
_Avoid_: Standard plan, imported image

**Standard plan**:
A curated, read-only floor plan available for furniture placement.
_Avoid_: Candidate plan, placement scenario

**Room boundary**:
An ordered, closed cycle of walls enclosing one room.
_Avoid_: Unordered wall IDs

**Opening**:
A door or window attached to one wall by a relative position and real-world width.
_Avoid_: Free-positioned door, free-positioned window

**Furniture definition**:
A generic furniture kind, such as a double bed or three-seat sofa, offered by the built-in catalog.
_Avoid_: Product, SKU, furniture placement

**Furniture specification**:
One predefined size option of a furniture definition, with its physical footprint and directional minimum and recommended clearances.
_Avoid_: Arbitrary resize, product variant, SKU

**Furniture placement**:
One selected furniture specification at a position and orientation inside a floor plan.
_Avoid_: Furniture definition, furniture specification

**Placement scenario**:
A standard plan together with the furniture placements currently being compared.
_Avoid_: Standard plan, furniture catalog

**Physical collision**:
An overlap between solid footprints, an overlap with a wall, or placement outside the room boundary.
_Avoid_: Clearance shortfall

**Directional clearance**:
The minimum and recommended free space measured from the front, back, left, or right side of a furniture placement, relative to its orientation.
_Avoid_: Whole-plan route finding, accessibility compliance

**Clearance shortfall**:
A directional clearance zone occupied by a wall, room boundary, or another furniture footprint. Clearance zones are not compared with other clearance zones.
_Avoid_: Physical collision

**Space assessment**:
The deterministic result for a placement scenario: suitable, trade-off, must adjust, or unavailable.
_Avoid_: Building-code approval, automatic layout
