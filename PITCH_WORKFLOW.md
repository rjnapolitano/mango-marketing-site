# Pitch Page Workflow

## Quick Start
Just tell Claude: **"Create a pitch page for [BRAND NAME] - [WEBSITE URL]"**

Example: "Create a pitch page for HelloFresh - hellofresh.com"

## What Claude Will Do Automatically

1. **Research the brand**
   - Visit their website
   - Understand their products/services
   - Identify their target audience
   - Note their brand voice and style

2. **Competitor research**
   - Find 3-5 competitors in their space
   - Research each competitor's creator/influencer marketing strategy
   - Document what's working for competitors (stats, campaigns, creators)
   - Identify opportunities for the brand

3. **Generate the pitch page**
   - Copy the template from `/app/pitch-template/`
   - Customize all content for the brand
   - Add competitor analysis cards
   - Suggest relevant creator types
   - Generate content ideas specific to their industry

4. **Deploy**
   - Create route at `/[brand-slug]` (e.g., `/hellofresh`)
   - Set password protection (default: `[brand]2026!`)
   - Push to deploy

## Pitch Page Sections

1. **Hero** - Prepared for [Brand], value proposition
2. **Benefits** - "Here's the problem" with solutions
3. **Why Mango** - Our differentiators
4. **Services** - What we offer
5. **Competitive Analysis** - 3-5 competitor cards with strategies
6. **Recommendation** - Custom strategy for the brand
7. **Strategy** - UGC vs Influencer approach
8. **Creators** - Example creators that fit
9. **Content Ideas** - 6-8 content concepts for the brand
10. **Timeline** - Standard 5-week timeline
11. **Case Study** - Our results (reusable)
12. **CTA** - Contact info

## File Structure
```
/app/[brand-slug]/
  layout.tsx    # Metadata + password for this pitch
  page.tsx      # The pitch page content
/public/[brand-slug]/
  [brand]-logo.png/svg  # Brand logo
  competitor logos...
```

## Password Convention
Default password: `[brand]2026!` (e.g., `hellofresh2026!`)
