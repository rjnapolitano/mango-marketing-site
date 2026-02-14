"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveFunnelData } from "@/lib/funnelData";

export default function Revenue() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);

  const handleSelection = (revenue: string) => {
    saveFunnelData('revenue', revenue);
    router.push('/grow/funnel-status');
  };

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

  const isDark = theme === 'system' ? systemPrefersDark : theme === 'dark';

  const revenueRanges = [
    { icon: "🍊", text: "Pre-revenue" },
    { icon: "💵", text: "Startup/Early stage ($5k–$20k)" },
    { icon: "💬", text: "Growing business ($20k–$100k)" },
    { icon: "📦", text: "Scaling business ($100k–$250k)" },
    { icon: "⭐", text: "Established company ($250k+)" },
    { icon: "👀", text: "Enterprise/Large corporation" },
  ];

  return (
    <main className={`relative min-h-screen flex flex-col overflow-x-hidden ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* Top navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
        <Link
          href="/grow/primary-goal"
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
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>

          {/* Main question */}
          <h1 className={`text-lg md:text-2xl text-center mb-6 md:mb-8 font-bold leading-tight max-w-3xl mx-auto transition-colors ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            What's your average monthly revenue right now?
          </h1>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-2 md:gap-3 max-w-2xl mx-auto">
            {revenueRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => handleSelection(range.text)}
                className={`group relative p-3 md:p-4 rounded-xl transition-all duration-500 ease-out hover:scale-[1.02] active:opacity-95 flex items-center gap-2 md:gap-3 text-left w-full ${
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
                <span className="text-xl md:text-2xl flex-shrink-0">{range.icon}</span>
                <p className={`text-xs md:text-sm font-medium transition-colors ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  {range.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
