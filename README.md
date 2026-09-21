# Mohammad Kaif Raza Ansari — Portfolio

A single-page portfolio: Home, About, Projects, Skills, Experience, Certifications, Education, and Contact — cream/almond palette, a 3D hero photo card you can tilt with the cursor, and hover-driven motion throughout.

Pure static site — no build step, no backend, no dependencies to install. Open it or deploy it as-is.

## What's in the box

```
kaif-ansari-portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js         ← nav, scroll-spy, reveal-toggle, project-card tilt
│   └── hero3d.js        ← the 3D hero photo card (Three.js, loaded as a module)
├── assets/
│   ├── profile.jpg
│   └── resume/
│       └── Kaif-Ansari-Resume.pdf
├── .nojekyll
└── README.md
```

## Two things to update before you publish

Search the project for `REPLACE` and you'll find both:

1. **Linktree link** — appears twice in `index.html` (the nav "Linktree" button, and the "All My Links" card in Contact). Swap in your real Linktree URL once that site is live.
2. That's it on this project — the platform links (Instagram, GitHub, LinkedIn) and the résumé are already wired to your real details.

## The 3D hero photo, and how it degrades

The photo in the hero section is rendered as a slightly-extruded 3D card via Three.js (`js/hero3d.js`), loaded from a CDN as an ES module — no install required. Move your cursor over it (or drag on touch) and it tilts to follow; left alone, it settles into a gentle idle sway.

This is built as **progressive enhancement**, on purpose:
- The plain photo (`<img class="hero-photo-img">`) is always in the page and visible by default.
- `hero3d.js` only swaps it out once Three.js has loaded, WebGL has initialized, and the photo texture has loaded successfully.
- If the CDN is unreachable, WebGL isn't supported, or anything else goes wrong, the script simply does nothing further — the plain photo (with its own hover gloss-sweep and gentle float animation) stays exactly as it would without the 3D layer.

So the page never depends on the 3D effect to look complete; it's a bonus layer on top of a page that already works without it.

## Local preview

No server needed — just open `index.html` in a browser. (If your browser blocks ES module imports over `file://`, which some do, run a quick local server instead: `python3 -m http.server 8000` from this folder, then open `http://localhost:8000`.)

## Publish it — pick one

### GitHub Pages
1. Push this folder to a new public repo.
2. Repo → **Settings → Pages** → Source: **Deploy from a branch**, Branch: **main**, folder **/ (root)** → Save.
3. Live in a minute or two at `https://<your-username>.github.io/<repo-name>/`.

### Netlify (fastest)
Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) — live immediately on a `*.netlify.app` URL.

### Vercel
Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new). Framework preset: **Other** (static, no build command).

All three are free and need zero configuration beyond what's above.

## Customizing

| To change… | Edit… |
|---|---|
| Copy (any section's text) | `index.html` — sections are clearly commented and in page order |
| Colors, spacing, fonts | `css/style.css` — variables at the top under `:root` |
| Which fields are hidden by default in Contact | `index.html` — the `data-reveal` spans; `data-value` holds the real value, the element's text holds the masked placeholder |
| 3D card tilt strength / speed | `js/hero3d.js` — `targetY`/`targetX` multipliers and the lerp speed in `animate()` |
| Project-card tilt strength | `js/main.js` — the `7` (degrees) in the tilt handler |

## Design notes

- Typography pairs **Fraunces** (display serif, headings) with **Manrope** (body) — Manrope is the same body face used on the Linktree page, so the two sites share a quiet thread even though the palettes differ (dark/emerald there, cream/almond here, as asked).
- The accent is a deep pine green + warm brass gold, not the more common cream-background/terracotta-accent pairing — chosen partly so this doesn't read as a template default, and partly so the pine green echoes the Linktree's emerald.
- Motion is layered but restrained: nav links get an animated underline sweep, project cards lift with a CSS 3D tilt and reveal an "Explore" cue, skill pills invert on hover, timeline cards nudge sideways, and the hero photo has both an idle sway and cursor-driven rotation (WebGL) at once.
- Every animation respects `prefers-reduced-motion`: the 3D card renders one static frame instead of a render loop, and all CSS transitions/animations are disabled.
- The email and phone number are masked by default and only rendered into the page on click (see `main.js`) — a lightweight way to keep them off a plain HTML scrape while still being one click away for a real visitor.

## License

Personal project — use and modify freely.
