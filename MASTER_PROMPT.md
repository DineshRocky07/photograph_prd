Read AGENTS.md in this repo and follow it strictly.

You are a senior full-stack engineer and UI/UX designer. Build a complete,
production-quality photography + graphic design business website, end to end,
without stopping for my review between stages. Work through these four
stages in order, since each depends on the last — but do not pause and wait
for me between them. Self-check each stage (run the build, verify logic)
before moving to the next.

STAGE 1 — Foundation
- Design a normalized PostgreSQL schema: profiles, categories, gallery,
  services, inquiries, testimonials, site_settings. UUID primary keys,
  foreign keys, created_at/updated_at, indexes, constraints.
- Write Supabase migrations for it.
- Write RLS policies: public can read only published/active content; public
  cannot write anything or read inquiries; authenticated admins have full
  CRUD plus read/update on inquiries and site_settings.
- Implement Supabase Auth for admin login and protect /admin routes.
- Create .env.local.example (Supabase URL/keys, Cloudinary credentials) and
  gitignore .env.local.
- Set up base project structure (app/, components/, lib/, types/).

STAGE 2 — Media pipeline + core libraries
- Cloudinary integration: authenticated upload, store public_id + metadata
  in the gallery table, generate optimized delivery URLs (responsive
  width/height/quality, prefer WebP/AVIF), support delete/replace without
  orphaning Cloudinary files.
- Build lib/supabase (client + server), lib/cloudinary, lib/validations
  (server-side validation for inquiries/services/testimonials/gallery),
  lib/utils, and shared error-handling utilities.
- Verify end-to-end: an authenticated admin action can upload an image, it
  lands in Cloudinary, and metadata saves correctly to Supabase.

STAGE 3 — Public site
- Pages: / (home: hero, featured services, featured gallery with category
  filter, about, testimonials, CTA, contact info, footer), /about,
  /services, /gallery (masonry/grid, lazy loading, lightbox, category
  filter), /gallery/[category], /contact (enquiry form → inquiries table
  with server-side validation).
- SEO: metadata, Open Graph/Twitter tags, sitemap, robots.txt, alt text,
  clean URLs, per-category metadata.
- Loading/error/empty states everywhere. Fully responsive.
- All business info (name, logo, contact, socials, hero/about copy) pulled
  from site_settings — nothing hardcoded.

STAGE 4 — Admin dashboard + testing + deployment
- /admin: overview stats (gallery count, categories, services, new
  inquiries, published testimonials).
- /admin/gallery: upload, edit, delete, publish/unpublish, recategorize,
  reorder.
- /admin/categories, /admin/services: full CRUD, enable/disable, reorder.
- /admin/inquiries: view, filter by status (New/Contacted/In Progress/
  Completed/Cancelled), archive/delete.
- /admin/testimonials: CRUD + publish/unpublish.
- /admin/settings: business info, social links, hero/about content — must
  be the same data Stage 3's public pages read from.
- Keep every admin screen simple and obvious — this needs to be usable by a
  non-technical business owner, not just a developer.
- Confirm end-to-end: an admin edit to settings/services/testimonials shows
  up live on the public site.
- Run through the full test checklist (auth, RLS, gallery CRUD, Cloudinary
  upload/delete, enquiry submission, testimonial CRUD, mobile/desktop
  layout, error states, env var validation) and report pass/fail honestly —
  don't mark anything complete without actually verifying it.
- Write a README with setup instructions and Vercel deployment steps
  (env vars to set, build command, any post-deploy steps).

When everything above is done, give me:
1. A summary of what was built.
2. Exactly what I need to set up myself (Supabase project + keys, Cloudinary
   account + keys, any Vercel env vars) before it will run.
3. Any known gaps or things worth hardening for a real production launch.
