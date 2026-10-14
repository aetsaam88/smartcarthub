'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { MarketplaceCode } from '@/types';

export function Header() {
  const router = useRouter();
  const { currentMarketplace, setMarketplace, allMarketplaces } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Categories', href: '/#categories' },
    { label: 'Buying Guides', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact Us', href: '/contact'}
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Logo Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md shadow-amber-500/10 group-hover:bg-amber-600 transition-colors duration-300">
                <ShoppingBag className="w-5 h-5 text-amber-400 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Brand Name */}
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors duration-300">
                  SmartCart
                  <span className="text-amber-500">Hub</span>
                </span>

                {/* Tagline */}
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                  Smart Shopping, Better Living
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-50 rounded-md transition-colors relative flex items-center gap-1.5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search Form */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 pl-10 pr-4 py-2 rounded-full text-sm border border-transparent focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Right actions: Marketplace Switcher & Admin */}
          <div className="flex items-center gap-2">
            
            {/* Marketplace selector */}
            <div className="relative">
              <button
                onClick={() => setMarketDropdownOpen(!marketDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                title="Select Amazon Marketplace"
              >
                <span className="text-base leading-none">{currentMarketplace.flag}</span>
                <span className="font-semibold text-slate-800">{currentMarketplace.code}</span>
                <span className="text-slate-400 hidden sm:inline">({currentMarketplace.currencySymbol})</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {marketDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setMarketDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                    Target Amazon Store
                  </div>
                  {allMarketplaces.map((m) => (
                    <button
                      key={m.code}
                      onClick={() => {
                        setMarketplace(m.code as MarketplaceCode);
                        setMarketDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 hover:text-amber-800 transition-colors ${
                        currentMarketplace.code === m.code
                          ? 'bg-amber-50 font-bold text-amber-700'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{m.flag}</span>
                        <div>
                          <div>{m.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{m.domain}</div>
                        </div>
                      </div>
                      <span className="text-slate-400 text-[11px] font-medium">{m.currency}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin link */}
            <Link
              href="/admin/dashboard"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products, brands, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-amber-500 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <nav className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-amber-600 rounded-lg"
              >
                <span>{link.label}</span>
              </Link>
            ))}
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Admin Management Portal</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}