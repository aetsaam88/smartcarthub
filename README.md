<<<<<<< HEAD
# GlobalCart — International Amazon Affiliate Marketing Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-amber)](#)

**GlobalCart** is a production-grade, editorial-standard Amazon Affiliate Marketing platform designed for international consumer audiences—with native multi-storefront support for the **United States (amazon.com)**, **United Kingdom (amazon.co.uk)**, **Canada (amazon.ca)**, **Germany (amazon.de)**, **France (amazon.fr)**, and **Italy (amazon.it)**.

---

## 🌟 Key Highlights & Architecture

- **Public Editorial Experience**:
  - **Dynamic International Header**: Instant Amazon marketplace and currency switcher (🇺🇸 US, 🇬🇧 UK, 🇨🇦 CA, 🇩🇪 DE, 🇫🇷 FR, 🇮🇹 IT) with live search and responsive navigation.
  - **Comprehensive Product Catalog**: Category and brand filtering, sort by editorial score or name, responsive cards, and verified specifications.
  - **Deep-Dive Product Reviews (`/product/[slug]`)**: Verified technical specifications, laboratory-backed pros/cons, editorial breakdown, related equipment, and direct marketplace-specific Amazon buttons with `rel="sponsored noopener noreferrer"`.
  - **Interactive Comparison Matrix (`/compare`)**: Compare 2 to 4 products side-by-side with specifications, scores, and Amazon buttons.
  - **Editorial Blog & Guides (`/blog`, `/blog/[slug]`)**: In-depth buying guides and hardware assessments with author credentials, reading times, and compliance banners.
  - **Privacy-Conscious Newsletter**: GDPR/compliance consent checkbox and secure subscription storage.
  - **Compliance Pages**: Amazon statutory disclosure ("As an Amazon Associate I earn from qualifying purchases"), Editorial Standards, Privacy Policy, Terms of Service, and Contact.

- **Administrative Portal (`/admin`)**:
  - **Overview Dashboard**: Real-time product counts, live articles, total outbound Amazon clicks, and top-clicked products.
  - **Product Management**: Complete CRUD, auto-slug generator, technical specs builder, pros/cons lists, and marketplace link mappings.
  - **Category Management**: Taxonomy management with safe-delete protection preventing orphaned products.
  - **Marketplaces Engine**: International Amazon link coverage and broken link tracking.
  - **Blog CMS**: Markdown guide publishing, draft/publish lifecycle, and SEO metadata editing.
  - **Click Analytics**: Visual charts powered by Recharts comparing clicks across countries and products.
  - **Site Settings**: Centralized management for Amazon affiliate disclosures, contacts, and default locales.

- **Database & Hybrid Repository**:
  - PostgreSQL schema and migrations in `supabase/migrations/01_initial_schema.sql`.
  - Seed SQL in `supabase/seed.sql`.
  - Zero-credential local development engine: Built-in repository with sample data so the demo runs out-of-the-box before remote credentials are provided.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18+ or v20+ (v24 supported)
- **npm** or **pnpm**

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd store

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default local configuration:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@globalcart.example
ADMIN_PASSWORD=GlobalCart2025!#
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public website.

### 5. Access the Admin Portal
Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and log in:
- **Email**: `admin@globalcart.example`
- **Password**: `GlobalCart2025!#`

---

## 🧪 Automated Testing

Execute the test suite verifying utilities, marketplace resolution, Zod schemas, orphan protections, and click tracking:
```bash
npm test
```

---

## 🗄️ Supabase PostgreSQL Setup & Production Migration

To connect GlobalCart to a live managed PostgreSQL instance on Supabase:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase/migrations/01_initial_schema.sql`](supabase/migrations/01_initial_schema.sql).
4. Run [`supabase/seed.sql`](supabase/seed.sql) to populate initial sample categories, products, and marketplace links.
5. In your Supabase Project Settings, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`
   - `Connection string (URI)` → `DATABASE_URL`
6. Add these variables to `.env.local` or your production hosting provider.

---

## 🌐 Production Deployment & Domain Setup

### 1. Deploying to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the Framework Preset to **Next.js**.
5. Add your Environment Variables (`NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.).
6. Click **Deploy**.

### 2. Connecting a Custom Domain (`.com` or `.store`)
1. In Vercel, navigate to **Project Settings > Domains**.
2. Add your custom domain (e.g. `globalcart.store` and `www.globalcart.store`).
3. In your DNS provider (Cloudflare, Namecheap, GoDaddy):
   - **A Record**: `@` → `76.76.21.21` (or Vercel Anycast IP)
   - **CNAME Record**: `www` → `cname.vercel-dns.com`
4. Wait for DNS propagation and automatic SSL / HTTPS certificate issuance.
5. Update `NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com`.

### 3. Google Search Console & SEO
1. Submit your sitemap at: `https://www.yourdomain.com/sitemap.xml`.
2. Verify `robots.txt` is accessible at `https://www.yourdomain.com/robots.txt`.

---

## 📋 Amazon Associates Program Compliance Checklist

GlobalCart is constructed around the **Amazon Associates Operating Agreement** and **Program Policies**:

- [x] **Mandatory Statutory Statement**: Clearly displayed on the top banner, footer, and dedicated `/affiliate-disclosure` page:
  > *"As an Amazon Associate I earn from qualifying purchases."*
- [x] **Sponsored Link Attribute**: All outbound links targeting Amazon include `rel="sponsored noopener noreferrer"`.
- [x] **No Fabricated Pricing**: Static, invented prices are forbidden. Buttons state *"Check current price on Amazon"*.
- [x] **No Fabricated Reviews/Ratings**: Editorial scores are based strictly on documented testing and transparent criteria.
- [x] **No Independent Checkout**: GlobalCart never handles payment processing or order fulfillment; visitors purchase securely on Amazon.
- [x] **Proper Trademark Use**: Follows Amazon Trademark Guidelines without modifying the Amazon logo or claiming official endorsement.
- [x] **Regional Tag Isolation**: Associate tags are segmented by locale (`globalcart-us-20`, `globalcart-uk-21`, `globalcart-de-21`, etc.).
- [x] **Privacy Compliance**: GDPR-compliant cookie handling, newsletter opt-in consent timestamps, and zero storage of raw IP addresses for basic click telemetry.
=======
# smartcarthub
>>>>>>> 94e90da7d80171bdcdc8a09bcdd22ca016f6a007
