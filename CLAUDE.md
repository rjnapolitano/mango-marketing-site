# Claude Instructions for Mango Marketing Site

## Pitch Page Generation

When the user says something like:
- "Create a pitch page for [BRAND] - [URL]"
- "Make a pitch for [BRAND]"
- "Research [BRAND] for a pitch"

### Do This Automatically:

1. **Research the brand** (use WebFetch on their website)
   - Products/services they offer
   - Target audience
   - Brand voice and positioning
   - Any existing creator/influencer partnerships

2. **Research 3-5 competitors** (use WebSearch)
   - Search: "[brand] competitors influencer marketing"
   - Search: "[competitor name] tiktok creator campaign"
   - Find stats: follower counts, engagement rates, campaign results
   - Document what's working for each competitor

3. **Create the pitch page**
   - Copy `/app/pitch-template/page.template.tsx` to `/app/[brand-slug]/page.tsx`
   - Copy `/app/pitch-template/layout.template.tsx` to `/app/[brand-slug]/layout.tsx`
   - Replace all `{{PLACEHOLDER}}` values with researched content
   - Create `/public/[brand-slug]/` folder for assets

4. **Get brand assets**
   - Download brand logo (SVG preferred, PNG fallback)
   - Download competitor logos
   - Save to `/public/[brand-slug]/`
   - Copy mango-logo.png from `/public/badia/mango-logo.png`

5. **Deploy**
   - Git add, commit, push
   - Password will be: `[brand-slug]2026!`

### Existing Pitch Pages
- `/badia` - Badia Spices pitch (password: badia2026!)

### Key Files
- `/app/pitch-template/` - Template files for new pitches
- `/PITCH_WORKFLOW.md` - Detailed workflow documentation
- `/app/globals.css` - All pitch page styles use `.badia-page` class

### Notes
- All pitch pages reuse the `.badia-page` CSS class for styling
- The CSS is already in globals.css, no need to add more
- Hero background image can stay as creatorspic.jpg or be customized
