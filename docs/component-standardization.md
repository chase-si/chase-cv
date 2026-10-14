# Component Standardization

This document records the UI shell rules for product and tool surfaces. It is intended to guide future AI and human changes toward the same component vocabulary.

## Tool Page Chrome

Product tools (`dudu-scanner`, `magic-cursor`, `image-to-ui`, `flow`) share page chrome, not a single column recipe. Wrap the interactive workspace in `ToolPageChrome` from `components/tool-page-chrome.tsx`. Do not copy a one-off `main` + `h1` shell.

Settled layout:

- **First viewport (lg and up):** the tool workspace (header + panes) must fit in `calc(100dvh - 4rem)` (`SiteNav` is `h-16`). Page-level scroll of the tool is a failure on desktop. Extra content scrolls inside cards via `CardScrollArea`.
- **Below lg:** the page may grow and scroll. Do not lock `100dvh` on small screens.
- **Width:** workspace content is `max-w-7xl` and centered. Do not reintroduce per-page `max-w-6xl` or full-bleed tool mains.
- **Header:** compact title (`text-2xl` / `sm:text-[1.65rem]`), one truncated subtitle line, optional actions row. Keep `py-1` so `Button` elevation is not clipped. Actions must stay `overflow-visible` — `overflow-x-auto` clips `shadow-xs`.
- **Step changes:** keep this header geometry stable (same chrome, locked height). Column counts may change. Do not remount a taller/shorter page header.
- **Columns:** 2-pane vs 3-pane may differ per tool. Do not force every tool into the same track list.
- **Inner scroll:** the left rail and the main canvas/preview scroll independently inside their own `Card` + `CardScrollArea`. Do not put one page-level scroller around all panes on lg.
- **Demo visuals:** do not stretch illustrations, cursor tiles, or how-to-play stages with `flex-1` / `h-full` to fill leftover viewport. Cap them with aspect ratio + `max-h-*` and `items-start` / `content-start`. Empty space below a capped demo is better than a deformed canvas.
- **SEO copy** under each tool route is `SeoIndexCopy` (`hidden`). It must stay out of the visual layout; do not try to fit it in the first viewport.
- **Exception:** `dudu-scanner` scan/result stays fullscreen (`fixed inset-0`) and may cover `SiteNav`. Config (and the other three tools) stay in `ToolPageChrome`.

```tsx
<ToolPageChrome title={title} description={subtitle} actions={<Button>…</Button>}>
  <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
    <aside className="min-h-0 lg:max-h-full">
      <Card className="flex min-h-0 flex-col overflow-hidden">
        <CardHeader className="shrink-0">…</CardHeader>
        <CardScrollArea className="min-h-0 flex-1">…</CardScrollArea>
      </Card>
    </aside>
    <section className="min-h-0 lg:max-h-full">{/* canvas / preview */}</section>
  </div>
</ToolPageChrome>
```

## Floor-plan workspace

`floor-plan` also uses `ToolPageChrome`, with a canvas-first mobile exception requested for this tool:

- Below `lg`, `MobileWorkspace` fits beneath `SiteNav` in the available visual viewport. A plan picker, mode controls, canvas, compact selection card and bottom actions replace the stacked desktop rail. Short screens keep the page heading accessible but visually hidden to give the canvas more space; short landscape screens use two columns.
- Selection alone never opens a modal. Properties, rooms, furniture and checks open only when requested. Closing a panel preserves the selected object; selecting another panel must not be overridden by that object.
- The mobile furniture panel is a compact size picker. Its entry is “选择尺寸” / “Choose size”; it contains the furniture name, units and predefined size choices. Entity badges, coordinates, rotation, deletion and position nudge controls stay out of this panel. Rotation and removal remain on the selection card, while position changes use canvas dragging.
- `MobileBottomSheet` uses Base UI Dialog for focus management and scroll locking, with `Card` + `CardScrollArea` and safe-area / keyboard height handling. On desktop, checks and PNG previews reuse the same surface as a centered dialog.
- Desktop keeps an independent scrolling context rail and a larger canvas. The toolbar contains modes and checks; plan changes, furniture and export live in the page header. Selected-object controls precede the collapsible recommendations, and detailed assessment is available from the summary or expanded rail section.
- Both sizes retain the same domain model and geometry. Pointer gestures support dragging and pinch zoom; cancelled gestures roll back the drag preview. Image export renders the full plan, independent of the current canvas zoom.

## Card Shells

Use `Card` for the outer shell of product/tool workspace regions:

- left, center, and right panes in editor-like layouts
- sidebars, toolbars, canvas shells, property panels, and preview panels
- dashboard/form sections that represent real product surfaces

Do not apply this rule to decorative homepage illustrations, fake wireframe details, or tiny custom controls unless they are being promoted into real product UI.

`Card` owns the standard visual shell:

- `rounded-2xl`
- border and semantic `bg-card`
- `shadow-md`
- `overflow-hidden` so inner content clips cleanly to the radius

Avoid repeating default `shadow-*` or radius classes at call sites. Only add a shadow/radius class when the component intentionally needs a different emphasis, such as a large marketing showcase card.

## Scroll Areas

When a card contains scrollable content, keep scrolling inside the card instead of on the card shell:

```tsx
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>
    <CardScrollArea className="max-h-112 pr-1">
      ...
    </CardScrollArea>
  </CardContent>
</Card>
```

This keeps the card radius intact and gives scrollbars a consistent thin, transparent-track appearance. Do not put `overflow-y-auto` directly on `Card` or on the rounded shell unless a third-party component requires it.

Specialized surfaces, such as flow canvases or rendered previews, should use `Card` as the outer shell and keep their domain-specific rendering inside the card.

## Buttons

Use `Button` from `components/ui/button` for ordinary actions. It provides the default button shape and elevation:

- `rounded-xl`
- `shadow-sm`
- standard focus, disabled, active, and icon handling

The `link` variant intentionally stays shadowless. Other variants may opt out with `shadow-none` only when the button is embedded in another control where elevation would look noisy.

Avoid repeating `shadow-sm` at call sites. Keep `hover:shadow-md` when the interaction is intentionally more tactile.

Use a raw `<button>` only for special cases such as palette swatches, fake preview navigation, compound list rows, or primitives that are not visually an app action.
