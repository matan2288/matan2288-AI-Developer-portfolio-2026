# Design System & Aesthetic Contract
**Project:** Minimalist Engineering Portfolio & AI Digital Twin  
**Target Archetype:** High-contrast, ultra-clean, typographic architectural portfolio with subtle neutral greys, whisper borders, and calm spring animations.

---

## 1. Core Visual Philosophy
1. **True Neutral Palette:** Strictly pure, neutral greys with zero red, magenta, or pink undertones. Alternating sections oscillate cleanly between pure `#FFFFFF` and whisper grey `#F9FAFB`.
2. **Whisper-Soft Borders:** Hairline dividers (`#F0F2F5`) delineate sections without visual heaviness.
3. **Typographic Hierarchy (No Button Section Numbers):** Section indicators rely purely on typography (`01 / CAREER & ROLES`), never on button boxes, colored badges, or bordered number tags.
4. **Calm, Deliberate Interactions:** Micro-interactions use subtle spring physics or gentle breathing pulses (2.2s+), strictly rejecting aggressive pings, heavy shadows, or layout-jarring expansions.
5. **Controlled Whitespace:** Generous but disciplined section rhythm (`py-14 md:py-20`). Avoid artificial 100vh hero centering that leaves excessive empty voids.

---

## 2. Design Tokens & Color System

### Color Palette (Hex & CSS Variables)
| Token | Variable | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `--color-bg` | `#FFFFFF` | Primary section background |
| **Secondary Background** | `--color-bg-alt` | `#F9FAFB` | Alternating section background |
| **Surface** | `--color-surface` | `#FFFFFF` | Cards, modals, command inputs |
| **Border Normal** | `--color-border` | `#F0F2F5` | Default dividers, borders, tab lines |
| **Border Hover** | `--color-border-hover` | `#E2E5E9` | Interactive borders on hover |
| **Text Primary** | `--color-text` | `#0F172A` | Primary headings, titles, active labels |
| **Text Muted** | `--color-text-muted` | `#475569` | Body text, dates, secondary labels |
| **Text Subtle** | `--color-text-subtle` | `#64748B` | Footers, placeholders, meta tags |
| **Accent Primary** | `--color-accent` | `#0F172A` | High-contrast emphasis, active state |
| **Accent Soft** | `--color-accent-soft` | `#F5F6F8` | Hover fills, subtle chips |
| **Success** | `--color-success` | `#16A34A` | Online indicators, verified checks |

### Tailwind Color Mapping
```javascript
colors: {
  bg: '#FFFFFF',
  'bg-alt': '#F9FAFB',
  surface: '#FFFFFF',
  border: '#F0F2F5',
  'border-hover': '#E2E5E9',
  text: '#0F172A',
  'text-muted': '#475569',
  'text-subtle': '#64748B',
  accent: '#0F172A',
  'accent-hover': '#334155',
  'accent-soft': '#F5F6F8',
  'accent-muted': '#F0F2F5',
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#EEF0F3',
    300: '#E2E5E9',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  }
}
```

---

## 3. Typography & Text Hierarchy

**Primary Font Family:** `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`

### Structural Typography Hierarchy
- **Hero Title:** `text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text font-sans`
- **Section Headers:** `text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text leading-tight`
- **Section Sub-Labels:** `text-xs sm:text-sm text-text-muted font-normal`
- **Section Indicator:** `text-[11px] font-mono tracking-widest text-text-muted`  
  *Formatting Rule:* `<span className="font-semibold text-text">{num}</span> <span className="text-neutral-300">/</span> <span className="uppercase font-medium tracking-[0.16em]">{title}</span>`  
  *Negative Rule:* **NEVER** apply borders, background pills, or button styles to section numbers.
- **Card Titles:** `text-base sm:text-lg font-semibold text-text tracking-tight`
- **Body Copy:** `text-sm sm:text-base text-text leading-relaxed`

---

## 4. Layout, Spacing & Container Rhythm

### Standard Widths
- **Hero Container:** `max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 md:px-8`
- **Standard Sections:** `max-w-6xl mx-auto px-6 md:px-8`

### Vertical Section Rhythm
- **Hero Section:** `pt-20 sm:pt-24 pb-10 sm:pb-14 bg-white` (avoiding forced 100vh centering)
- **Standard Sections:** `py-14 md:py-20 border-t border-border` (alternating between `bg-white` and `bg-bg-alt`)
- **Header to Content Gap:** `mb-8 sm:mb-12`

