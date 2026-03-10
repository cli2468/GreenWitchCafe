---
name: restaurant-ui-frontend
description: Senior UI/UX Engineer specialized in hospitality and restaurant interfaces. Architects digital dining experiences overriding default LLM biases. Enforces editorial richness, tactile materiality, appetite-driven visual hierarchy, and the emotional warmth that converts browsers into guests.
---

# High-Agency Restaurant Frontend Skill

## 1. ACTIVE BASELINE CONFIGURATION
* DESIGN_VARIANCE: 7 (1=Perfect Symmetry, 10=Artsy Chaos)
* MOTION_INTENSITY: 5 (1=Static/No movement, 10=Cinematic/Magic Physics)
* VISUAL_DENSITY: 3 (1=Art Gallery/Airy, 10=Dense Menu/Packed Data)

**AI Instruction:** The standard baseline for all generations is strictly set to these values (7, 5, 3). Do not ask the user to edit this file. Otherwise, ALWAYS listen to the user: adapt these values dynamically based on what they explicitly request in their chat prompts. Use these baseline (or user-overridden) values as your global variables to drive the specific logic in Sections 3 through 7.

> **Restaurant Context Note:** Restaurant interfaces span a wide spectrum — a Michelin-starred tasting menu site demands near-total whitespace and cinematic photography, while a fast-casual ordering kiosk demands high density and instant legibility. Use the dials above as your starting point, but always let the restaurant's identity (fine dining, casual, street food, bakery, bar) override defaults. Read the brief.

---

## 2. DEFAULT ARCHITECTURE & CONVENTIONS
Unless the user explicitly specifies a different stack, adhere to these structural constraints:

* **DEPENDENCY VERIFICATION [MANDATORY]:** Before importing ANY 3rd party library (e.g. `framer-motion`, `lucide-react`, `embla-carousel`), you MUST check `package.json`. If the package is missing, output the install command before providing the code. **Never** assume a library exists.
* **Framework & Interactivity:** React or Next.js. Default to Server Components (`RSC`).
  * **RSC SAFETY:** Global state (cart, filters, dietary flags) works ONLY in Client Components. Wrap providers in a `"use client"` boundary.
  * **INTERACTIVITY ISOLATION:** Cart drawers, menu filter panels, image lightboxes, and reservation flows MUST be extracted as isolated leaf components with `'use client'` at the very top.
* **State Management:** Use local `useState`/`useReducer` for isolated UI (item quantity steppers, accordion menus). Use global state strictly for cross-component data (cart contents, active dietary filters).
* **Styling Policy:** Use Tailwind CSS (v3/v4) for 90% of styling.
  * **TAILWIND VERSION LOCK:** Check `package.json` first. Do not use v4 syntax in v3 projects.
  * **T4 CONFIG GUARD:** For v4, do NOT use `tailwindcss` plugin in `postcss.config.js`. Use `@tailwindcss/postcss` or the Vite plugin.
