
import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { MARKETPLACE_LIST } from '@/lib/marketplaces';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Amazon Associates Disclaimer */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              <strong className="text-white">
                Amazon Associates Program Compliance:
              </strong>{' '}
              As an Amazon Associate, SmartCartHub earns from qualifying purchases.
              Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
            </p>
          </div>

          <Link
            href="/affiliate-disclosure"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline shrink-0"
          >
            Read Our Full Disclosure Policy
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>

              <span className="font-extrabold text-xl tracking-tight text-white">
                SmartCart<span className="text-amber-500">Hub</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SmartCartHub is an international product discovery and buying
              guide platform. We help shoppers discover useful products,
              compare features, explore buying guides, and find products
              through Amazon affiliate links.
            </p>

            <div className="pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Supported Amazon Marketplaces:
              </p>

              <div className="flex flex-wrap gap-2">
                {MARKETPLACE_LIST.map((m) => (
                  <span
                    key={m.code}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  >
                    <span>{m.flag}</span>
                    <span className="font-medium">{m.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore Catalog
            </h4>

            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/products" className="hover:text-amber-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="hover:text-amber-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/computers-and-accessories" className="hover:text-amber-400 transition-colors">
                  Computers & Tech
                </Link>
              </li>
              <li>
                <Link href="/category/gaming" className="hover:text-amber-400 transition-colors">
                  Gaming Gear
                </Link>
              </li>
              <li>
                <Link href="/category/smart-home" className="hover:text-amber-400 transition-colors">
                  Smart Home Devices
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-amber-400 transition-colors">
                  Product Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial & Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Editorial & Guides
            </h4>

            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/blog" className="hover:text-amber-400 transition-colors">
                  Buying Guides & Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog/best-wireless-keyboards-for-programmers" className="hover:text-amber-400 transition-colors">
                  Best Wireless Keyboards
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-choose-an-ergonomic-mouse" className="hover:text-amber-400 transition-colors">
                  Ergonomic Mouse Guide
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-amber-400 transition-colors">
                  Editorial Review Standards
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Legal & Trust
            </h4>

            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-amber-400 transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} SmartCartHub. All rights reserved.
          </p>

          <p className="text-[11px] text-slate-500">
            SmartCartHub is an informational and affiliate website.
            Purchases are completed on the respective retailer's website.
          </p>
        </div>
      </div>
    </footer>
  );
}
