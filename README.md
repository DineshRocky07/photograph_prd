# 📸 Bala Photography — Web Platform & Admin Dashboard

> A high-performance, modern photography portfolio and booking platform built with Next.js 16, Supabase, Cloudinary, and Tailwind CSS. Fully responsive, mobile-optimized, and connected to production on Vercel.

---

## 🌟 Architecture Overview

```mermaid
graph TD
    subgraph Client ["Client Devices"]
        Mobile["📱 Mobile Visitor"]
        Desktop["💻 Desktop Visitor"]
        AdminUser["🔐 Studio Admin"]
    end

    subgraph Edge ["Vercel Edge Network"]
        AppRouter["Next.js 16 App Router"]
        ServerActions["Server Actions & API Routes"]
        ImageCompressor["Browser Client Optimizer (Canvas Engine)"]
    end

    subgraph CloudServices ["Cloud Infrastructure"]
        Cloudinary["☁️ Cloudinary Media CDN<br/>(Auto WebP/AVIF, On-the-fly Resize)"]
        Supabase["⚡ Supabase PostgreSQL<br/>(RLS, Auth, Data Store)"]
        WhatsApp["💬 WhatsApp Direct Gateway<br/>(1-Tap Booking Leads)"]
    end

    Desktop --> AppRouter
    Mobile --> AppRouter
    AdminUser --> ImageCompressor
    ImageCompressor --> ServerActions
    ServerActions --> Cloudinary
    ServerActions --> Supabase
    AppRouter --> Supabase
    AppRouter --> Cloudinary
    Mobile --> WhatsApp
```

---

## 🔄 User & Data Flow

### 1. Visitor to Customer Lead Flow

```mermaid
sequenceDiagram
    autonumber
    actor Visitor as 📱 Client / Visitor
    participant Site as 🌐 Public Portfolio
    participant Cloudinary as ☁️ Cloudinary CDN
    participant Supabase as ⚡ Supabase DB
    participant WhatsApp as 💬 WhatsApp Direct

    Visitor->>Site: Opens Homepage (Desktop / Mobile)
    Site->>Supabase: Fetch Settings, Categories, Services
    Site->>Cloudinary: Fetch Optimized WebP/AVIF Photos
    Site-->>Visitor: Displays Full HD Hero Slideshow & 2-Col Gallery
    Visitor->>Site: Filters by Category / Opens Fullscreen Lightbox
    Visitor->>Site: Clicks "WhatsApp" / Submits Booking Form
    Site->>Supabase: Records Inquiry in database
    Site->>WhatsApp: Opens WhatsApp with pre-filled inquiry details
    WhatsApp-->>Visitor: Direct chat started with Photographer!
```

### 2. Admin Photo Upload & Management Flow

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 🔐 Studio Admin
    participant Browser as 🖥️ Browser Canvas Optimizer
    participant API as 🚀 Next.js /api/upload
    participant Cloudinary as ☁️ Cloudinary
    participant DB as ⚡ Supabase DB

    Admin->>Browser: Selects large DSLR/PC photo (10MB - 25MB)
    Browser->>Browser: Auto-compresses to 2560px Ultra HD (~1.5MB)
    Browser->>API: Uploads optimized payload (Bypasses Vercel 4.5MB limit)
    API->>Cloudinary: Stores original & tags public_id
    API->>DB: Inserts row in 'gallery' (auto-published)
    DB-->>Admin: Instant green checkmark & live on public site!
```

---

## 🗄️ Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    SITE_SETTINGS {
        uuid id PK
        text business_name
        text tagline
        text logo_public_id
        text favicon_public_id
        text contact_email
        text contact_phone
        text contact_address
        text hero_heading
        text hero_subheading
        text hero_image_public_id
        text about_heading
        text about_body
        text about_image_public_id
        text meta_description
        text og_image_public_id
    }

    CATEGORIES {
        uuid id PK
        text name
        text slug UK
        text description
        boolean is_active
        integer sort_order
    }

    GALLERY {
        uuid id PK
        uuid category_id FK
        text public_id
        text title
        text alt_text
        text caption
        boolean is_published
        boolean is_featured
        integer sort_order
    }

    SERVICES {
        uuid id PK
        uuid category_id FK
        text title
        text description
        text price_hint
        text cover_public_id
        boolean is_active
        integer sort_order
    }

    TESTIMONIALS {
        uuid id PK
        text client_name
        text client_title
        text quote
        integer rating
        boolean is_published
        integer sort_order
    }

    INQUIRIES {
        uuid id PK
        text name
        text email
        text phone
        text subject
        text message
        text status
    }

    PROFILES {
        uuid id PK
        text full_name
        text role
    }

    CATEGORIES ||--o{ GALLERY : "classifies"
    CATEGORIES ||--o{ SERVICES : "organizes"
```

---

## ✨ Key Features & Capabilities

### 🎨 Public Experience
* **Full HD Unobstructed Hero Slideshow:** Auto-cycles published portfolio photos every 4.5s with touch-swipe support on phones and pause-on-hover. No intrusive text blocking faces.
* **Mobile-First 2-Column Gallery:** Instagram/Pinterest-style 2-column mobile layout with horizontal thumb-scroll category filter pills.
* **Instant Lightbox:** Fullscreen image zoom and preview powered by `yet-another-react-lightbox`.
* **1-Tap WhatsApp Booking:** Floating bottom-corner pulsing button and hero buttons for instant mobile bookings.
* **Dynamic OpenGraph Previews:** Link previews with custom preview photo and title when shared on WhatsApp, Facebook, or Twitter.
* **Dynamic Browser Tab Icon (Favicon):** Automatically reflects the studio logo configured in Admin Settings.

### 🔐 Studio Admin Dashboard
* **Zero-Fail Large Photo Uploader:** Built-in client-side canvas optimizer (`lib/image-compress.ts`) compresses raw 20MB DSLR files down to ~1.5MB Ultra HD in the browser, eliminating Vercel 4.5MB serverless limits.
* **Per-Section Independent Saves:** Every settings card (Business Identity, Contact, Social, Hero, About, SEO) features its own save button with instant visual checkmark feedback.
* **Visual Image Picker:** Upload new photos or choose existing photos directly from your media gallery.
* **Instant Revalidation:** Dynamic database reads and layout revalidation update the public website immediately upon save.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Turbopack compilation, React 19, Server Components |
| **Language** | TypeScript | Strict type safety across database and UI schemas |
| **Styling** | Tailwind CSS & shadcn/ui | Modern, responsive clean neutral design |
| **Database** | Supabase (PostgreSQL) | Relational store with Row Level Security (RLS) |
| **Media CDN** | Cloudinary | Delivery optimization, on-the-fly transformations |
| **Hosting** | Vercel | Automated CI/CD deployments on git push to `main` |
| **Icons** | Lucide React | Clean, scalable vector iconography |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/DineshRocky07/photograph_prd.git
cd photograph_prd
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=balaphoto_uploads

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to preview the public site, or `http://localhost:3000/admin` to access the admin portal.

### 4. Production Build

```bash
npm run build
```

---

## 📦 Deployment

Every push to the **`main`** branch on GitHub automatically triggers a zero-downtime production deployment on Vercel:

```bash
git add .
git commit -m "update features"
git push origin main
```

---

## 📄 License

Private & Proprietary — Developed for **Bala Photography**. All rights reserved.