---

## 5. Component Contracts

### 5.1 Buttons
- **Primary / White Card Button:**
  ```tsx
  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white hover:bg-neutral-50 text-text border border-border/80 hover:border-neutral-300 text-xs sm:text-sm font-medium rounded-xl shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
  ```
- **Ghost / Minimal Button:**
  ```tsx
  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-text-muted hover:text-text bg-transparent hover:bg-neutral-100/80 border border-transparent hover:border-border/60 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
  ```

### 5.2 Section Indicator (Typographic Standard)
```tsx
export const SectionLabel: React.FC<{ num: string; title: string }> = ({ num, title }) => (
  <div className="flex items-center gap-2 mb-2.5 select-none text-[11px] font-mono tracking-widest text-text-muted">
    <span className="font-semibold text-text">{num}</span>
    <span className="text-neutral-300 font-light">/</span>
    <span className="uppercase font-medium tracking-[0.16em] text-text-muted">{title}</span>
  </div>
);
```

### 5.3 AI Floating Widget
- **Launcher Button:**
  - Position: `fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50`
  - Sizing Stability Contract: Pinned footprint (`h-10 sm:h-11 min-w-[148px] sm:min-w-[156px] px-4 sm:px-5 rounded-full justify-center`) ensuring the button never shrinks or alters dimensions when transitioning between blinking/idle or open/closed states.
  - Normal State: `bg-white hover:bg-neutral-50 text-text border border-border/80 hover:border-neutral-300 rounded-full shadow-2xs hover:shadow-xs`
  - Minimalist Blinking State: Uses `animate-minimal-blink` (smooth, dim border pulse between `#E2E5E9` and `#94A3B8` with a subtle 3px soft slate whisper ring) and a muted pinging dot.
  - Lifecycle:
    1. Starts **OFF** on initial page load (no unprompted blinking).
    2. Activates **ONLY** after receiving the first response from the Section 1 inline chat (`AICommandBar`), assuming the floating widget has not yet been opened.
    3. Ceases blinking permanently once the user opens the floating chat for the first time, never reactivating upon closing or subsequent queries.
- **Chat Modal Transition:**
  ```tsx
  <motion.div
    initial={{ opacity: 0, scale: 0.92, y: 20, transformOrigin: 'bottom right' }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.93, y: 16, transition: { duration: 0.18, ease: 'easeInOut' } }}
    transition={{ type: 'spring', stiffness: 360, damping: 27, mass: 0.8 }}
    className="pointer-events-auto w-[calc(100vw-2.5rem)] sm:w-[380px] md:w-[400px] h-[520px] max-h-[80vh] bg-white border border-border/80 rounded-2xl shadow-xl flex flex-col overflow-hidden mb-3.5"
  />
  ```

### 5.4 AI In-Page Command Bar
- **Expansion Rule:**
  Wrap response in `<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">` so that the content smoothly glides into view without abruptly popping open or violently jarring the section divider below.
- **Internal Spacing:**
  Tight, balanced padding (`p-3.5 sm:p-4`) with compact typography (`text-xs sm:text-[13px]`) to avoid excessive whitespace footprints.

### 5.5 Social Icon Group & Back-to-Top
- Standard group featuring GitHub, LinkedIn, and Email icons (15px SVG) with `text-text-muted hover:text-text p-1.5 transition-colors`.
- Applied across the Hero section (Section 1 CTAs) and the Footer (coupled with hairline divider and smooth "Top" scroll button).

---

## 6. Anti-Patterns (Strictly Forbidden)
1. ❌ **Button-style section headers:** Never wrap `01`, `02`, `03` in boxed borders, filled pill backgrounds, or shadow boxes.
2. ❌ **Aggressive button blinking:** Never pulse buttons with scale jumps (`scale(1.05)`), pinging radar rings, or heavy drop shadows.
3. ❌ **Dark / Muddy Greys:** Never use greys with pinkish, yellowish, or purplish tints. Always use pure cool-neutral tones (`#F9FAFB`, `#F0F2F5`, `#E2E5E9`).
4. ❌ **Excessive Viewport Whitespace:** Never vertically center hero sections using `min-h-[calc(100vh-4rem)] flex items-center` if expanding content displaces subsequent sections.
5. ❌ **Unconstrained motion height:** Never mount expanding response containers without `height: 0` to `auto` transitions and `overflow-hidden`.
