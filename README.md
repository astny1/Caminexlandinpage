# CAMINEX Landing Page

A modern, mobile‑responsive landing page for the CAMINEX expo with a video hero, animated reveals, gallery lightbox, exhibitors/visitors benefits, and contact/footer with official links.

## Tech Stack
- HTML/CSS/JS (no framework)
- Optional: serve via any static host/CDN (Cloudflare Pages, Netlify, Vercel, S3+CloudFront)

## Project Structure
```
E:/CAMINEX
├─ index.html            # Main page
├─ assets/
│  ├─ css/
│  │  └─ style.css      # Styles (variables, sections, footer, gallery, etc.)
│  ├─ js/
│  │  └─ main.js        # Navigation, hero video segment, gallery lightbox
│  └─ media/            # Images, logo, hero video (Caminex.mp4)
```

## Local Preview
1. Open `index.html` in your browser.
2. For best results, use a local server to avoid cross‑origin issues with video:
   - Python: `python -m http.server 8080`
   - Node: `npx serve` or `npx http-server`
3. Visit `http://localhost:8080`.

## Key Features
- Video hero with overlay and animated text.
- Smooth section reveals and responsive layout.
- Gallery grid with lightbox (keyboard, swipe/tap to close).
- Benefits sections for exhibitors and visitors.
- Accessible navigation (reduced motion fallback, focus states).
- Footer with official links (Facebook, LinkedIn, X, Instagram) and organiser info.

## How to Update Content
- Hero video/poster: replace files in `assets/media/`; update paths in `index.html` if filenames change.
- Gallery images: add/remove `<figure class="gallery-card">` in the Gallery section of `index.html` and place images in `assets/media/`.
- Links/CTAs: search for `eventregister.online` or `caminex.org` in `index.html` and edit as needed.
- Logo: replace `assets/media/logo.png` (or `logo1.png` for organiser) with your assets.

## Deployment (Recommended)
- Use an immutable static host (Cloudflare Pages, Netlify, Vercel) to prevent direct edits on the server.
- Set the project root to the repository root; build command is not required.
- Enable automatic deploys from the `main` branch; keep previous versions for instant rollback.

## Security Hardening (Summary)
- Force HTTPS + HSTS (12 months) at the CDN.
- Security headers (at CDN or server):
  - `Content-Security-Policy` (self + trusted CDNs; no inline scripts where possible)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` to disable unnecessary APIs
  - `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`)
- Lock down deploys: protected `main`, reviews required, MFA on accounts, rotate tokens.
- Lightbox is dynamically created and hidden by default; no hidden overlays remain in DOM when closed.

## Accessibility & Performance
- Uses readable contrast, focus styles, reduced motion fallback.
- Images use `loading="lazy"`; gallery thumbs are optimized.
- Keep hero video short/optimized (muted, `playsinline`, `poster` fallback).

## Troubleshooting
- Hero video not playing on mobile: ensure the file is H.264/AAC, under autoplay policies (muted), and served over HTTPS.
- “Black strip” at bottom: confirmed hidden overlays are disabled; ensure you hard refresh or clear cache.
- Lightbox not opening: check browser console; confirm images exist in `assets/media/` and paths are correct.

## License
Content and branding belong to CAMINEX/CACSS. The landing page source can be adapted internally for CAMINEX promotional use.
