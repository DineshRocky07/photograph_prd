# AGENTS.md — Project Behavior Rules

## Project
Production-quality photography + graphic design business website: public site + admin dashboard.

## Tech stack (fixed — do not deviate)
- Frontend: Next.js (latest stable), TypeScript, App Router, Tailwind CSS, shadcn/ui, Framer Motion
- Backend: Next.js Server Components / Server Actions / Route Handlers only — no separate backend
- Database: Supabase PostgreSQL + Supabase Auth + Row Level Security (RLS)
- Media: Cloudinary (CDN delivery, WebP/AVIF, responsive transforms). Store only Cloudinary public_id + metadata in Supabase — never binaries in Postgres
- Deployment: Vercel (free Hobby tier)

Do NOT introduce: microservices, Kubernetes, Redis, Docker, a separate FastAPI/Express backend, or message queues. Keep this a single monolithic Next.js app.

## Ground rules for the agent
1. Build straight through to a finished, deployable product. Do not stop and wait for human review between phases — self-check your own work (run the build, sanity-check schema/RLS logic) and keep moving.
2. Still work in the logical order: (1) schema/auth/RLS/security → (2) Cloudinary + core libs → (3) public pages → (4) admin dashboard + tests + deploy docs. Don't skip ahead in a way that leaves earlier foundations broken.
3. Never invent or hardcode real Supabase/Cloudinary credentials. Use env vars, document every required one in `.env.local.example`.
4. Never expose server-only secrets (`SUPABASE_SECRET_KEY`, `CLOUDINARY_API_SECRET`) to the client.
5. Admin page must stay simple and user-friendly: clear nav, obvious CRUD actions (upload/edit/delete/publish), no unnecessary complexity beyond what's needed to manage gallery, categories, services, enquiries, testimonials, and site settings.
6. Optimize for fast image loading by default: Cloudinary transformations (width/height/quality/format), `next/image`, lazy loading, responsive sizes — never plain unoptimized `<img>` tags.
7. Don't mark anything "complete" until it's actually been tested (build passes, flow works end-to-end). If something can't be verified without live credentials, say so explicitly instead of assuming it works.
8. Only stop and ask a question if something truly blocks progress (missing credentials, an ambiguous requirement that would change the architecture). Otherwise pick the sensible default and keep going.
9. At the very end, give a final summary: what was built, what needs the user's own setup (env vars, Supabase project, Cloudinary account), and any known gaps for a real production launch.

## Definition of "finished"
- [ ] Schema + RLS policies implemented and correct (public read-only on published content, admin full CRUD)
- [ ] Admin auth works, `/admin` routes protected
- [ ] Cloudinary upload/delete wired to Supabase metadata
- [ ] Public site: home, about, services, gallery (+ category filter), contact form → saved to `inquiries`
- [ ] SEO basics: metadata, OG tags, sitemap, robots.txt, alt text
- [ ] Admin dashboard: gallery, categories, services, inquiries, testimonials, site settings — all CRUD, simple UI
- [ ] Editing site settings/services/testimonials in admin reflects live on the public site
- [ ] Build passes with zero errors
- [ ] `.env.local.example` complete and `.env.local` gitignored
- [ ] README with setup + Vercel deployment steps