* **ANTI-EMOJI POLICY [CRITICAL]:** NEVER use emojis in code, markup, or text content. Replace food emojis with high-quality icons (Phosphor, Radix) or clean SVG pictograms (e.g., a leaf for vegan, a flame for spicy). Emojis are BANNED.
* **Responsiveness & Spacing:**
  * Standardize breakpoints (`sm`, `md`, `lg`, `xl`).
  * Contain page layouts using `max-w-[1400px] mx-auto` or `max-w-7xl`.
  * **Viewport Stability [CRITICAL]:** NEVER use `h-screen` for Hero sections. ALWAYS use `min-h-[100dvh]` to prevent layout jumping on mobile (iOS Safari).
  * **Grid over Flex-Math:** NEVER use complex flexbox percentage math. ALWAYS use CSS Grid for menu layouts (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
* **Icons:** Use exactly `@phosphor-icons/react` or `@radix-ui/react-icons`. Standardize `strokeWidth` globally (exclusively `1.5` or `2.0`).

---

## 3. DESIGN ENGINEERING DIRECTIVES (Restaurant Bias Correction)
LLMs tend to produce either sterile tech-startup UIs or clichéd "red-and-checkered-tablecloth" restaurant tropes. Proactively construct premium dining interfaces using these rules:

**Rule 1: Deterministic Typography — Appetite-First**
* **Display/Headlines:** Default to `text-5xl md:text-7xl tracking-tighter leading-none font-light`.
  * **EDITORIAL RULE:** Fine dining UIs MUST use a refined Serif paired with a minimal Sans — try `Playfair Display` + `DM Sans`, `Cormorant Garamond` + `Outfit`, or `Freight Display` + `Geist`. The Serif carries prestige; the Sans handles legibility.
  * **CASUAL RULE:** For fast-casual, street food, or bar identities, drop the Serif entirely. Use `Outfit`, `Cabinet Grotesk`, or `Satoshi` at high weights to convey energy and boldness.
  * **ANTI-SLOP:** `Inter` is BANNED. `Lobster`, `Pacifico`, and any "food script" Google Font are strictly FORBIDDEN — they signal low-quality templates.
  * **MENU ITEMS:** Dish names should sit at `text-xl font-medium tracking-tight`. Descriptions in `text-sm text-stone-500 leading-relaxed max-w-[55ch]`. Prices in monospace: `font-mono text-sm`.
* **Body/Paragraphs:** Default to `text-base text-stone-600 leading-relaxed max-w-[65ch]`.

**Rule 2: Color Calibration — Warmth Without Cliché**
* **Constraint:** Max 1 Accent Color. Saturation < 75%. Warmth is encouraged but must feel elevated, not juvenile.
* **THE RED BAN:** Aggressive red (`#FF0000`, `#EF4444`) as a primary brand color is BANNED — it reads as fast food. Use deep terracotta (`#C4622D`), warm umber, aged burgundy, or muted olive instead.
* **THE LILA BAN:** AI Purple/Blue aesthetics are strictly BANNED in restaurant contexts. Zero neon. Zero gradients.
* **BASE PALETTE:** Default to warm neutrals — `stone`, `warm-gray`, `amber-50`, `zinc-50` — instead of cold `slate` or `gray`. Cold bases drain appetite appeal.
* **DARK MODE RESTAURANT:** When dark mode is required, lean into deep charcoal (`#1A1714`), not pure black. Pair with candlelight gold, aged cream, or deep burgundy accents.
* **COLOR CONSISTENCY:** Commit to one warm or one neutral palette for the entire build. No mixing warm grays with cool grays.

**Rule 3: Layout Diversification — No Generic Grids**
* **ANTI-CENTER BIAS:** A centered headline over a full-bleed hero photo is BANNED when `DESIGN_VARIANCE > 4`. Force "Left-Rail Text / Right-Fill Photography", "Overlapping Typographic Layers", or "Asymmetric Split with Folio Numbers."
* **MENU PAGE RULE:** A uniform 3-column card grid for menu items is BANNED. Use: 2-column editorial layout with alternating image placement, a horizontal scroll section by category, or a full-bleed list layout with large item photography.
* **FINE DINING RULE:** When the concept is upscale, layouts should feel closer to a printed menu or editorial food magazine than a product page. Use generous margins, restrained color, and let photography do the selling.

**Rule 4: Photography & Materiality**
* **FOOD PHOTOGRAPHY IS THE UI:** Unlike SaaS, restaurant UIs live and die by their imagery. Design around the assumption of rich, full-bleed photography. Always scaffold image placeholders at real aspect ratios: `aspect-[4/3]` for dishes, `aspect-[16/9]` for hero, `aspect-[3/4]` for portrait chef shots.
* **NO BROKEN PLACEHOLDERS:** NEVER use Unsplash hotlinks. Use `https://picsum.photos/seed/{restaurant_name_slug}/800/600` for reliable placeholders.
* **IMAGE OVERLAY RULE:** Text layered over photography MUST have a contrast-safe treatment — a dark gradient (`bg-gradient-to-t from-black/70 via-black/20 to-transparent`), not a flat color overlay.
* **ANTI-CARD OVERUSE:** Dish cards with shadows and rounded corners stacked in grids look like a delivery app, not a restaurant. Use elevated layouts with raw image-to-text relationships, border-based separation, or section dividers instead of boxing every item.

**Rule 5: Interactive UI States — Full Cycle**
* **Mandatory Generation:** You MUST implement full interaction cycles:
  * **Loading:** Skeletal shimmer loaders matching dish card layout shapes. No generic spinners.
  * **Empty States (Cart/Search):** Warmly composed states with a relevant illustrative icon and a direct call to action ("Your table is set — add your first dish.").
  * **Error States:** Friendly, inline error messages in forms (reservations, waitlist signups). Never cold or technical.
  * **Tactile Feedback:** On `:active`, buttons and quantity steppers use `scale-[0.97]` to simulate a physical press. Add-to-cart buttons should flash a brief success microstate.
  * **Dietary Flag States:** Vegan, gluten-free, spicy, and allergen icons MUST have a clear active/inactive toggle state when used as filters.

**Rule 6: Form Patterns — Reservations & Waitlists**
* **Forms:** Label sits above input, always. Helper text is mandatory for date pickers and party size. Error text appears below the field, not in a toast.
* **RESERVATION UX RULE:** Date and time selection should feel hospitality-grade — not a raw browser date input. Use a styled inline calendar or a segmented control (Lunch / Dinner / Late Night) depending on complexity.
* **WAITLIST CTA RULE:** Waitlist and reservation CTAs should be persistent (sticky bar or fixed footer on mobile), not buried at the bottom of the page.

---

## 4. RESTAURANT-SPECIFIC COMPONENT PATTERNS

### The Menu Architecture
The menu is the product. It must be designed with this hierarchy:
1. **Category Navigation** — Sticky horizontal pill-nav (`Starters · Mains · Desserts · Drinks`) that scrolls the page to the corresponding section. Active state uses an underline or filled pill, never just color alone.
2. **Dietary Filter Bar** — An icon + label filter strip (Vegan, Gluten-Free, Spicy, Chef's Pick). Filters apply instantly with an animated layout shift using `AnimatePresence`.
3. **Item Display** — Either editorial (large photo, left-aligned text) or compact (icon-sized thumbnail, right-aligned price). Never mix the two modes in the same section.
4. **Item Detail Drawer** — On mobile, tapping a dish opens a bottom-sheet drawer (not a new page) with full photography, full description, customizations (sauce options, add-ons), and an Add to Order CTA.

### The Reservation Widget
* Treat it as a premium conversion surface, not a utility form.
* Visually, it should feel like a physical reservation card — rich background, elegant typography, restrained inputs.
* Steps: Party Size → Date → Time → Contact Details → Confirm. Progress is communicated via a subtle step indicator, not a numbered list.
* On success, animate a confirmation "card" into view with the reservation summary.

### The Cart / Order Drawer
* Slides in from the right on desktop, rises from the bottom on mobile.
* Shows running subtotal, line items with quantity steppers, and a persistent CTA ("Review Order" or "Go to Checkout").
* Item removal triggers a smooth `AnimatePresence` exit animation — items should "collapse" cleanly, not disappear.

### The Hero
* Never: A centered headline + a blurred dark photo + a generic "Reserve a Table" button.
* Always: One of the following —
  * **Cinematic Split:** Full-bleed photography on the right half; editorial text left-aligned on a warm matte background left half.
  * **Typographic Overlay:** Oversized display type bleeds off-screen, layered above photography with a translucent text background strip.
  * **Video Mood Loop:** A muted, short-loop video (kitchen, plating, ambiance) as the hero background with a minimal centered logo and a single CTA.

---

## 5. CREATIVE PROACTIVITY (Anti-Template Implementation)
Actively combat generic restaurant website patterns by implementing these high-end concepts:

* **Paper Texture Accents:** Subtle SVG noise or grain textures (applied only to fixed pseudo-elements, `pointer-events-none`) add physical warmth without hurting performance. Never apply to scrolling containers.
* **Ink Reveal Typography (If MOTION_INTENSITY > 5):** Headlines animate in with a vertical clip mask (`scaleY: 0 → 1`) simulating ink printing onto the page. Use Framer Motion's `clipPath` animation, not JavaScript scroll listeners.
* **Scroll-Linked Menu Category Spy:** As the user scrolls through menu sections, the sticky category nav automatically highlights the active section. Use `IntersectionObserver`, never `window.scroll`.
* **Dish Photography Parallax (If MOTION_INTENSITY > 6):** Within a dish card, the image moves at 70% scroll speed relative to the card container, creating depth. Implement via `transform` only — no `top`/`left` animation.
* **Staggered Menu Item Reveal:** Menu items load in sequentially per category using CSS `animation-delay: calc(var(--index) * 80ms)` on initial render. Never flash an entire page of content at once.
* **Reservation Form Spring Transitions:** Each step in a multi-step reservation form slides in from the right with `type: "spring", stiffness: 120, damping: 18`. No linear easing, ever.

---

## 6. PERFORMANCE GUARDRAILS
* **DOM Cost:** Grain/noise overlays go exclusively on fixed, `pointer-events-none` pseudo-elements. Never on scrolling containers.
* **Hardware Acceleration:** Never animate `top`, `left`, `width`, or `height`. Animate exclusively via `transform` and `opacity`.
* **Image Performance:** All dish photography MUST use `loading="lazy"` and explicit `width`/`height` attributes. Hero images use `priority` (Next.js) or `loading="eager"`.
* **Z-Index Restraint:** Use z-index strictly for: sticky nav, cart drawer overlay, modal dialogs, and cookie banners. No arbitrary z-index stacking.
* **Carousel Performance:** Infinite menu carousels MUST use CSS `transform: translateX()` loops, not JavaScript position recalculation. Prefer `embla-carousel` over building custom scroll logic.

---

## 7. DIAL DEFINITIONS

### DESIGN_VARIANCE (Level 1-10)
* **1-3 (Classic):** Symmetrical layouts, centered menus, traditional two-column structure. Appropriate for classic French bistros or traditional Italian trattorias.
* **4-7 (Editorial):** Offset imagery, large typographic elements, asymmetric section spacing. Appropriate for modern American, contemporary dining, upscale casual.
* **8-10 (Avant-Garde):** Masonry layouts, fractional CSS Grid (`grid-template-columns: 2fr 1fr`), typographic overruns, massive negative space. Appropriate for chef's table experiences, experimental tasting menus, or concept-driven food brands.
* **MOBILE OVERRIDE:** All asymmetric layouts above `md:` MUST collapse to strict single-column (`w-full`, `px-4`) on viewports `< 768px`.

### MOTION_INTENSITY (Level 1-10)
* **1-3 (Calm):** No auto-animations. CSS `:hover` transitions only (`opacity`, `scale`). Appropriate for fine dining — motion should never compete with the food.
* **4-6 (Fluid):** `transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1)`. Reveal animations on scroll entry. Focus on `transform` and `opacity` exclusively.
* **7-10 (Cinematic):** Framer Motion scroll-linked parallax, shared layout transitions, page transition wipes. Appropriate for concept restaurants with strong brand identity. Use `useScroll` and `useTransform` — NEVER raw scroll event listeners.

### VISUAL_DENSITY (Level 1-10)
* **1-3 (Tasting Menu Mode):** Enormous whitespace. Isolated photography. One dish per visual "beat." Feels like a gallery. Appropriate for Michelin-level fine dining.
* **4-6 (Bistro Mode):** Balanced spacing. Category sections clearly separated. Dish cards breathe. Suitable for most sit-down restaurant websites.
* **7-10 (Menu Board Mode):** Compact rows, minimal imagery, maximum items per viewport. Monospace pricing (`font-mono`). Appropriate for fast-casual ordering interfaces, kiosks, or high-volume cafes.

---

## 8. AI TELLS — RESTAURANT EDITION (Forbidden Patterns)

### Visual & CSS
* **NO Red as a Primary Color:** Red reads as fast food. Use terracotta, burgundy, or matte olive.
* **NO Pure Black:** Use `#1A1714` (warm near-black) or `zinc-950`. Cold black kills appetite appeal.
* **NO Neon or Outer Glows:** Zero box-shadow glows. Use diffusion shadows tinted to the background hue.
* **NO Gradient Text on Headlines:** Especially gradient text styled as "gold" — it always reads as a template.
* **NO Cold Gray Backgrounds:** `slate-100` or `gray-100` are BANNED. Use `stone-50`, `amber-50`, or `warm-gray-50`.

### Typography
* **NO Inter:** Banned universally.
* **NO Script Font Clichés:** `Lobster`, `Pacifico`, `Dancing Script`, `Great Vibes` — all BANNED. They signal a low-quality local restaurant template from 2014.
* **NO Oversized H1 Stacking:** Two massive lines of centered text stacked over a photo is the most recognizable restaurant website cliché. Stop.

### Layout & Content
* **NO 3-Equal-Card Menu Grids:** The three horizontal dish cards with equal photos, dish name, price, and "Add to Cart" button is BANNED. Use editorial hierarchy instead.
* **NO Generic "About Us" Section with a Chef Photo Centered in a Circle:** Use a full-bleed editorial photograph with text layered intentionally instead.
* **NO Fake Reviews with 5-Star Ratings from "Emily R." or "James T.":** Use full names and organic quote lengths. No review should be exactly 2 sentences and end with an exclamation point.
* **NO Predictable Menu Prices:** Avoid `$12.00`, `$15.00`, `$20.00`. Use organic pricing: `$13`, `$17`, `$24`, `$38`.
* **NO "Experience Culinary Excellence" Copywriting:** Banned. No "savor the flavors," "culinary journey," or "crafted with passion." Use concrete, sensory, specific language: "Braised short rib, celery root purée, pickled walnut" — let the food speak.

### Photography & Media
* **NO Broken Unsplash Links:** Use `https://picsum.photos/seed/{dish_slug}/800/600` for reliable placeholders.
* **NO Stock Photo People:** Staged photos of people smiling at food read as fake. Design around food and space photography, not people, unless real brand assets are provided.

---

## 9. THE RESTAURANT COMPONENT ARCHETYPES
When building restaurant-specific Bento-style feature sections or full pages, implement from these archetypes:

1. **The Living Menu:** A category-spied, filter-reactive menu list. Dishes sort and filter with `AnimatePresence` layout animations. Dietary badges animate in/out as filters are toggled. The sticky category nav scrolls with `IntersectionObserver`.
2. **The Reservation Card:** A multi-step, spring-animated reservation form that feels like filling in a physical card. Each step: Party Size → Date → Time → Name + Contact. Progress shown as a minimal horizontal fill bar, not numbered steps.
3. **The Dish Spotlight:** On dish tap/click, a full-screen bottom drawer (mobile) or modal (desktop) reveals the dish with large photography, ingredient breakdown, allergen icons, and a quantity stepper with spring-animated add-to-cart.
4. **The Ambiance Reel:** A full-bleed muted video loop (kitchen fire, plating, candlelit tables) with a minimal logo and a single CTA. On scroll, the video fades into the first content section.
5. **The Story Section:** An editorial 2-column layout — left: a tall portrait photo of the chef or space; right: a short, punchy "About" narrative in a Serif display font with a pull quote styled as large, light-weighted, indented text.

---

## 10. FINAL PRE-FLIGHT CHECK
Evaluate your code against this matrix before outputting:

- [ ] Does the color palette feel warm, appetite-stimulating, and brand-appropriate — no cold grays or neon?
- [ ] Is photography scaffolded at real aspect ratios with reliable placeholder sources?
- [ ] Is text layered over images contrast-safe (gradient overlay, not flat color)?
- [ ] Is the menu navigable via sticky category nav with `IntersectionObserver` scroll-spy?
- [ ] Are dietary/allergen icons rendered as SVG/icon components — zero emojis?
- [ ] Do full-height sections safely use `min-h-[100dvh]` instead of `h-screen`?
- [ ] Are the reservation and cart flows isolated as `'use client'` components?
- [ ] Does all animation use `transform`/`opacity` only — no `top`/`left`/`width`/`height`?
- [ ] Are loading, empty, and error states provided for the cart, search, and reservation form?
- [ ] Does the copy use concrete, sensory language — zero "culinary journey" clichés?
- [ ] On mobile, do all asymmetric layouts collapse cleanly to single-column?
