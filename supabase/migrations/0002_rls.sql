-- ============================================================
-- Migration 0002: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- Helper: is the current user an authenticated admin?
-- ────────────────────────────────────────────────────────────
-- We simply check auth.uid() IS NOT NULL because the only users
-- in the system are admins created by the owner.
-- If you later need multiple roles, check the profiles.role column.

-- ────────────────────────────────────────────────────────────
-- profiles
-- ────────────────────────────────────────────────────────────
-- Admins can read/update their own profile
CREATE POLICY "profiles: admin select own"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles: admin update own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- No public access to profiles

-- ────────────────────────────────────────────────────────────
-- categories
-- ────────────────────────────────────────────────────────────
-- Public can read active categories
CREATE POLICY "categories: public select active"
  ON categories FOR SELECT
  TO anon
  USING (is_active = TRUE);

-- Admin full CRUD
CREATE POLICY "categories: admin all"
  ON categories FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ────────────────────────────────────────────────────────────
-- gallery
-- ────────────────────────────────────────────────────────────
-- Public can read published gallery items
CREATE POLICY "gallery: public select published"
  ON gallery FOR SELECT
  TO anon
  USING (is_published = TRUE);

-- Admin full CRUD
CREATE POLICY "gallery: admin all"
  ON gallery FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ────────────────────────────────────────────────────────────
-- services
-- ────────────────────────────────────────────────────────────
-- Public can read active services
CREATE POLICY "services: public select active"
  ON services FOR SELECT
  TO anon
  USING (is_active = TRUE);

-- Admin full CRUD
CREATE POLICY "services: admin all"
  ON services FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ────────────────────────────────────────────────────────────
-- inquiries — public can INSERT only; NO public read
-- ────────────────────────────────────────────────────────────
CREATE POLICY "inquiries: public insert"
  ON inquiries FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Admin can read, update, delete
CREATE POLICY "inquiries: admin all"
  ON inquiries FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ────────────────────────────────────────────────────────────
-- testimonials
-- ────────────────────────────────────────────────────────────
-- Public can read published testimonials
CREATE POLICY "testimonials: public select published"
  ON testimonials FOR SELECT
  TO anon
  USING (is_published = TRUE);

-- Admin full CRUD
CREATE POLICY "testimonials: admin all"
  ON testimonials FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ────────────────────────────────────────────────────────────
-- site_settings
-- ────────────────────────────────────────────────────────────
-- Public can read settings (needed to render the public site)
CREATE POLICY "site_settings: public select"
  ON site_settings FOR SELECT
  TO anon
  USING (TRUE);

-- Admin full CRUD
CREATE POLICY "site_settings: admin all"
  ON site_settings FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);
