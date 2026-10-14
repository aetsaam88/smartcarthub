import type { Metadata } from 'next';
import './globals.css';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { AffiliateNoticeBanner } from '@/components/layout/AffiliateNoticeBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ComparisonBar } from '@/components/comparison/ComparisonBar';

export const metadata: Metadata = {
  title: 'GlobalCart — International Amazon Affiliate Marketing Platform',
  description:
    'Discover, compare, and explore verified consumer electronics, workstation peripherals, gaming gear, and home essentials with international Amazon availability across US, UK, Canada, and Europe.',
  keywords: [
    'Amazon affiliate',
    'product reviews',
    'buying guides',
    'product comparisons',
    'electronics',
    'computer accessories',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://globalcart.example'),
  openGraph: {
    title: 'GlobalCart — International Amazon Affiliate Marketing Platform',
    description:
      'Discover, compare, and explore verified products with international Amazon availability across US, UK, CA, DE, FR, IT.',
    siteName: 'GlobalCart',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
        <MarketplaceProvider>
          <ComparisonProvider>
            <AffiliateNoticeBanner />
            <Header />
            <main className="flex-1">{children}</main>
            <ComparisonBar />
            <Footer />
          </ComparisonProvider>
        </MarketplaceProvider>
      </body>
    </html>
  );
}
