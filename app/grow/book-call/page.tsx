"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFunnelData, sendToGoogleSheets, clearFunnelData } from "@/lib/funnelData";

export default function BookCall() {
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [showCalendar, setShowCalendar] = useState(false);

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

  // Initialize Cal.com when showCalendar becomes true
  useEffect(() => {
    if (showCalendar) {
      const currentTheme = isDark ? 'dark' : 'light';

      // Use exact Cal.com embed code
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        (function (C, A, L) {
          let p = function (a, ar) { a.q.push(ar); };
          let d = C.document;
          C.Cal = C.Cal || function () {
            let cal = C.Cal;
            let ar = arguments;
            if (!cal.loaded) {
              cal.ns = {};
              cal.q = cal.q || [];
              d.head.appendChild(d.createElement("script")).src = A;
              cal.loaded = true;
            }
            if (ar[0] === L) {
              const api = function () { p(api, arguments); };
              const namespace = ar[1];
              api.q = api.q || [];
              if(typeof namespace === "string"){
                cal.ns[namespace] = cal.ns[namespace] || api;
                p(cal.ns[namespace], ar);
                p(cal, ["initNamespace", namespace]);
              } else p(cal, ar);
              return;
            }
            p(cal, ar);
          };
        })(window, "https://app.cal.com/embed/embed.js", "init");

        Cal("init", "mango-strategy-call", {origin:"https://app.cal.com"});

        Cal.ns["mango-strategy-call"]("inline", {
          elementOrSelector:"#my-cal-inline-mango-strategy-call",
          config: {"layout":"month_view","theme":"${currentTheme}"},
          calLink: "rjnapolitano/mango-strategy-call",
        });

        Cal.ns["mango-strategy-call"]("ui", {
          "cssVarsPerTheme":{
            "light":{"cal-brand":"#FF9F66"},
            "dark":{"cal-brand":"#FF9F66"}
          },
          "hideEventTypeDetails":false,
          "layout":"month_view",
          "theme":"${currentTheme}"
        });
      `;
      document.body.appendChild(script);
    }
  }, [showCalendar, isDark]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    const errors: {[key: string]: string} = {};

    if (!name) {
      errors.name = 'Please enter your name';
    }

    if (!email) {
      errors.email = 'Please enter your email';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFormStatus('submitting');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setFormStatus('success');
        form.reset();

        // Send all funnel data to Google Sheets
        const funnelData = getFunnelData();
        const submissionData = {
          name,
          email,
          company: formData.get('company') as string,
          companyUrl: formData.get('companyUrl') as string,
        };

        // Send to Google Sheets (don't await, let it happen in background)
        sendToGoogleSheets(submissionData, funnelData).then(() => {
          // Clear funnel data after successful submission
          clearFunnelData();
        });

        // Show calendar embed after brief delay
        setTimeout(() => {
          setShowCalendar(true);
        }, 1500);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <main className={`relative min-h-screen flex flex-col ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* Top navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
        <Link
          href="/grow/strategy-session"
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
      <div className="flex-1 flex items-center justify-center px-6 py-4 md:px-4 md:py-6 overflow-y-auto">
        <div className={`w-full ${showCalendar ? 'max-w-4xl' : 'max-w-2xl'} transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Logo */}
          <div className="flex justify-center mb-4 md:mb-6">
            <img
              src="/mango-logo.png"
              alt="Mango"
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* Calendar Embed */}
          {showCalendar ? (
            <div className="transition-all duration-1000 opacity-100">
              <h2 className={`text-base md:text-xl mb-4 font-light text-center transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Choose your time
              </h2>
              <div className="mx-auto rounded-xl overflow-hidden">
                <div
                  id="my-cal-inline-mango-strategy-call"
                  className="w-full"
                  style={{
                    minHeight: 'clamp(400px, 70vh, 600px)',
                    overflow: 'auto'
                  }}
                />
              </div>
            </div>
          ) : formStatus === 'success' ? (
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 64 64" fill="none">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={isDark ? '#ffffff' : '#000000'}
                      strokeWidth="4"
                      style={{ animation: 'drawCircle 0.5s ease-out forwards' }}
                    />
                    <path
                      d="M20 32 L28 40 L44 24"
                      stroke={isDark ? '#ffffff' : '#000000'}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      style={{ animation: 'drawCheck 0.5s ease-out 0.3s forwards' }}
                      strokeDasharray="40"
                      strokeDashoffset="40"
                    />
                  </svg>
                </div>
              </div>
              <h2 className={`text-lg md:text-2xl mb-3 md:mb-4 font-light transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Thank you!
              </h2>
              <p className={`text-xs md:text-sm mb-6 md:mb-8 transition-colors ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Loading calendar...
              </p>
              <div className="relative w-12 h-12 mx-auto">
                <svg className="animate-spin" viewBox="0 0 64 64" fill="none">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={isDark ? '#ffffff' : '#000000'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="140 44"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <>
              {/* Subtitle */}
              <p className={`text-center text-xs mb-2 transition-colors ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                R.J., Founder & CEO
              </p>
              <p className={`text-center text-[10px] mb-4 md:mb-6 transition-colors ${
                isDark ? 'text-zinc-500' : 'text-zinc-500'
              }`}>
                Mango
              </p>

              {/* Main title */}
              <h1 className={`text-lg md:text-2xl text-center mb-3 md:mb-4 font-bold leading-tight max-w-3xl mx-auto transition-colors ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Book Your Free Influencer Strategy Call
              </h1>

              {/* Description */}
              <p className={`text-center text-xs md:text-sm mb-4 md:mb-6 transition-colors ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                We'll audit your niche, show you which creators are driving actual sales in your space, and map out exactly how to launch profitable campaigns in the next 30 days.
              </p>

              {/* What You'll Receive */}
              <div className={`mb-4 md:mb-6 p-4 md:p-5 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <h3 className={`text-sm md:text-base font-medium mb-3 transition-colors ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  On this call, you'll get:
                </h3>
                <ul className={`space-y-1.5 md:space-y-2 text-xs md:text-sm transition-colors ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Custom creator recommendations for your niche</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Competitor influencer teardown (who they're using and what's working)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Estimated campaign costs and expected ROI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>30-day launch plan to get your first campaign live</span>
                  </li>
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <input type="hidden" name="access_key" value="656fa708-45bd-44d6-8b56-24614825e3ba" />
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="👋 Your name"
                    disabled={formStatus === 'submitting'}
                    onChange={() => setFieldErrors(prev => ({ ...prev, name: '' }))}
                    className={`w-full bg-transparent border-b px-0 py-2.5 md:py-3 text-xs md:text-sm font-light outline-none transition-all ${
                      fieldErrors.name
                        ? isDark ? 'border-red-500' : 'border-red-600'
                        : isDark
                        ? 'border-white/20 focus:border-white'
                        : 'border-black/20 focus:border-black'
                    } ${
                      isDark
                        ? 'text-white placeholder-zinc-500'
                        : 'text-black placeholder-zinc-400'
                    }`}
                  />
                  {fieldErrors.name && (
                    <div className="absolute right-0 top-2.5 md:top-3 text-[10px] md:text-xs text-red-500">
                      {fieldErrors.name}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="✉️ Your email address"
                    disabled={formStatus === 'submitting'}
                    onChange={() => setFieldErrors(prev => ({ ...prev, email: '' }))}
                    className={`w-full bg-transparent border-b px-0 py-2.5 md:py-3 text-xs md:text-sm font-light outline-none transition-all ${
                      fieldErrors.email
                        ? isDark ? 'border-red-500' : 'border-red-600'
                        : isDark
                        ? 'border-white/20 focus:border-white'
                        : 'border-black/20 focus:border-black'
                    } ${
                      isDark
                        ? 'text-white placeholder-zinc-500'
                        : 'text-black placeholder-zinc-400'
                    }`}
                  />
                  {fieldErrors.email && (
                    <div className="absolute right-0 top-2.5 md:top-3 text-[10px] md:text-xs text-red-500">
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="url"
                    name="company_url"
                    placeholder="🌐 Company website"
                    disabled={formStatus === 'submitting'}
                    className={`w-full bg-transparent border-b px-0 py-2.5 md:py-3 text-xs md:text-sm font-light outline-none transition-all ${
                      isDark
                        ? 'border-white/20 focus:border-white text-white placeholder-zinc-500'
                        : 'border-black/20 focus:border-black text-black placeholder-zinc-400'
                    }`}
                  />
                </div>

                <div className="flex flex-col items-center gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={`w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-medium rounded-xl transition-all duration-500 ease-out ${
                      formStatus === 'submitting'
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-[1.02] active:opacity-95'
                    }`}
                    style={{
                      backgroundColor: '#FF9F66',
                      color: '#000000',
                      boxShadow: '0 4px 14px 0 rgba(255, 159, 102, 0.25)'
                    }}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Continue →'}
                  </button>

                  <p className={`text-[10px] md:text-xs flex items-center gap-1 transition-colors ${
                    isDark ? 'text-zinc-500' : 'text-zinc-500'
                  }`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Secure data transfer via SSL
                  </p>
                </div>

                {formStatus === 'error' && (
                  <p className={`text-center text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
