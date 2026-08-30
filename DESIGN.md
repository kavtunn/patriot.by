# Design System — Мир иначе

## Direction

**Editorial archive / museum documentary.** Soft ink dusk, quiet type, no SaaS dark-mode chrome.
Not SpaceX. Not purple gradients. Not card grids.

## Palette (3 hues)

| Role | Hex | Notes |
|------|-----|-------|
| Canvas | `#17191e` | Cool charcoal — never `#000` |
| Surface | `#22262d` | +5–7% lightness for depth |
| Elevated | `#2b3038` | Panels / sticky bars |
| Text | `#e8e6e1` | Soft off-white — never `#fff` |
| Body | `#aea9a1` | Readable secondary |
| Muted | `#7d7972` | Meta, captions |
| Accent | `#c4a574` | Quiet dusk brass (time / pivot) |
| History | `#a86b64` | Desaturated brick |
| Alternative | `#6a8f78` | Desaturated pine |
| Fact / Analysis / Hypothesis | `#7e96b5` / `#b59a5a` / `#7a9a92` | Soft on dark |

## Typography

- **Display + reading:** Literata
- **UI:** Onest
- No Inter / Barlow Condensed / decorative mono
- Titles: sentence case (Russian). No all-caps display.
- Eyebrows: Onest, small, tracked — sparingly

## Components

- Radius: `4px` everywhere (no pills)
- Cards: borderless first — space, then bg shift; hairline only if needed
- No shine sweeps, glow borders, or floating badges on hero
- Buttons: solid fill or quiet outline — no gradient fills

## Motion

- Reveal fade-up once
- Hero map: very slow drift only
- Respect `prefers-reduced-motion`
