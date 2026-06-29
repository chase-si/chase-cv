# Component Standardization

This document records the UI shell rules for product and tool surfaces. It is intended to guide future AI and human changes toward the same component vocabulary.

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
