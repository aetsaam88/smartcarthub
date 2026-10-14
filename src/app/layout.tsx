import type { Metadata } from 'next';
import './globals.css';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import { AffiliateNoticeBanner } from '@/components/layout/AffiliateNoticeBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdSenseWrapper } from '@/components/ads/AdSenseWrapper';

export const metadata: Metadata = {
  title: 'SmartCartHub — Smart Shopping, Better Living',
  description:
    'Discover, explore, and buy verified consumer electronics, workstation peripherals, gaming gear, and home essentials with international Amazon availability across US, UK, Canada, and Europe.',
  keywords: [
    'Amazon affiliate',
    'product reviews',
    'buying guides',
    'electronics',
    'computer accessories',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcarthub.example'),
  openGraph: {
    title: 'SmartCartHub — Smart Shopping, Better Living',
    description:
      'Discover and explore verified products with international Amazon availability across US, UK, CA, DE, FR, IT.',
    siteName: 'SmartCartHub',
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
          <AdSenseWrapper>
            <AffiliateNoticeBanner />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AdSenseWrapper>
        </MarketplaceProvider>
      </body>
    </html>
  );
}