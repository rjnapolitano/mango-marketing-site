// ============================================
// PITCH PAGE TEMPLATE
// Copy this file to /app/[brand-slug]/page.tsx
// Replace all {{PLACEHOLDER}} values
// ============================================

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// {{BRAND_PASSWORD}} - Format: [brand]2026!
const PITCH_PASSWORD = "{{BRAND_SLUG}}2026!";

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

export default function PitchPage() {
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
    const authed = sessionStorage.getItem("{{BRAND_SLUG}}-auth") === "true";
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
      sessionStorage.setItem("{{BRAND_SLUG}}-auth", "true");
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
          <img src="/{{BRAND_SLUG}}/mango-logo.png" alt="Mango" style={{ height: "60px", marginBottom: "32px" }} />
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
            <img src="/{{BRAND_SLUG}}/mango-logo.png" alt="Mango" className="logo-img" />
          </Link>
          <div className="nav-links">
            <a href="#benefits">Benefits</a>
            <a href="#why-mango">Why Mango</a>
            <div className="nav-dropdown">
              <span className="nav-dropdown-trigger">
                {{BRAND_NAME}}
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
              <span className="mobile-menu-label">{{BRAND_NAME}}</span>
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
              <img src="/{{BRAND_SLUG}}/{{BRAND_SLUG}}-logo.svg" alt="{{BRAND_NAME}}" className="hero-badia-logo" />
            </div>
            <h1>The fastest way to scale <em>authentic</em> creator content</h1>
            <p className="hero-sub">Mango is a creative agency with 11 years of experience in creator ads and paid advertising. We handle everything end-to-end: finding creators, managing relationships, producing content, and amplifying it through paid media.</p>
            {/* Logo marquee - keep as is */}
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

      {/* Benefits - customize problems for the industry */}
      <section className="benefits" id="benefits">
        <div className="benefits-inner">
          <div className="benefits-header">
            <h2>Here&apos;s the problem</h2>
            <p>{{BENEFITS_SUBHEADER}}</p>
          </div>
          <div className="benefits-grid stagger-children">
            {/* {{BENEFIT_1}} */}
            <div className="benefit">
              <h3>{{BENEFIT_1_TITLE}}</h3>
              <p>{{BENEFIT_1_DESC}}</p>
            </div>
            {/* {{BENEFIT_2}} */}
            <div className="benefit">
              <h3>{{BENEFIT_2_TITLE}}</h3>
              <p>{{BENEFIT_2_DESC}}</p>
            </div>
            {/* {{BENEFIT_3}} */}
            <div className="benefit">
              <h3>{{BENEFIT_3_TITLE}}</h3>
              <p>{{BENEFIT_3_DESC}}</p>
            </div>
            {/* {{BENEFIT_4}} */}
            <div className="benefit">
              <h3>{{BENEFIT_4_TITLE}}</h3>
              <p>{{BENEFIT_4_DESC}}</p>
            </div>
            {/* {{BENEFIT_5}} */}
            <div className="benefit">
              <h3>{{BENEFIT_5_TITLE}}</h3>
              <p>{{BENEFIT_5_DESC}}</p>
            </div>
            {/* {{BENEFIT_6}} */}
            <div className="benefit">
              <h3>{{BENEFIT_6_TITLE}}</h3>
              <p>{{BENEFIT_6_DESC}}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Mango - keep as is */}
      <section className="why-mango" id="why-mango">
        <div className="why-mango-inner">
          <h2>Why Mango</h2>
          <div className="why-mango-grid stagger-children">
            <div className="why-mango-item">
              <div className="why-mango-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3>AI-powered discovery</h3>
              <p>Our AI identifies perfect-fit creators, trending content formats, and runs competitive research, so you&apos;re always one step ahead.</p>
            </div>
            <div className="why-mango-item">
              <div className="why-mango-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3>Brand safe creators</h3>
              <p>Every creator is vetted for brand safety. No surprises, no risk, just partners who align with your values.</p>
            </div>
            <div className="why-mango-item">
              <div className="why-mango-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3>Weeks, not months</h3>
              <p>Launch campaigns in weeks instead of months. We move fast because the relationships and playbooks are already in place.</p>
            </div>
            <div className="why-mango-item">
              <div className="why-mango-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>We handle everything</h3>
              <p>Tracking, payouts, contracts, revisions, reporting, all managed by us. You focus on your brand, we handle the rest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services - customize for industry */}
      <section className="services">
        <h2>One partner for <em>everything</em></h2>
        <div className="services-grid stagger-children">
          <div className="service">
            <span className="service-num">01</span>
            <h3>Creator identification</h3>
            <p>AI matches {{BRAND_NAME}} with {{CREATOR_TYPES}} creators from our 10,000+ roster in seconds.</p>
          </div>
          <div className="service">
            <span className="service-num">02</span>
            <h3>Management</h3>
            <p>We handle negotiations, contracts, and relationships. Mango manages deals from intro to close.</p>
          </div>
          <div className="service">
            <span className="service-num">03</span>
            <h3>Content creation</h3>
            <p>UGC for paid media plus authentic influencer posts. Volume and quality at scale.</p>
          </div>
          <div className="service">
            <span className="service-num">04</span>
            <h3>Paid amplification</h3>
            <p>We run the top-performing creator content through paid channels to maximize ROI.</p>
          </div>
        </div>
      </section>

      {/* Competitive Analysis - {{COMPETITORS}} */}
      <section className="competitive" id="competitive">
        <div className="competitive-inner">
          <div className="competitive-header">
            <h2>Competitive analysis</h2>
            <p>What {{BRAND_NAME}}&apos;s competitors are doing in creator marketing, and what&apos;s working.</p>
          </div>
          <div className="competitive-grid stagger-children">
            {/* COMPETITOR 1 */}
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/{{BRAND_SLUG}}/{{COMPETITOR_1_SLUG}}-logo.png" alt="{{COMPETITOR_1_NAME}}" className="competitive-logo" />
                <span className="competitive-tag">{{COMPETITOR_1_TAG}}</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">{{COMPETITOR_1_STAT_1_VALUE}}</span>
                  <span className="stat-label">{{COMPETITOR_1_STAT_1_LABEL}}</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">{{COMPETITOR_1_STAT_2_VALUE}}</span>
                  <span className="stat-label">{{COMPETITOR_1_STAT_2_LABEL}}</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>{{COMPETITOR_1_WHAT}}</p>
                <h4>Key insight</h4>
                <p>{{COMPETITOR_1_INSIGHT}}</p>
              </div>
            </div>

            {/* COMPETITOR 2 */}
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/{{BRAND_SLUG}}/{{COMPETITOR_2_SLUG}}-logo.png" alt="{{COMPETITOR_2_NAME}}" className="competitive-logo" />
                <span className="competitive-tag">{{COMPETITOR_2_TAG}}</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">{{COMPETITOR_2_STAT_1_VALUE}}</span>
                  <span className="stat-label">{{COMPETITOR_2_STAT_1_LABEL}}</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">{{COMPETITOR_2_STAT_2_VALUE}}</span>
                  <span className="stat-label">{{COMPETITOR_2_STAT_2_LABEL}}</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>{{COMPETITOR_2_WHAT}}</p>
                <h4>Key insight</h4>
                <p>{{COMPETITOR_2_INSIGHT}}</p>
              </div>
            </div>

            {/* COMPETITOR 3 */}
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/{{BRAND_SLUG}}/{{COMPETITOR_3_SLUG}}-logo.png" alt="{{COMPETITOR_3_NAME}}" className="competitive-logo" />
                <span className="competitive-tag">{{COMPETITOR_3_TAG}}</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">{{COMPETITOR_3_STAT_1_VALUE}}</span>
                  <span className="stat-label">{{COMPETITOR_3_STAT_1_LABEL}}</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">{{COMPETITOR_3_STAT_2_VALUE}}</span>
                  <span className="stat-label">{{COMPETITOR_3_STAT_2_LABEL}}</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>{{COMPETITOR_3_WHAT}}</p>
                <h4>Key insight</h4>
                <p>{{COMPETITOR_3_INSIGHT}}</p>
              </div>
            </div>

            {/* Add more competitors as needed */}
          </div>

          {/* Recommendation */}
          <div className="competitive-recommendation">
            <div className="recommendation-header">
              <img src="/{{BRAND_SLUG}}/{{BRAND_SLUG}}-logo.svg" alt="{{BRAND_NAME}}" className="recommendation-logo" />
              <h3>Our recommendation</h3>
            </div>
            <div className="recommendation-content">
              <div className="recommendation-text">
                <p><strong>{{RECOMMENDATION_HEADLINE}}</strong></p>
                <p>{{RECOMMENDATION_BODY}}</p>
                <p><strong>The data supports this:</strong></p>
                <ul>
                  <li>{{DATA_POINT_1}}</li>
                  <li>{{DATA_POINT_2}}</li>
                  <li>{{DATA_POINT_3}}</li>
                  <li>{{DATA_POINT_4}}</li>
                </ul>
                <p><strong>{{RECOMMENDATION_CTA}}</strong></p>
              </div>
              <div className="recommendation-actions">
                <div className="action-item"><span className="action-num">1</span><span className="action-text">{{ACTION_1}}</span></div>
                <div className="action-item"><span className="action-num">2</span><span className="action-text">{{ACTION_2}}</span></div>
                <div className="action-item"><span className="action-num">3</span><span className="action-text">{{ACTION_3}}</span></div>
                <div className="action-item"><span className="action-num">4</span><span className="action-text">{{ACTION_4}}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="strategy" id="strategy">
        <div className="strategy-header">
          <h2>Recommended strategy</h2>
          <p>{{STRATEGY_INTRO}}</p>
        </div>
        <div className="strategy-cols stagger-children">
          <div className="strategy-col">
            <span className="strategy-label">UGC Content</span>
            <h3>High-volume ad creative</h3>
            <p>{{UGC_DESCRIPTION}}</p>
            <span className="strategy-use">Best for: Paid ads, retargeting, always-on creative</span>
          </div>
          <div className="strategy-col dark">
            <span className="strategy-label">Influencer Posts</span>
            <h3>Authentic reach</h3>
            <p>{{INFLUENCER_DESCRIPTION}}</p>
            <span className="strategy-use">Best for: Awareness, trust, organic reach</span>
          </div>
        </div>
        <div className="strategy-viral-wrapper">
          <div className="strategy-col viral">
            <span className="strategy-label">Viral Play</span>
            <h3>{{VIRAL_CAMPAIGN_NAME}}</h3>
            <p>{{VIRAL_CAMPAIGN_DESC}}</p>
            <span className="strategy-use">Best for: Virality, brand awareness, Gen Z reach</span>
          </div>
        </div>
      </section>

      {/* Creators */}
      <section className="creators" id="creators">
        <h2>Examples of creators that meet {{BRAND_NAME}}&apos;s goals</h2>
        <p className="creators-sub">Authentic voices with highly engaged followings in {{INDUSTRY}}</p>
        <div className="creators-grid stagger-children">
          {/* CREATOR 1 */}
          <div className="creator">
            <div className="creator-video">
              <iframe src="{{CREATOR_1_EMBED}}" frameBorder="0" allow="autoplay" allowFullScreen></iframe>
              <span className="video-placeholder">Video embed</span>
            </div>
            <div className="creator-details">
              <div className="creator-info">
                <span className="creator-name">{{CREATOR_1_NAME}}</span>
                <span className="creator-handle">{{CREATOR_1_HANDLE}}</span>
                <span className="creator-meta">{{CREATOR_1_FOLLOWERS}} followers · {{CREATOR_1_PLATFORM}}</span>
              </div>
              <p className="creator-why">Why they fit: {{CREATOR_1_WHY}}</p>
            </div>
          </div>
          {/* CREATOR 2 */}
          <div className="creator">
            <div className="creator-video">
              <iframe src="{{CREATOR_2_EMBED}}" frameBorder="0" allow="autoplay" allowFullScreen></iframe>
              <span className="video-placeholder">Video embed</span>
            </div>
            <div className="creator-details">
              <div className="creator-info">
                <span className="creator-name">{{CREATOR_2_NAME}}</span>
                <span className="creator-handle">{{CREATOR_2_HANDLE}}</span>
                <span className="creator-meta">{{CREATOR_2_FOLLOWERS}} followers · {{CREATOR_2_PLATFORM}}</span>
              </div>
              <p className="creator-why">Why they fit: {{CREATOR_2_WHY}}</p>
            </div>
          </div>
          {/* CREATOR 3 */}
          <div className="creator">
            <div className="creator-video">
              <iframe src="{{CREATOR_3_EMBED}}" frameBorder="0" allow="autoplay" allowFullScreen></iframe>
              <span className="video-placeholder">Video embed</span>
            </div>
            <div className="creator-details">
              <div className="creator-info">
                <span className="creator-name">{{CREATOR_3_NAME}}</span>
                <span className="creator-handle">{{CREATOR_3_HANDLE}}</span>
                <span className="creator-meta">{{CREATOR_3_FOLLOWERS}} followers · {{CREATOR_3_PLATFORM}}</span>
              </div>
              <p className="creator-why">Why they fit: {{CREATOR_3_WHY}}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Ideas */}
      <section className="content-ideas" id="content-ideas">
        <div className="content-ideas-inner">
          <div className="content-ideas-header">
            <h2>Content ideas for {{BRAND_NAME}}</h2>
            <div className="content-ideas-intro">
              <p>{{CONTENT_IDEAS_INTRO}}</p>
            </div>
          </div>
          <div className="content-ideas-grid stagger-children">
            <div className="content-idea"><span className="idea-num">01</span><h3>{{IDEA_1_TITLE}}</h3><p>{{IDEA_1_DESC}}</p></div>
            <div className="content-idea"><span className="idea-num">02</span><h3>{{IDEA_2_TITLE}}</h3><p>{{IDEA_2_DESC}}</p></div>
            <div className="content-idea"><span className="idea-num">03</span><h3>{{IDEA_3_TITLE}}</h3><p>{{IDEA_3_DESC}}</p></div>
            <div className="content-idea"><span className="idea-num">04</span><h3>{{IDEA_4_TITLE}}</h3><p>{{IDEA_4_DESC}}</p></div>
            <div className="content-idea"><span className="idea-num">05</span><h3>{{IDEA_5_TITLE}}</h3><p>{{IDEA_5_DESC}}</p></div>
            <div className="content-idea"><span className="idea-num">06</span><h3>{{IDEA_6_TITLE}}</h3><p>{{IDEA_6_DESC}}</p></div>
          </div>
        </div>
      </section>

      {/* Timeline - keep as is */}
      <section className="timeline" id="timeline">
        <div className="timeline-inner">
          <div className="timeline-header">
            <h2>Typical timeline</h2>
            <p>From kickoff to live content in 5 weeks. Timeline can vary based on number of creators and campaign scope.</p>
          </div>
          <div className="timeline-steps stagger-children">
            <div className="timeline-step"><span className="timeline-week">Week 1</span><h3>Kickoff & Strategy</h3><p>Understand goals, review brand guidelines, present campaign brief, finalize creative direction</p></div>
            <div className="timeline-step"><span className="timeline-week">Week 2</span><h3>Creator Sourcing</h3><p>AI-powered creator discovery, outreach to top matches, negotiate terms</p></div>
            <div className="timeline-step"><span className="timeline-week">Week 3</span><h3>Creator Approval</h3><p>Present creator shortlist, finalize partnerships, send briefs to approved creators</p></div>
            <div className="timeline-step"><span className="timeline-week">Week 4</span><h3>Content Review</h3><p>Creators submit drafts, review and request revisions, approve final content</p></div>
            <div className="timeline-step"><span className="timeline-week">Week 5</span><h3>Go Live</h3><p>Content posted, paid amplification begins, performance tracking starts</p></div>
          </div>
        </div>
      </section>

      {/* Case Study - keep as is */}
      <section className="case-study" id="case-study" ref={caseStudyRef}>
        <div className="case-study-inner">
          <div className="case-study-text">
            <span className="case-study-label">Case Study</span>
            <h2>0 to 45M views<br/>in 90 days</h2>
            <p>A brand that had never run creator ads. We built their entire UGC program from scratch.</p>
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
        <p>Ready to scale creator marketing for {{BRAND_NAME}}?</p>
        <a href="mailto:rj@onghost.com?subject={{BRAND_NAME}} x Mango" className="cta-btn">Get in touch</a>
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
        <span className="footer-logo"><img src="/{{BRAND_SLUG}}/mango-logo.png" alt="Mango" className="footer-img" /></span>
        <span className="footer-note">Prepared for <img src="/{{BRAND_SLUG}}/{{BRAND_SLUG}}-logo.svg" alt="{{BRAND_NAME}}" className="footer-badia-logo" /></span>
      </footer>
    </div>
  );
}
