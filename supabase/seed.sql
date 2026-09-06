-- ============================================================
-- Seed: Default site_settings row
-- Run AFTER migrations 0001 and 0002
-- ============================================================

INSERT INTO site_settings (
  business_name,
  tagline,
  contact_email,
  hero_heading,
  hero_subheading,
  about_heading,
  about_body,
  meta_description
) VALUES (
  'Bala Photography',
  'Capturing moments that last forever',
  'hello@balaphoto.com',
  'Professional Photography & Graphic Design',
  'Beautiful images, crafted with passion.',
  'About Bala Photography',
  'We are a creative studio specialising in photography and graphic design. Our mission is to turn your vision into stunning visuals.',
  'Professional photography and graphic design studio — portraits, events, branding, and more.'
)
ON CONFLICT DO NOTHING;
