'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from './LangProvider';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/#products', label: t('nav.products') },
    { href: '/track', label: t('nav.orders') },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700' : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-all">
            <span className="text-dark-900 font-bold text-sm">G</span>
          </div>
          <span className="font-display font-bold text-lg text-white">
            Gift<span className="text-gold-400">Store</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-dark-300 hover:text-gold-400 text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 transition-all duration-200"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <Link
            href="/#products"
            className="hidden md:flex items-center gap-1.5 bg-gold-gradient text-dark-900 text-sm font-bold px-4 py-2 rounded-full hover:shadow-gold transition-all duration-200 hover:scale-105"
          >
            {t('hero.cta')}
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-dark-300 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-900/98 backdrop-blur-md border-t border-dark-700 px-4 py-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-dark-300 hover:text-gold-400 border-b border-dark-800 text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
