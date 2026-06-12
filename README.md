# Mibin Thomas - 3D Animated, SEO-Friendly Portfolio

A visually stunning, high‑performance, and fully accessible portfolio website built for **Mibin Thomas** (Performance Marketing & E‑Commerce Growth Specialist in the UAE).

---

## Tech Stack
* **Core Framework:** Next.js 14 (App Router)
* **3D Visualizations:** React Three Fiber (R3F) & Three.js
* **UI & Animations:** Tailwind CSS & Framer Motion
* **Utilities & CMS:** Lucide React, React Markdown, and gray‑matter
* **Fonts:** Inter & Outfit (hosted locally via Google Fonts API)

---

## Features

1. **Procedural 3D Canvas:** Contains a glowing 3D marketing growth graph and helix career path. Procedural rendering ensures zero model asset weight for high Lighthouse scores.
2. **Reduced Motion Adaptation:** Integrates media query hooks to detect `prefers-reduced-motion` settings or WebGL support limitations, fallback rendering beautifully optimized 2D SVGs.
3. **Hardware‑Accelerated Animations:** Utilizing CSS Y-axis perspectives for 3D card flips (Services) and GPU-bound mouse-tracking translate actions (Portfolio Parallax Tilt).
4. **Dynamic SSG Blog/Insights:** Statically parses Markdown files for optimal SEO. Features dynamic metadata generation (`generateMetadata` / `generateStaticParams`).
5. **Secure & Obfuscated Contact Elements:** Client-side hydration obfuscates email and phone parameters to prevent static scraper bot harvesting.

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx             # Root layout with fonts, canonical links, and global SEO meta
│   ├── page.tsx               # Primary scrollytelling single-page portfolio view
│   ├── blog/
│   │   ├── page.tsx           # SSR/SSG blog catalog list view
│   │   └── [slug]/
│   │       └── page.tsx       # Dynamic blog post details rendering markdown
│   └── globals.css            # Perspective, custom scrollbars, and selections
├── components/
│   ├── Navbar.tsx             # Sticky responsive navigation with focus states
│   ├── Hero.tsx               # Visual intro card containing R3F Canvas / SVG fallbacks
│   ├── About.tsx              # Scrollytelling container displaying career milestones
│   ├── Services.tsx           # Offerings layout with 3D Y-axis flips
│   ├── Portfolio.tsx          # Interactive project gallery with mouse parallax tilt
│   ├── Stats.tsx              # ROI statistics with intersection counter animations
│   ├── Contact.tsx            # Validated form with Dubai office SVG coordinates mapping
│   ├── Footer.tsx             # Social links and certification badge lists
│   ├── ThreeCanvas.tsx        # SSR‑safe lazy loading R3F canvas wrapper
│   ├── GrowthScene.tsx        # Scroll-linked R3F marketing curve representation
│   └── TimelineScene.tsx      # R3F spiral timeline cursor node controller
├── lib/
│   └── posts.ts               # Local file system parsing utility using gray‑matter
├── public/
│   └── content/
│       └── blog/              # Markdown article folder
└── tailwind.config.ts         # Dark base theme, emerald, and electric blue colors
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Compile Production Bundle
```bash
npm run build
```
This runs type-checking, lints code parameters, and exports statically optimized pages.

