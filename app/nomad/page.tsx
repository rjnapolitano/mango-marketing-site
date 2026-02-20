"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PITCH_PASSWORD = "nomad2026!";

function Counter({ target, animated }: { target: number; animated: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!animated) return;
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, animated]);
  return <>{count}</>;
}

export default function NomadPitchPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const caseStudyRef = useRef<HTMLElement>(null);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [graphAnimated, setGraphAnimated] = useState(false);

  useEffect(() => {
    const authed = sessionStorage.getItem("nomad-auth") === "true";
    setIsAuthed(authed);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!isAuthed) return;
    const handleScroll = () => {
      setNavScrolled(window.pageYOffset > 50);
      const heroBg = document.querySelector('.hero-bg') as HTMLElement;
      if (heroBg && window.pageYOffset < window.innerHeight) {
        heroBg.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in, .stagger-children').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed || !caseStudyRef.current) return;
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          setGraphAnimated(true);
          setCountersAnimated(true);
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    chartObserver.observe(caseStudyRef.current);
    return () => chartObserver.disconnect();
  }, [isAuthed, countersAnimated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PITCH_PASSWORD) {
      sessionStorage.setItem("nomad-auth", "true");
      setIsAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (checking) {
    return <div className="badia-page" style={{ minHeight: "100vh", background: "#FFFBF7" }} />;
  }

  if (!isAuthed) {
    return (
      <div className="badia-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "#FFFBF7" }}>
        <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <img src="/nomad/mango-logo.png" alt="Mango" style={{ height: "60px", marginBottom: "32px" }} />
          <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px", color: "#1a1816" }}>This pitch is password protected</h1>
          <p style={{ fontSize: "15px", color: "#737373", marginBottom: "32px" }}>Enter the password to view</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              style={{ width: "100%", padding: "14px 16px", fontSize: "16px", border: error ? "2px solid #dc2626" : "1px solid #e8e6e3", borderRadius: "8px", marginBottom: "16px", outline: "none" }}
              autoFocus
            />
            {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "16px", marginTop: "-8px" }}>Incorrect password</p>}
            <button type="submit" style={{ width: "100%", padding: "14px 32px", background: "linear-gradient(135deg, #FF9F66 0%, #FF7A3D 100%)", color: "#fff", fontSize: "15px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 4px 20px rgba(255, 159, 102, 0.4)" }}>
              View Pitch
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="badia-page" style={{ background: "#FFFBF7", minHeight: "100vh" }}>
      {/* Nav */}
      <nav className={`badia-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">
            <img src="/nomad/mango-logo.png" alt="Mango" className="logo-img" />
          </Link>
          <div className="nav-links">
            <a href="#benefits">Benefits</a>
            <a href="#why-mango">Why Mango</a>
            <div className="nav-dropdown">
              <span className="nav-dropdown-trigger">
                Nomad
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className="nav-dropdown-menu">
                <a href="#competitive">Competitive Landscape</a>
                <a href="#strategy">Strategy</a>
                <a href="#creators">Creators</a>
                <a href="#content-ideas">Ideas</a>
              </div>
            </div>
            <a href="#case-study">Case Study</a>
            <a href="#timeline">Timeline</a>
            <a href="#cta" className="nav-cta">Contact</a>
          </div>
          <button className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-links">
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)}>Benefits</a>
            <a href="#why-mango" onClick={() => setMobileMenuOpen(false)}>Why Mango</a>
            <div className="mobile-menu-group">
              <span className="mobile-menu-label">Nomad</span>
              <a href="#competitive" onClick={() => setMobileMenuOpen(false)}>Competitive Landscape</a>
              <a href="#strategy" onClick={() => setMobileMenuOpen(false)}>Strategy</a>
              <a href="#creators" onClick={() => setMobileMenuOpen(false)}>Creators</a>
              <a href="#content-ideas" onClick={() => setMobileMenuOpen(false)}>Ideas</a>
            </div>
            <a href="#case-study" onClick={() => setMobileMenuOpen(false)}>Case Study</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#cta" className="mobile-menu-cta" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="hero-wrapper">
        <div className="hero-bg"></div>
        <div className="hero">
          <div className="hero-inner">
            <div className="hero-prepared">
              <span>Prepared for</span>
              <img src="/nomad/nomad-logo.png" alt="Nomad Cosmetics" className="hero-badia-logo" style={{ height: "20px" }} />
            </div>
            <h1>Turn your loyal community into a <em>social media powerhouse</em></h1>
            <p className="hero-sub">Mango is a creative agency with 11 years of experience in social media management and creator marketing. We&apos;ll transform your existing influencer program into a streamlined daily operation, managing IG, FB, and TikTok while keeping your community engaged and growing.</p>
            <div className="hero-logos">
              <span className="hero-logos-label">Brands hiring Mango creators</span>
              <div className="hero-logos-marquee">
                <div className="hero-logos-track">
                  <img src="/badia/perplexity.jpg" alt="Perplexity" />
                  <img src="/badia/lovable.png" alt="Lovable" />
                  <img src="/badia/quest.png" alt="Quest" />
                  <img src="/badia/yeti.png" alt="YETI" />
                  <img src="/badia/naturemade.png" alt="Nature Made" />
                  <img src="/badia/sony.png" alt="Sony" />
                  <img src="/badia/vita-coco.png" alt="Vita Coco" />
                  <img src="/badia/esteelauder.png" alt="Estee Lauder" />
                  <img src="/badia/david.png" alt="David" />
                  <img src="/badia/outdoorsy.png" alt="Outdoorsy" />
                  <img src="/badia/talkspace.png" alt="Talkspace" />
                  <img src="/badia/perplexity.jpg" alt="Perplexity" />
                  <img src="/badia/lovable.png" alt="Lovable" />
                  <img src="/badia/quest.png" alt="Quest" />
                  <img src="/badia/yeti.png" alt="YETI" />
                  <img src="/badia/naturemade.png" alt="Nature Made" />
                  <img src="/badia/sony.png" alt="Sony" />
                  <img src="/badia/vita-coco.png" alt="Vita Coco" />
                  <img src="/badia/esteelauder.png" alt="Estee Lauder" />
                  <img src="/badia/david.png" alt="David" />
                  <img src="/badia/outdoorsy.png" alt="Outdoorsy" />
                  <img src="/badia/talkspace.png" alt="Talkspace" />
                </div>
              </div>
            </div>
          </div>
          <div className="hero-metrics">
            <div className="metric"><span className="metric-value">400%</span><span className="metric-label">Average ROI</span></div>
            <div className="metric"><span className="metric-value">10K+</span><span className="metric-label">Creators</span></div>
            <div className="metric"><span className="metric-value">105M</span><span className="metric-label">Total reach</span></div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits" id="benefits">
        <div className="benefits-inner">
          <div className="benefits-header">
            <h2>Here&apos;s the problem</h2>
            <p>You&apos;ve built an incredible community and a roster of 100+ creators. But managing daily social, engaging with everyone, and keeping up with trends? That&apos;s a full-time operation that&apos;s pulling focus from your core business.</p>
          </div>
          <div className="benefits-grid stagger-children">
            <div className="benefit">
              <h3>You&apos;re juggling too many platforms</h3>
              <p>IG, FB, TikTok, Stories, DMs, comments. Each platform has its own rhythm. We manage all of them daily so you can focus on product and growth.</p>
            </div>
            <div className="benefit">
              <h3>Your 100+ creators need curation</h3>
              <p>You have incredible UGC from your collaborators, but repurposing it into cohesive, on-brand content takes hours. We curate and optimize every piece.</p>
            </div>
            <div className="benefit">
              <h3>Community engagement is relentless</h3>
              <p>Every DM, every comment, every mention matters. We bring high-energy &quot;spreading the love&quot; engagement daily, keeping your community feeling seen.</p>
            </div>
            <div className="benefit">
              <h3>You&apos;re missing new talent</h3>
              <p>Emerging creators are everywhere, but you don&apos;t have time to scout. We identify rising stars who align with Nomad&apos;s clean, inclusive, travel-inspired aesthetic.</p>
            </div>
            <div className="benefit">
              <h3>Consistency is exhausting</h3>
              <p>18-20 grid posts a month plus daily Stories requires a content engine. We build systems that keep your feed active and beautiful without burnout.</p>
            </div>
            <div className="benefit">
              <h3>Reputation needs protection</h3>
              <p>One wrong comment can spiral. We ensure Nomad remains a positive, inclusive voice in beauty while routing customer service to your team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="problem">
        <div className="problem-inner">
          <div className="problem-text">
            <h2>Social media management is painful</h2>
            <p>You&apos;ve built something special with Nomad&apos;s community. But scaling social while maintaining that authentic connection? That&apos;s where brands get stuck.</p>
            <p>Mango eliminates the chaos. We&apos;ve managed social for brands for over a decade. We know how to maintain voice, curate UGC at scale, and keep communities engaged without losing the personal touch that made Nomad special.</p>
          </div>
          <div className="problem-list stagger-children">
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">Can&apos;t keep up with daily posting</span>
            </div>
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">UGC piling up without being used</span>
            </div>
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">DMs and comments overwhelming</span>
            </div>
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">No time to find new creators</span>
            </div>
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">TikTok feels like another full-time job</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Mango */}
      <section className="why-mango" id="why-mango">
        <div className="why-mango-inner">
          <h2>Why Mango</h2>
          <div className="why-mango-grid stagger-children">
            <div className="why-mango-item">
              <div className="why-mango-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3>AI-powered talent scouting</h3>
              <p>Our AI identifies emerging beauty creators who match Nomad&apos;s aesthetic, discovering fresh talent before they blow up.</p>
            </div>
            <div className="why-mango-item">
              <div className="why-mango-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3>Brand-safe community management</h3>
              <p>Every interaction is thoughtful. We protect Nomad&apos;s reputation while keeping your community feeling loved and seen.</p>
            </div>
            <div className="why-mango-item">
              <div className="why-mango-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3>Daily operations, handled</h3>
              <p>18-20 grid posts, daily Stories, DM responses, comment engagement. We become your social team without the overhead.</p>
            </div>
            <div className="why-mango-item">
              <div className="why-mango-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>UGC curation at scale</h3>
              <p>100+ creators means endless content. We curate, repurpose, and maintain a world-class aesthetic that stays true to Nomad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <h2>One partner for <em>everything</em></h2>
        <div className="services-grid stagger-children">
          <div className="service">
            <span className="service-num">01</span>
            <h3>Daily social management</h3>
            <p>Grid posts, Stories, Reels across IG, FB, and TikTok. We handle the daily rhythm so your feed never goes quiet.</p>
          </div>
          <div className="service">
            <span className="service-num">02</span>
            <h3>Community engagement</h3>
            <p>Every DM, comment, and mention gets attention. We &quot;spread the love&quot; daily with high-energy, authentic engagement.</p>
          </div>
          <div className="service">
            <span className="service-num">03</span>
            <h3>Creator curation</h3>
            <p>We curate content from your 100+ collaborators, repurposing UGC into cohesive, on-brand posts that feel premium.</p>
          </div>
          <div className="service">
            <span className="service-num">04</span>
            <h3>Talent scouting</h3>
            <p>Fresh faces for the Nomad family. We identify emerging creators who embody your clean, inclusive, travel-inspired vibe.</p>
          </div>
        </div>
      </section>

      {/* Competitive Analysis */}
      <section className="competitive" id="competitive">
        <div className="competitive-inner">
          <div className="competitive-header">
            <h2>Competitive analysis</h2>
            <p>What leading beauty brands are doing on social, and what&apos;s working.</p>
          </div>
          <div className="competitive-grid stagger-children">
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/nomad/rarebeauty-logo.png" alt="Rare Beauty" className="competitive-logo" style={{ height: "28px" }} />
                <span className="competitive-tag">TikTok favorite</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">$400M</span>
                  <span className="stat-label">2024 revenue</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">406K</span>
                  <span className="stat-label">UGC videos</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>Prioritized micro-creators over macro-influencers. Let the Soft Pinch Liquid Blush go viral through organic creator discovery rather than campaigns. Selena appears as narrator, not star, making the brand bigger than the founder.</p>
                <h4>Key insight</h4>
                <p>Creator-led product discovery beats traditional marketing. 98% of their ad conversions come from creator content, not brand content.</p>
              </div>
            </div>
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/nomad/glossier-logo.png" alt="Glossier" className="competitive-logo" />
                <span className="competitive-tag">Community pioneer</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">3M+</span>
                  <span className="stat-label">IG followers</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">10.2%</span>
                  <span className="stat-label">Engagement rate</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>Built social as a community channel first, distribution second. Replies to every mention, reposts real customers constantly. Brand ambassadors have just 300-5,000 followers, not mega-influencers.</p>
                <h4>Key insight</h4>
                <p>Your customers are your best salespeople. They turned fans into a marketing army through consistent community love.</p>
              </div>
            </div>
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/nomad/colourpop-logo.svg" alt="ColourPop" className="competitive-logo" style={{ height: "28px" }} />
                <span className="competitive-tag">Engagement king</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">10M</span>
                  <span className="stat-label">IG followers</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">6.1%</span>
                  <span className="stat-label">UGC engagement</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>Posts 6x per day, tags creators on every post, and repurposes UGC constantly. Generated $159M in earned media value through 2,000+ tracked creator relationships.</p>
                <h4>Key insight</h4>
                <p>Volume + attribution = growth. By crediting creators publicly, they incentivize more content and build loyalty simultaneously.</p>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="competitive-recommendation">
            <div className="recommendation-header">
              <img src="/nomad/nomad-logo.png" alt="Nomad Cosmetics" className="recommendation-logo" style={{ height: "32px", filter: "invert(1) brightness(2)" }} />
              <h3>Our recommendation</h3>
            </div>
            <div className="recommendation-content">
              <div className="recommendation-text">
                <p><strong>Transform your 100+ creators into a content engine that rivals the biggest beauty brands.</strong></p>
                <p>Nomad has what these competitors spent years building: a loyal community and an existing creator roster. Glossier&apos;s 10.2% engagement comes from relentless community love. ColourPop&apos;s $159M earned media comes from smart UGC curation. Rare Beauty&apos;s $400M revenue comes from letting creators drive discovery.</p>
                <p>You already have the foundation. The opportunity is to systematize it, curate it beautifully, and scale it across platforms.</p>
                <p><strong>The data supports this:</strong></p>
                <ul>
                  <li>89% of TikTok users purchased beauty products they discovered on the platform</li>
                  <li>Beauty brands see 3.6x ROI on influencer marketing spend</li>
                  <li>78% of beauty marketers say engagement rate is their most important metric</li>
                  <li>Creator content drives 27% more in-store traffic than brand content</li>
                </ul>
                <p><strong>Own the &quot;wanderlust beauty&quot; space. Nomad&apos;s travel-inspired positioning is unique, lean into it.</strong></p>
              </div>
              <div className="recommendation-actions">
                <div className="action-item"><span className="action-num">1</span><span className="action-text">Systematize daily social (18-20 posts/month + Stories) with consistent aesthetic</span></div>
                <div className="action-item"><span className="action-num">2</span><span className="action-text">Build UGC curation system for your 100+ creators, repurpose everything</span></div>
                <div className="action-item"><span className="action-num">3</span><span className="action-text">Launch TikTok with travel-themed content series native to the platform</span></div>
                <div className="action-item"><span className="action-num">4</span><span className="action-text">Scale creator roster by scouting emerging talent who match your aesthetic</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="strategy" id="strategy">
        <div className="strategy-header">
          <h2>Recommended strategy</h2>
          <p>Glossier built a $1.8B brand by treating social as community first, distribution second. ColourPop generates $159M in earned media by relentlessly curating and crediting creator content. The playbook is clear: systematize community love, curate UGC beautifully, and let your creators do the selling.</p>
        </div>
        <div className="strategy-cols stagger-children">
          <div className="strategy-col">
            <span className="strategy-label">Daily Social</span>
            <h3>Always-on presence</h3>
            <p>18-20 grid posts per month, daily Stories, active community engagement. We maintain Nomad&apos;s premium, travel-inspired aesthetic while keeping the feed active and fresh. Every piece of content curated for cohesion.</p>
            <span className="strategy-use">Best for: Brand consistency, community growth, daily engagement</span>
          </div>
          <div className="strategy-col dark">
            <span className="strategy-label">UGC Engine</span>
            <h3>Creator content at scale</h3>
            <p>Your 100+ collaborators create incredible content. We curate, repurpose, and optimize it for each platform. Light content creation fills gaps. The result: a world-class feed powered by authentic voices.</p>
            <span className="strategy-use">Best for: Authenticity, volume, cost efficiency</span>
          </div>
        </div>
        <div className="strategy-viral-wrapper">
          <div className="strategy-col viral">
            <span className="strategy-label">TikTok Launch</span>
            <h3>#NomadDestination Series</h3>
            <p>Each palette has a story. Launch TikTok with destination-themed content: &quot;Pack for Paris&quot; tutorials, &quot;Chamonix glam&quot; GRWMs, travel-inspired looks. Creators show how Nomad fits their adventures. Built-in hook: where will you go next?</p>
            <span className="strategy-use">Best for: Platform expansion, Gen Z reach, viral potential</span>
          </div>
        </div>
      </section>

      {/* Creators */}
      <section className="creators" id="creators">
        <h2>Creator example</h2>
        <p className="creators-sub">Versatile UGC creators like Maya Herring</p>
        <div className="maya-grid">
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <img src="/nomad/maya.jpg" alt="Maya Herring" style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0, color: "#1a1816" }}>Maya Herring</h3>
                <p style={{ fontSize: "14px", color: "#737373", margin: "4px 0 0" }}>UGC Creator + Strategist · Texas</p>
              </div>
            </div>
            <p style={{ fontSize: "15px", color: "#525252", lineHeight: 1.6, margin: "0 0 16px" }}>Maya specializes in story-first videos that build trust and convert. With <strong>200+ brand partnerships</strong> including Birkenstock, Function of Beauty, and Ultra Violette, she understands how to showcase beauty products authentically.</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", padding: "6px 12px", background: "#f5f5f5", borderRadius: "20px", color: "#525252" }}>Talking Head</span>
              <span style={{ fontSize: "12px", padding: "6px 12px", background: "#f5f5f5", borderRadius: "20px", color: "#525252" }}>Demonstration</span>
              <span style={{ fontSize: "12px", padding: "6px 12px", background: "#f5f5f5", borderRadius: "20px", color: "#525252" }}>Lifestyle</span>
              <span style={{ fontSize: "12px", padding: "6px 12px", background: "#f5f5f5", borderRadius: "20px", color: "#525252" }}>Travel</span>
            </div>
            <video src="/nomad/maya-herring.mp4" controls autoPlay muted loop playsInline style={{ width: "100%", borderRadius: "12px", marginTop: "20px" }} />
          </div>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#FF7A3D", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Why she&apos;s perfect for Nomad</h4>
            <ul style={{ fontSize: "15px", color: "#525252", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
              <li>Travel content expertise matches Nomad&apos;s destination-themed palettes</li>
              <li>Creates authentic &quot;Pack With Me&quot; and GRWM content native to TikTok</li>
              <li>One casual video hit <strong>500K views</strong> and <strong>80K interactions</strong></li>
              <li>Merges creative direction with conversion strategy</li>
              <li>Experience with beauty and lifestyle brands</li>
            </ul>
            <a href="https://www.mayaherring.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "20px", padding: "12px 24px", background: "linear-gradient(135deg, #FF9F66 0%, #FF7A3D 100%)", color: "#fff", fontSize: "14px", fontWeight: 600, border: "none", borderRadius: "8px", textDecoration: "none" }}>
              View portfolio →
            </a>
          </div>
        </div>
      </section>

      {/* Content Ideas */}
      <section className="content-ideas" id="content-ideas">
        <div className="content-ideas-inner">
          <div className="content-ideas-header">
            <h2>Content ideas for Nomad</h2>
            <div className="content-ideas-intro">
              <p>Nomad&apos;s tagline is <strong>&quot;Universal Beauty, Locally Inspired.&quot;</strong> Every piece of content should celebrate the intersection of travel, discovery, and beauty. These concepts leverage your existing creators while establishing a distinctive presence on TikTok.</p>
            </div>
          </div>
          <div className="content-ideas-grid stagger-children">
            <div className="content-idea"><span className="idea-num">01</span><h3>&quot;Pack With Me&quot; series</h3><p>Creators show their travel makeup bag featuring Nomad products. Where are they going? What palettes match the destination? Built-in wanderlust content that travels well across platforms.</p></div>
            <div className="content-idea"><span className="idea-num">02</span><h3>&quot;Destination GRWM&quot;</h3><p>Get Ready With Me videos themed around Nomad&apos;s palette destinations. Paris brunch look. Chamonix après-ski glam. Chicago speakeasy vibes. Each video is a mini travel story.</p></div>
            <div className="content-idea"><span className="idea-num">03</span><h3>&quot;Local&apos;s Guide&quot; UGC</h3><p>Creators from different cities show how they use Nomad daily. A Parisian doing her morning routine. A Tokyo creator&apos;s night-out look. Global community, local stories.</p></div>
            <div className="content-idea"><span className="idea-num">04</span><h3>&quot;Clean Beauty Check&quot;</h3><p>Short-form content breaking down what makes Nomad clean, vegan, and 1% for the Planet. Education meets advocacy. Position Nomad as the informed choice.</p></div>
            <div className="content-idea"><span className="idea-num">05</span><h3>&quot;Palette Personality&quot;</h3><p>Which Nomad palette matches your travel style? Beach bum? City explorer? Mountain escape? Quiz-style content that drives engagement and product discovery.</p></div>
            <div className="content-idea"><span className="idea-num">06</span><h3>&quot;Behind the Destination&quot;</h3><p>How did Nomad design each palette? What inspiration came from visiting the real location? Storytelling content that deepens connection to the brand.</p></div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline" id="timeline">
        <div className="timeline-inner">
          <div className="timeline-header">
            <h2>Typical timeline</h2>
            <p>From kickoff to full daily management in 4 weeks. We&apos;ll learn your voice, systematize your content, and build the engine.</p>
          </div>
          <div className="timeline-steps stagger-children">
            <div className="timeline-step"><span className="timeline-week">Week 1</span><h3>Immersion</h3><p>Deep dive into Nomad&apos;s brand, voice, aesthetic. Audit existing content and creator roster. Build content calendar framework.</p></div>
            <div className="timeline-step"><span className="timeline-week">Week 2</span><h3>Systems Setup</h3><p>Set up content pipelines, approval workflows, community management protocols. Organize UGC from 100+ creators.</p></div>
            <div className="timeline-step"><span className="timeline-week">Week 3</span><h3>Soft Launch</h3><p>Begin posting with founder approval on each piece. Test engagement strategies. Refine voice and aesthetic.</p></div>
            <div className="timeline-step"><span className="timeline-week">Week 4</span><h3>Full Operations</h3><p>Daily posting and engagement begins. Community management active. Weekly reporting starts.</p></div>
            <div className="timeline-step"><span className="timeline-week">Week 5+</span><h3>Scale & Optimize</h3><p>TikTok launch, talent scouting active, continuous optimization based on performance data.</p></div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="case-study" id="case-study" ref={caseStudyRef}>
        <div className="case-study-inner">
          <div className="case-study-text">
            <span className="case-study-label">Case Study</span>
            <h2>0 to 45M views<br/>in 90 days</h2>
            <p>A brand that had never run creator campaigns. We built their entire social and UGC program from scratch.</p>
            <div className="case-study-results">
              <div className="result"><span className="result-value"><Counter target={45} animated={countersAnimated} />M</span><span className="result-label">Views</span></div>
              <div className="result"><span className="result-value"><Counter target={700} animated={countersAnimated} />%</span><span className="result-label">ROI</span></div>
              <div className="result"><span className="result-value">$<Counter target={300} animated={countersAnimated} />K</span><span className="result-label">Revenue</span></div>
            </div>
          </div>
          <div className="case-study-graph">
            <div className="graph-header"><span className="graph-title">Views over 90 days</span></div>
            <div className="graph-area">
              <div className="graph-y-axis"><span>45M</span><span>30M</span><span>15M</span><span>0</span></div>
              <div className="graph-canvas">
                <svg viewBox="0 0 300 150" preserveAspectRatio="none" className="graph-svg">
                  <line x1="0" y1="37.5" x2="300" y2="37.5" stroke="#e8e6e3" strokeWidth="1" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke="#e8e6e3" strokeWidth="1" />
                  <line x1="0" y1="112.5" x2="300" y2="112.5" stroke="#e8e6e3" strokeWidth="1" />
                  <polyline className={`graph-line views-line ${graphAnimated ? 'animated' : ''}`} points="0,145 100,120 200,60 300,8" fill="none" stroke="#FF9F66" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="graph-x-axis"><span>Week 1</span><span>Week 4</span><span>Week 8</span><span>Week 12</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="cta">
        <h2>Let&apos;s talk</h2>
        <p>Ready to turn your community into a social media powerhouse?</p>
        <a href="mailto:rj@onghost.com?subject=Nomad Cosmetics x Mango" className="cta-btn">Get in touch</a>
        <div className="cta-contact">
          <span className="cta-name">R.J. Napolitano</span>
          <span className="cta-divider">·</span>
          <span className="cta-title">CEO, Mango</span>
          <span className="cta-divider">·</span>
          <a href="mailto:rj@onghost.com">rj@onghost.com</a>
          <span className="cta-divider">·</span>
          <a href="tel:+12676646640">(267) 664-6640</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="badia-footer">
        <span className="footer-logo"><img src="/nomad/mango-logo.png" alt="Mango" className="footer-img" /></span>
        <span className="footer-note">Prepared for <img src="/nomad/nomad-logo.png" alt="Nomad Cosmetics" className="footer-badia-logo" style={{ height: "24px" }} /></span>
      </footer>
    </div>
  );
}
