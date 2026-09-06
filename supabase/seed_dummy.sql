-- ============================================================
-- Dummy / Test Data Seed
-- Run this in Supabase SQL Editor to populate your site for testing
-- Safe to run multiple times — uses ON CONFLICT DO NOTHING
-- ============================================================

-- ── 1. Categories ────────────────────────────────────────────
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
  ('Weddings',   'weddings',   'Beautiful wedding photography that tells your love story',  true, 1),
  ('Birthdays',  'birthdays',  'Joyful birthday celebrations captured forever',             true, 2),
  ('Modeling',   'modeling',   'Professional fashion and model portfolio shoots',            true, 3),
  ('Family',     'family',     'Warm family portraits you will treasure for generations',   true, 4),
  ('Corporate',  'corporate',  'Professional headshots and corporate event coverage',        true, 5),
  ('New Home',   'new-home',   'Milestone moments in your new space',                       true, 6),
  ('Portraits',  'portraits',  'Expressive individual portrait sessions',                    true, 7),
  ('Events',     'events',     'Concerts, parties and special occasion coverage',            true, 8)
ON CONFLICT (slug) DO NOTHING;


-- ── 2. Services ──────────────────────────────────────────────
INSERT INTO services (title, description, price_hint, is_active, sort_order) VALUES
  (
    'Wedding Photography',
    'Full-day wedding coverage capturing every precious moment — from the morning preparations right through to the first dance and beyond. You will receive a beautifully edited gallery of 400+ photos.',
    'Starting from ₹25,000',
    true, 1
  ),
  (
    'Portrait Session',
    'A relaxed 1-hour studio or outdoor portrait session for individuals or couples. Includes professional lighting, direction, and 30 fully edited high-resolution images.',
    'Starting from ₹5,000',
    true, 2
  ),
  (
    'Birthday & Celebrations',
    'Make your birthday or special celebration unforgettable with our candid and posed event photography. We cover the entire event from decoration to cake cutting.',
    'Starting from ₹8,000',
    true, 3
  ),
  (
    'Corporate & Events',
    'Professional photography for conferences, product launches, award ceremonies, and corporate headshots. Fast turnaround on edited images for business use.',
    'Starting from ₹10,000',
    true, 4
  ),
  (
    'Fashion & Modeling',
    'High-fashion editorial shoots for model portfolios, brand lookbooks, and social media content. We work with professional makeup artists and stylists.',
    'Starting from ₹12,000',
    true, 5
  ),
  (
    'Graphic Design',
    'Logo design, brand identity, social media creatives, wedding invitations, flyers, and banners. We turn your vision into stunning visuals that represent your brand.',
    'Starting from ₹3,000',
    true, 6
  )
ON CONFLICT DO NOTHING;


-- ── 3. Testimonials ──────────────────────────────────────────
INSERT INTO testimonials (client_name, client_title, quote, rating, is_published, sort_order) VALUES
  (
    'Priya & Karthik',
    'Wedding Couple',
    'Bala Photography made our wedding day even more magical. Every shot tells a story, and the editing is absolutely stunning. We cry every time we look at our album. Truly the best decision we made!',
    5, true, 1
  ),
  (
    'Ananya Sharma',
    'Model & Influencer',
    'I have worked with many photographers, but Bala Photography is on another level. They understand light, angles, and how to bring out your best self. My portfolio has never looked better.',
    5, true, 2
  ),
  (
    'Rahul Menon',
    'Corporate Client — TechStart India',
    'We hired Bala Photography for our annual conference and product launch. The team was professional, punctual, and delivered 300+ perfectly edited photos within 48 hours. Highly recommended!',
    5, true, 3
  ),
  (
    'Deepa & Family',
    'Family Portrait Session',
    'We wanted natural, candid family photos and that is exactly what we got. The kids were so comfortable and the final images are absolutely precious. Booking again for Christmas!',
    5, true, 4
  ),
  (
    'Sneha Krishnan',
    'Birthday Celebration',
    'My surprise birthday party was captured perfectly! Every laugh, every tear of joy — Bala Photography got it all. The photos are so vibrant and full of life. Thank you so much!',
    5, true, 5
  ),
  (
    'Mr. Vijay Pillai',
    'Business Owner',
    'Outstanding branding and graphic design work. The logo and brand identity they created for my restaurant is exactly what I envisioned. Very creative and easy to work with.',
    5, true, 6
  )
ON CONFLICT DO NOTHING;


-- ── 4. Update Site Settings with proper content ───────────────
UPDATE site_settings SET
  business_name        = 'Bala Photography',
  tagline              = 'Capturing Moments That Last Forever',
  contact_email        = 'hello@balaphoto.com',
  contact_phone        = '+91 98765 43210',
  contact_address      = 'Chennai, Tamil Nadu, India',
  hero_heading         = 'Professional Photography & Graphic Design',
  hero_subheading      = 'Every moment tells a story — let us capture yours.',
  about_heading        = 'About Bala Photography',
  about_body           = 'We are an award-winning photography and graphic design studio based in Chennai, Tamil Nadu.

With over 8 years of experience, we have had the privilege of capturing thousands of precious moments — from intimate weddings and family portraits to high-fashion editorials and major corporate events.

Our philosophy is simple: every person, every family, every event has a unique story. Our job is to tell that story beautifully, honestly, and with heart.

We combine natural light, creative composition, and careful post-processing to deliver images that are timeless, emotive, and truly yours.',
  meta_description     = 'Bala Photography — Award-winning professional photography and graphic design studio in Chennai. Wedding, portrait, fashion, corporate and event photography.'
WHERE id = (SELECT id FROM site_settings LIMIT 1);
