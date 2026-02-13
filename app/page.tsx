"use client";

import { useState, useEffect } from "react";

type Theme = 'light' | 'dark' | 'system';

export default function Home() {
  const [showContact, setShowContact] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Detect system preference
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

  // Determine if dark mode should be active
  const isDark = theme === 'system' ? systemPrefersDark : theme === 'dark';

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const budget = formData.get('budget') as string;

    // Validate required fields
    const errors: {[key: string]: string} = {};

    if (!email) {
      errors.email = 'Please complete this section';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!company) {
      errors.company = 'Please complete this section';
    }

    if (!budget) {
      errors.budget = 'Please complete this section';
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
        setTimeout(() => {
          setShowContact(false);
          setFormStatus('idle');
          setFieldErrors({});
        }, 2000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <main className={`relative min-h-screen w-screen flex flex-col transition-colors duration-700 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* Top right controls */}
      <div className="absolute top-0 right-0 z-20 p-3 md:p-6 flex items-center gap-1.5 md:gap-3">
        {/* Light mode button */}
        <button
          onClick={() => setTheme('light')}
          className={`p-1.5 md:p-2 rounded-md transition-all duration-300 ${
            theme === 'light'
              ? isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
              : isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-black/10 text-black hover:bg-black/15'
          }`}
          aria-label="Light mode"
        >
          <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        {/* Dark mode button */}
        <button
          onClick={() => setTheme('dark')}
          className={`p-1.5 md:p-2 rounded-md transition-all duration-300 ${
            theme === 'dark'
              ? isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
              : isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-black/10 text-black hover:bg-black/15'
          }`}
          aria-label="Dark mode"
        >
          <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        {/* System mode button */}
        <button
          onClick={() => setTheme('system')}
          className={`p-1.5 md:p-2 rounded-md transition-all duration-300 ${
            theme === 'system'
              ? isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
              : isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-black/10 text-black hover:bg-black/15'
          }`}
          aria-label="System theme"
        >
          <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </button>

        <div className={`w-px h-5 md:h-6 mx-0.5 md:mx-1 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />

        <a
          href="https://app.onghost.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs md:text-sm px-2.5 md:px-4 py-1 md:py-1.5 rounded-md transition-all duration-300 ${
            isDark
              ? 'text-white hover:bg-white/10'
              : 'text-black hover:bg-black/10'
          }`}
        >
          Login
        </a>
      </div>

      {/* Main content - video as focal point */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-2 md:py-3">
        <div className={`w-full max-w-6xl transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>

          {/* Logo Image */}
          <div className="flex justify-center mb-3 md:mb-5">
            <div className="w-[160px] h-[160px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px] flex items-center justify-center">
              <img
                src="/mango-logo.png"
                alt="Mango"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Text content - wider, centered container */}
          <div className="max-w-sm md:max-w-3xl mx-auto">
            <h1 className={`text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 font-light leading-snug tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Mango is a creative agency built for the future of influencer marketing.
            </h1>

            <div className={`space-y-2 md:space-y-3 text-xs md:text-sm font-light leading-relaxed transition-colors ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              <p>
                Let's be real. You built a great product. So did your twelve competitors who launched this quarter.
              </p>

              <p>
                The product isn't the problem. Attention is the problem.
              </p>

              <p>
                And the highest-ROI channel for software companies right now isn't Google Ads, Facebook, or your founder posting on LinkedIn hoping something goes viral. It's influencers.
              </p>

              <p>
                Maybe you've tried it? DM'd a few creators, got no responses, paid some influencers you didn't love that didn't get any results and thought "this doesn't work." It does work. You just didn't have the system.
              </p>

              <p>
                That's why we built Mango.
              </p>

              <p>
                Our talent agency works with over 10,000 creators. Our AI matches your brand to the exact creators and strategy based on your niche, your competition, and what's already working in your space. We handle everything end to end. What works gets amplified. What doesn't gets killed.
              </p>

              <p>
                We're only taking a small number of beta partners right now. If you're tired of watching worse products win because they market better, reach out below.
              </p>

              <p className="italic">
                The future of advertising is already here. It's just not evenly distributed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="px-4 md:px-16 lg:px-24 py-3 md:py-6">
        {!showContact ? (
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3">
            <div>
              <nav className={`mb-2 text-sm md:text-[15px] font-semibold transition-colors flex items-center gap-3 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                <a
                  href="https://onghost.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Creator?
                </a>
                <span>•</span>
                <button
                  onClick={() => setShowContact(true)}
                  className="hover:opacity-70 transition-opacity"
                >
                  Contact
                </button>
              </nav>
              <p className={`text-xs md:text-[15px] transition-colors ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                A creative agency built for the future of influencer marketing.
              </p>
            </div>

            <div className={`text-xs md:text-[15px] transition-colors ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Los Angeles, CA ☀️
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-30">
            {/* Backdrop */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isDark ? 'bg-black/60' : 'bg-white/60'
              } backdrop-blur-sm`}
              onClick={() => setShowContact(false)}
              style={{ animation: 'fadeIn 0.5s ease-out' }}
            />

            {/* Drawer sliding up from bottom */}
            <div className={`absolute bottom-0 left-0 right-0 rounded-t-3xl transition-all duration-500 ${
              isDark ? 'bg-black' : 'bg-white'
            }`} style={{ animation: 'slideUp 0.5s ease-out' }}>
              <div className="max-w-2xl mx-auto px-6 md:px-12 py-8 md:py-12">
                {/* Close button */}
                <button
                  onClick={() => setShowContact(false)}
                  className={`absolute top-6 right-6 text-3xl transition-colors ${
                    isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
                  }`}
                >
                  ×
                </button>

                <h2 className={`text-2xl md:text-3xl text-center mb-10 md:mb-12 font-light transition-colors ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  Get in touch
                </h2>

                <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                  {/* Web3Forms Access Key */}
                  <input type="hidden" name="access_key" value="656fa708-45bd-44d6-8b56-24614825e3ba" />

                  {/* Honeypot for spam protection */}
                  <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      disabled={formStatus === 'submitting'}
                      onChange={() => setFieldErrors(prev => ({ ...prev, email: '' }))}
                      className={`w-full bg-transparent border-b px-0 py-4 text-base font-light outline-none transition-all ${
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
                      <div className="absolute right-0 top-4 flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                          <span className="font-medium">!</span>
                          <span>{fieldErrors.email}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company name"
                      disabled={formStatus === 'submitting'}
                      onChange={() => setFieldErrors(prev => ({ ...prev, company: '' }))}
                      className={`w-full bg-transparent border-b px-0 py-4 text-base font-light outline-none transition-all ${
                        fieldErrors.company
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
                    {fieldErrors.company && (
                      <div className="absolute right-0 top-4 flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                          <span className="font-medium">!</span>
                          <span>{fieldErrors.company}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="budget"
                      placeholder="Monthly budget"
                      disabled={formStatus === 'submitting'}
                      onChange={() => setFieldErrors(prev => ({ ...prev, budget: '' }))}
                      className={`w-full bg-transparent border-b px-0 py-4 text-base font-light outline-none transition-all ${
                        fieldErrors.budget
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
                    {fieldErrors.budget && (
                      <div className="absolute right-0 top-4 flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                          <span className="font-medium">!</span>
                          <span>{fieldErrors.budget}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <textarea
                    name="message"
                    placeholder="Tell us what you need..."
                    rows={3}
                    disabled={formStatus === 'submitting'}
                    className={`w-full bg-transparent border-b px-0 py-4 text-base font-light outline-none resize-none transition-all ${
                      isDark
                        ? 'border-white/20 focus:border-white text-white placeholder-zinc-500'
                        : 'border-black/20 focus:border-black text-black placeholder-zinc-400'
                    }`}
                  />

                  <div className="flex justify-center pt-6">
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className={`px-12 py-3 text-base rounded-lg transition-all duration-300 ${
                        formStatus === 'submitting'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      } ${
                        isDark
                          ? 'bg-white text-black hover:bg-white/90'
                          : 'bg-black text-white hover:bg-black/90'
                      }`}
                    >
                      {formStatus === 'submitting' ? 'Sending...' : formStatus === 'success' ? 'Sent!' : 'Submit'}
                    </button>
                  </div>

                  {formStatus === 'error' && (
                    <p className={`text-center text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
