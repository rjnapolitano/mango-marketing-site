"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function GrowStart() {
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);

  // Load theme from localStorage after mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  // Track ViewContent event on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Grow Start Page',
        content_category: 'Funnel'
      });
    }
  }, []);

  const isDark = theme === 'system' ? systemPrefersDark : theme === 'dark';

  return (
    <main className={`relative min-h-screen flex flex-col overflow-x-hidden ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* Top navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
        <Link
          href="/"
          className={`text-sm transition-colors ${
            isDark ? 'text-white hover:text-white/70' : 'text-black hover:text-black/70'
          }`}
        >
          ← Back
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`p-2 rounded-md transition-all duration-300 ${
              theme === 'light'
                ? isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
                : isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-black/10 text-black hover:bg-black/15'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-2 rounded-md transition-all duration-300 ${
              theme === 'dark'
                ? isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
                : isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-black/10 text-black hover:bg-black/15'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-2 rounded-md transition-all duration-300 ${
              theme === 'system'
                ? isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
                : isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-black/10 text-black hover:bg-black/15'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 md:px-4 md:py-8">
        <div className={`w-full max-w-3xl transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Logo */}
          <div className="flex justify-center mb-4 md:mb-6">
            <img
              src="/mango-logo.png"
              alt="Mango"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>

          {/* Subtitle */}
          <p className={`text-center text-xs md:text-sm mb-3 transition-colors ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            For SaaS, E-commerce, and B2B Companies
          </p>

          {/* Main question */}
          <h1 className={`text-lg md:text-2xl text-center mb-6 md:mb-8 font-bold leading-tight max-w-3xl mx-auto transition-colors ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            Looking for a better way to scale your influencer marketing program?
          </h1>

          {/* Companies Section */}
          <div className="mb-6 md:mb-8 -mx-4 overflow-hidden">
            <p className={`text-center text-xs mb-3 md:mb-4 font-medium transition-colors ${
              isDark ? 'text-zinc-500' : 'text-zinc-500'
            }`}>
              Companies hiring Mango creators
            </p>
            <div className="relative">
              {/* Gradient overlays */}
              <div
                className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{
                  background: isDark
                    ? 'linear-gradient(to right, rgb(0, 0, 0), transparent)'
                    : 'linear-gradient(to right, rgb(255, 255, 255), transparent)'
                }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{
                  background: isDark
                    ? 'linear-gradient(to left, rgb(0, 0, 0), transparent)'
                    : 'linear-gradient(to left, rgb(255, 255, 255), transparent)'
                }}
              />

              {/* Scrolling container */}
              <div
                className="flex gap-8 items-center"
                style={{
                  animation: 'scroll 20s linear infinite',
                  width: 'max-content'
                }}
              >
                {[
                  { name: 'Perplexity', file: 'perplexity.svg' },
                  { name: 'TikTok', file: 'tiktok.svg' },
                  { name: 'Sony', file: 'sony.svg' },
                  { name: 'Kraken', file: 'kraken.svg' },
                  { name: 'Wise', file: 'wise.svg' },
                  { name: 'eToro', file: 'etoro.svg' },
                  { name: 'CVS', file: 'cvs.svg' },
                  { name: 'Gap', file: 'gap.svg' },
                  { name: 'Wayfair', file: 'wayfair.svg' },
                  { name: 'Yeti', file: 'yeti.svg' }
                ].map((company, i) => (
                  <img
                    key={i}
                    src={`/logos/${company.file}`}
                    alt={company.name}
                    className={`h-8 w-auto flex-shrink-0 ${isDark ? 'brightness-0 invert opacity-70' : 'opacity-60'}`}
                  />
                ))}
                {[
                  { name: 'Perplexity', file: 'perplexity.svg' },
                  { name: 'TikTok', file: 'tiktok.svg' },
                  { name: 'Sony', file: 'sony.svg' },
                  { name: 'Kraken', file: 'kraken.svg' },
                  { name: 'Wise', file: 'wise.svg' },
                  { name: 'eToro', file: 'etoro.svg' },
                  { name: 'CVS', file: 'cvs.svg' },
                  { name: 'Gap', file: 'gap.svg' },
                  { name: 'Wayfair', file: 'wayfair.svg' },
                  { name: 'Yeti', file: 'yeti.svg' }
                ].map((company, i) => (
                  <img
                    key={`dup-${i}`}
                    src={`/logos/${company.file}`}
                    alt={company.name}
                    className={`h-8 w-auto flex-shrink-0 ${isDark ? 'brightness-0 invert opacity-70' : 'opacity-60'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            <Link
              href="/grow/growth-challenge"
              className={`group relative p-4 md:p-5 rounded-xl transition-all duration-500 ease-out hover:scale-[1.02] active:opacity-95 ${
                isDark
                  ? 'bg-white/5 hover:bg-white/8 border border-white/10'
                  : 'bg-black/5 hover:bg-black/8 border border-black/10'
              }`}
              style={{
                boxShadow: isDark
                  ? '0 2px 8px 0 rgba(255, 255, 255, 0.02)'
                  : '0 2px 8px 0 rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isDark ? 'bg-green-500/10 group-hover:bg-green-500/15' : 'bg-green-500/10 group-hover:bg-green-500/15'
                }`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <p className={`text-xs md:text-sm font-medium transition-colors ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  Yes – I'm ready to scale
                </p>
              </div>
            </Link>

            <Link
              href="/grow/not-ready"
              className={`group relative p-4 md:p-5 rounded-xl transition-all duration-500 ease-out hover:scale-[1.02] active:opacity-95 ${
                isDark
                  ? 'bg-white/5 hover:bg-white/8 border border-white/10'
                  : 'bg-black/5 hover:bg-black/8 border border-black/10'
              }`}
              style={{
                boxShadow: isDark
                  ? '0 2px 8px 0 rgba(255, 255, 255, 0.02)'
                  : '0 2px 8px 0 rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isDark ? 'bg-white/10 group-hover:bg-white/15' : 'bg-black/10 group-hover:bg-black/15'
                }`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDark ? 'text-white' : 'text-black'}>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <p className={`text-xs md:text-sm font-medium transition-colors ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  No – stay how we are
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
