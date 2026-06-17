# Painting-Inspired Theme Generation Rubric

This rubric defines how image-to-ui theme generation should borrow color from paintings without reducing the result to order-based token assignment. The goal is to preserve the painting's color character while producing UI tokens that render the existing component library coherently.

## Target References

The following three-color sets represent the calmer, more coherent direction discussed during planning:

- `#a1a8ae`, `#09568c`, `#eaebef`
- `#3472a1`, `#cddadb`, `#faf8f0`
- `#faf8f0`, `#09568c`, `#9e9982`

They work because the light colors become spacious surfaces, the deeper blues stay available for actions and focus, and the gray or warm-neutral colors support borders, muted surfaces, and weak emphasis.

## Role Assignment

Selected colors should be classified by color properties before generating tokens. Input order is only a hint, not the final semantic mapping.

- `background`, `card`, and `muted` should come from the lightest, lowest-saturation, or most surface-like painting colors.
- `primary` and `ring` should come from the most action-ready color: usually the color with the strongest usable contrast against the chosen surfaces, not necessarily the first selected color.
- `secondary`, `accent`, `border`, and `input` should come from mid-tone, neutral, or supporting colors that can create hierarchy without competing with `primary`.
- `foreground` should prefer a deep color related to the palette, such as a shaded primary or dark neutral, instead of defaulting directly to pure black or pure white.

## Allowed Derivations

Theme generation may derive UI-safe token values from the selected painting colors when the derivation preserves the palette relationship:

- Tinting with white for surfaces, muted areas, inputs, and subtle borders.
- Shading with black for foregrounds, dark mode backgrounds, and dark mode surfaces.
- Controlled desaturation for borders, muted surfaces, and weak emphasis.
- Contrast-safe foreground adjustments when raw painting colors would fail readability.
- Light and dark mode variants derived from the same palette relationships, not simple inversion.

Generated themes should not introduce an unrelated new brand color. If a new value is needed for UI safety, it should be visibly traceable to one of the selected painting colors.

## Drift Boundaries

A generated theme has drifted away from the painting if it:

- Introduces a dominant hue that is not traceable to the selected painting colors.
- Forces every palette into the same generic blue-gray SaaS look.
- Uses `primary` for too many large surfaces, causing actions to lose emphasis.
- Creates muddy backgrounds by averaging unrelated warm and cool colors without checking surface quality.
- Treats black and white as the only valid text colors when a palette-related foreground would work.
- Lets extraction or selection order override stronger evidence from luminance, saturation, and contrast.

## Review Checklist

Use this checklist when evaluating generated themes:

- The theme still feels like it came from the painting palette.
- Surfaces form a calm hierarchy across `background`, `card`, `popover`, `muted`, `border`, and `input`.
- `primary` is visually distinct and reserved for actions, links, focus, and high-emphasis states.
- Text colors are readable and feel related to the palette.
- Light and dark modes feel like siblings from the same painting, not unrelated themes.
- The component library renders coherently without relying on per-component hardcoded colors.
