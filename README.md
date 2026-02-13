# Marketing Website

A sleek, minimal marketing website with full-screen video background and contact form.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your video:
   - Place your video file in the `public` folder as `video.mp4`
   - Recommended: Use a compressed, web-optimized video (H.264 codec, .mp4 format)
   - Suggested resolution: 1920x1080 or 1280x720
   - Keep file size under 10MB for best performance

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

- Edit brand name in `app/page.tsx` (line 32)
- Update metadata in `app/layout.tsx`
- Customize colors and styling using Tailwind classes
- Connect form submission to your backend/email service

## Deployment to GitHub Pages

1. Build the site:
```bash
npm run build
```

2. The static files will be in the `out` folder

3. Push to GitHub and enable GitHub Pages pointing to the `out` folder or use GitHub Actions
