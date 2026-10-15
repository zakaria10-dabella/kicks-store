# KICKS — Sneaker Store

> An editorial sneaker e-commerce front-end for a concept store on Boulevard d’Anfa, Casablanca: real product photography, a filterable rack, a product page with hover zoom and a shared-element transition from the grid, a slide-over bag and a four-step checkout with cash on delivery.

![KICKS desktop screenshot](docs/screenshot.png)

<p align="center"><img src="docs/mobile.png" alt="KICKS on mobile" width="300" /></p>

Live demo: deploy on Vercel

## The redesign

The first version used illustrated SVG sneakers and a procedural Three.js shoe. This version is art-directed like a streetwear retailer (think Kith or END.): an off-white base, near-black type, one cobalt accent and big photography.

- **Real photography only.** Every product uses a real photograph from Wikimedia Commons (`public/photos/<id>.jpg`). Cards crop to a square around each photo's focal point; the product page also offers a full-frame view on a neutral tile and a close-up. Images are lazy-loaded with intrinsic sizes, so nothing shifts as they load. The hero is loaded eagerly with `fetchpriority="high"`.
- **Seven different section layouts on the home page:**
  1. A hero with oversized type layered over a full-bleed photo that scales with scroll, plus a floating "Just landed" card with its own parallax.
  2. An asymmetric photo bento for the four lines (Run Lab, Heritage, Court, Board).
  3. A pinned, scroll-driven horizontal gallery of new arrivals (swipeable with scroll snap on touch screens).
  4. The rack: a dense five-column grid with category tabs and sorting, using layout animations.
  5. A full-bleed dark band with an editorial quote from a Run Lab tester.
  6. A strip of big numbers for delivery and returns.
  7. A sticky split for the store: a photo pinned on the left while services and opening hours scroll past.
- **Product page.** A large photo with zoom on hover (the zoom follows the cursor), three photo views, an EU size grid with sold-out sizes struck through, an add-to-bag panel that stays in view on desktop, and an add-to-bag bar that appears on mobile once the main button scrolls away. The photo morphs from the grid card into the page through a shared framer-motion `layoutId`.
- **Bag and checkout.** A slide-over bag with quantity steppers and a free-delivery progress bar. The four-step checkout keeps Moroccan phone validation, cash, card-on-delivery and bank-transfer options, a live summary and a confirmation screen. The cart is saved in `localStorage`, and the add-to-bag photo flies into the bag icon.

## Design system

| Role | Value |
| --- | --- |
| Canvas | `#F1F0EC` off-white |
| Tile (image placeholder, summary) | `#E5E4E0` |
| Ink | `#121211` near-black |
| Secondary text | `#5E5C57` (5.9:1 on canvas) |
| Accent | Cobalt `#2F3CF5` (6.8:1 with white text); `#8E96FF` on dark grounds |

**Type.** [Archivo](https://fonts.google.com/specimen/Archivo) Variable, extra-bold, uppercase and narrowed slightly with the width axis (88%), with tight tracking for display text. [Geist](https://vercel.com/font) Variable for text, prices and UI. Both fonts are self-hosted through `@fontsource-variable`.

**Motion.** Subtle and purposeful: masked line reveals in the hero, parallax driven by `useScroll` and `useTransform`, staggered reveals on scroll, layout animations when filtering, and the shared-element transition from card to product. Scroll-linked transforms are turned off under `prefers-reduced-motion`, `MotionConfig reducedMotion="user"` covers everything else, and the add-to-bag flight is skipped.

**Accessibility.** Visible focus rings, 44px or larger touch targets, a skip link, labelled radio groups for sizes and views, a bag dialog that closes on Escape and returns focus when it closes, and text contrast of at least 4.5:1. Layouts are checked at 375, 768 and 1440px wide with no horizontal scroll.

## Tech stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

`vercel.json` rewrites all paths to `index.html`, so `/product/:id` and `/checkout` still work after a page refresh.

## Project structure

```
src/
├── components/
│   ├── Navbar.jsx        # announcement bar, category links, hide-on-scroll header, mobile menu
│   ├── CartDrawer.jsx    # slide-over bag with free-delivery progress
│   ├── ProductCard.jsx   # square photo tile, quick add by size, shared layoutId
│   ├── ProductImage.jsx  # one <img> for every product photo (cover / contain)
│   └── Footer.jsx        # links, newsletter, photo credits
├── context/
│   └── CartContext.jsx   # cart state, persistence, fly-to-bag layer
├── pages/
│   ├── Home.jsx          # hero, bento, horizontal gallery, rack, story band, stats, store
│   ├── Product.jsx       # zoom gallery, size grid, sticky add-to-bag, related pairs
│   └── Checkout.jsx      # stepper and confirmation
├── data/
│   ├── products.js       # 10 sneakers, prices in MAD, photo focal points
│   └── credits.js        # photo credits (mirrors public/photos/credits.json)
├── App.jsx
└── main.jsx
```

## Photo credits

All photographs come from Wikimedia Commons. The full list, with sources, is in [`public/photos/credits.json`](public/photos/credits.json) and in the footer of the site. The product names are fictional; the photos show real shoes from various brands and are used here for demonstration only.

| File | Author | Licence | Source |
| --- | --- | --- | --- |
| hero.jpg | Jacek Halicki | CC BY-SA 4.0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:2023_Adidas_Yeezy_350_V2_EF2905_(1).jpg) |
| run-lab.jpg | JSFarman | CC BY-SA 4.0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:Brooks_Adrenaline_GTS_18.jpg) |
| atlas-runner.jpg | Petar Milošević | CC BY-SA 4.0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:Asics_Gel-Cumulus_22.jpg) |
| medina-low.jpg | LeDroider | CC0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:New_Balance_574.jpg) |
| kasbah-hi.jpg | HI 622 | CC BY-SA 4.0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:Nike_air_Force_1_white_on_white.jpg) |
| corniche-sk8.jpg | Petar Milošević | CC BY-SA 4.0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:Reebok_Royal_Glide_Ripple_Clip_shoe.jpg) |
| sahara-trail.jpg | Petar Milošević | CC BY-SA 4.0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:Mizuno_Wave_Ibuki_2.jpg) |
| anfa-court.jpg | LeDroider | CC0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:New_Balance_480.jpg) |
| derb-dunk.jpg | Xanor | CC0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:Air_Force_1.JPG) |
| souk-slip.jpg | LeDroider | CC0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:New_Balance_2002R.jpg) |
| tempo-x.jpg | Petar Milošević | CC BY-SA 4.0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:Brooks_Ghost_14_GTX.jpg) |
| rabat-retro.jpg | LeDroider | CC0 | [Wikimedia](https://commons.wikimedia.org/wiki/File:New_Balance_1906R.jpg) |

## Author

**Zakaria Dabella**, UI/UX designer and web developer based in Casablanca, Morocco.

- Portfolio: [zakaria-dabella-portfolio.vercel.app](https://zakaria-dabella-portfolio.vercel.app/)
- GitHub: [@zakaria10-dabella](https://github.com/zakaria10-dabella)

## License

Code: [MIT](LICENSE) © 2026 Zakaria Dabella. Photographs: their own licences, listed above.
