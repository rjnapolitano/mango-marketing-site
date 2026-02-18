"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PITCH_PASSWORD = "badia2026!";

export default function BadiaPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  const [navScrolled, setNavScrolled] = useState(false);
  const caseStudyRef = useRef<HTMLElement>(null);
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [graphAnimated, setGraphAnimated] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const authed = sessionStorage.getItem("badia-auth") === "true";
    setIsAuthed(authed);
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PITCH_PASSWORD) {
      sessionStorage.setItem("badia-auth", "true");
      setIsAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Password gate UI
  if (checking) {
    return <div className="badia-page" style={{ minHeight: "100vh" }} />;
  }

  if (!isAuthed) {
    return (
      <div className="badia-page" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          maxWidth: "400px",
          width: "100%",
          textAlign: "center"
        }}>
          <img
            src="/badia/mango-logo.png"
            alt="Mango"
            style={{ height: "60px", marginBottom: "32px" }}
          />
          <h1 style={{
            fontSize: "24px",
            fontWeight: 600,
            marginBottom: "8px",
            color: "#1a1816"
          }}>
            This pitch is password protected
          </h1>
          <p style={{
            fontSize: "15px",
            color: "#737373",
            marginBottom: "32px"
          }}>
            Enter the password to view
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "16px",
                border: error ? "2px solid #dc2626" : "1px solid #e8e6e3",
                borderRadius: "8px",
                marginBottom: "16px",
                outline: "none",
                transition: "border-color 0.15s ease"
              }}
              autoFocus
            />
            {error && (
              <p style={{
                color: "#dc2626",
                fontSize: "14px",
                marginBottom: "16px",
                marginTop: "-8px"
              }}>
                Incorrect password
              </p>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #FF9F66 0%, #FF7A3D 100%)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(255, 159, 102, 0.4)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease"
              }}
            >
              View Pitch
            </button>
          </form>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Nav scroll effect
    const handleScroll = () => {
      setNavScrolled(window.pageYOffset > 50);

      // Hero parallax
      const heroBg = document.querySelector('.hero-bg') as HTMLElement;
      if (heroBg && window.pageYOffset < window.innerHeight) {
        heroBg.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .stagger-children').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Case study graph and counter animation
  useEffect(() => {
    if (!caseStudyRef.current) return;

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
  }, [countersAnimated]);

  // Counter component
  const Counter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!countersAnimated) return;

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
    }, [target, countersAnimated]);

    return <>{count}{suffix}</>;
  };

  return (
    <div className="badia-page">
      {/* Nav */}
      <nav className={`badia-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">
            <img src="/badia/mango-logo.png" alt="Mango" className="logo-img" />
          </Link>
          <div className="nav-links">
            <a href="#benefits">Benefits</a>
            <a href="#why-mango">Why Mango</a>
            <div className="nav-dropdown">
              <span className="nav-dropdown-trigger">
                Badia
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
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-wrapper">
        <div className="hero-bg"></div>
        <div className="hero">
          <div className="hero-inner">
            <div className="hero-prepared">
              <span>Prepared for</span>
              <img src="/badia/badia-logo.svg" alt="Badia" className="hero-badia-logo" />
            </div>
            <h1>The fastest way to scale <em>authentic</em> creator content</h1>
            <p className="hero-sub">Mango is a creative agency with 11 years of experience in creator ads and paid advertising. We handle everything end-to-end: finding creators, managing relationships, producing content, and amplifying it through paid media.</p>
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
                  {/* Duplicate for seamless loop */}
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
            <div className="metric">
              <span className="metric-value">400%</span>
              <span className="metric-label">Average ROI</span>
            </div>
            <div className="metric">
              <span className="metric-value">10K+</span>
              <span className="metric-label">Creators</span>
            </div>
            <div className="metric">
              <span className="metric-value">105M</span>
              <span className="metric-label">Total reach</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits" id="benefits">
        <div className="benefits-inner">
          <div className="benefits-header">
            <h2>Here&apos;s the problem</h2>
            <p>You know creator content converts. Your competitors are running it. But doing it yourself? That&apos;s where brands get stuck.</p>
          </div>
          <div className="benefits-grid stagger-children">
            <div className="benefit">
              <h3>You&apos;re sending 100 DMs to get 3 replies</h3>
              <p>We have 10,000+ creators on speed dial. Relationships already built. No cold outreach. No ghosting. We text them, they respond.</p>
            </div>
            <div className="benefit">
              <h3>You&apos;re guessing who will convert</h3>
              <p>We&apos;ve run 11 years of campaigns. We know which creators drive sales and which just drive likes. You get the ones that actually move product.</p>
            </div>
            <div className="benefit">
              <h3>You&apos;re drowning in logistics</h3>
              <p>Contracts. Payments. Revisions. Deadlines. That&apos;s not your job. We handle every detail. You just approve content and watch it perform.</p>
            </div>
            <div className="benefit">
              <h3>You&apos;re paying for content that sits in a folder</h3>
              <p>We don&apos;t just make content. We run it through paid media, A/B test it, and scale what works. Your content actually gets seen.</p>
            </div>
            <div className="benefit">
              <h3>You&apos;re flying blind on results</h3>
              <p>Most agencies give you vanity metrics. We show you what&apos;s driving revenue. Every dollar tracked. Every creator measured. No guessing.</p>
            </div>
            <div className="benefit">
              <h3>You&apos;re doing this with a skeleton crew</h3>
              <p>Hiring a team costs $300K+/year. Or you can plug into ours. Same output. Fraction of the cost. Live in weeks, not months.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="problem">
        <div className="problem-inner">
          <div className="problem-text">
            <h2>Creator marketing is painful</h2>
            <p>Most brands know they need creator content. But doing it in-house means endless DMs with no responses, guessing which creators will actually convert, and spending hours on briefs that don&apos;t land.</p>
            <p>Mango eliminates the guesswork. Our team has run creator campaigns for 11 years, we know who to reach out to, what campaigns convert, and how to write briefs that get results. With a roster of 10,000 creators and over 100,000 in our direct network, we have the relationships already built.</p>
          </div>
          <div className="problem-list stagger-children">
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">Endless messaging, no responses</span>
            </div>
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">Not sure who to reach out to</span>
            </div>
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">Don&apos;t know what campaigns convert</span>
            </div>
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">Unclear on best practices</span>
            </div>
            <div className="problem-item">
              <span className="problem-icon">✕</span>
              <span className="problem-desc">Struggle to write content briefs</span>
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

      {/* Services */}
      <section className="services">
        <h2>One partner for <em>everything</em></h2>
        <div className="services-grid stagger-children">
          <div className="service">
            <span className="service-num">01</span>
            <h3>Creator identification</h3>
            <p>AI matches Badia with food, cooking, and lifestyle creators from our 10,000+ roster in seconds.</p>
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

      {/* Competitive */}
      <section className="competitive" id="competitive">
        <div className="competitive-inner">
          <div className="competitive-header">
            <h2>Competitive analysis</h2>
            <p>What Badia&apos;s competitors are doing in creator marketing, and what&apos;s working.</p>
          </div>
          <div className="competitive-grid stagger-children">
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/badia/tajin-logo.png" alt="Tajín" className="competitive-logo" />
                <span className="competitive-tag">The benchmark</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">28%</span>
                  <span className="stat-label">YoY growth</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">348%</span>
                  <span className="stat-label">Menu mentions</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>Let TikTok creators drive organic virality with trends like the pickle + Fruit Roll-Up hack. Partnered with Selena Gomez&apos;s Rare Beauty for a cultural crossover. Handed campaigns to Latina creators to tell authentic stories.</p>
                <h4>Key insight</h4>
                <p>They didn&apos;t push ads, they enabled culture. Creators made Tajín a lifestyle, not just a seasoning.</p>
              </div>
            </div>
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/badia/mccormick-logo.png" alt="McCormick" className="competitive-logo" />
                <span className="competitive-tag">Market leader</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">288%</span>
                  <span className="stat-label">TikTok engagement</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">101K</span>
                  <span className="stat-label">TikTok followers</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>Co-developed a product line with TikTok star Tabitha Brown, her face on the bottle, not just an endorsement. Partnered with Paris Hilton for mainstream reach. Built an in-house content studio for speed.</p>
                <h4>Key insight</h4>
                <p>Deep creator partnerships beat one-off sponsorships. When Tabitha Brown says &quot;that&apos;s my seasoning,&quot; people believe her.</p>
              </div>
            </div>
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/badia/goya-logo.png" alt="Goya" className="competitive-logo" />
                <span className="competitive-tag">Heritage play</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">#2</span>
                  <span className="stat-label">Social rank</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">25-49</span>
                  <span className="stat-label">Target demo</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>&quot;Real Life Chefs&quot; campaign celebrated amateur home cooks across cultures. Heavy investment in food blogger partnerships and recipe content. Focus on family traditions and cultural connection.</p>
                <h4>Key insight</h4>
                <p>Authenticity over polish. Real kitchens, real families, real mistakes, relatable content outperformed produced ads.</p>
              </div>
            </div>
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/badia/kinders-logo.png" alt="Kinder's" className="competitive-logo" />
                <span className="competitive-tag">BBQ dominant</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">500%</span>
                  <span className="stat-label">Sales growth</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">42M</span>
                  <span className="stat-label">TikTok views</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>Flooded TikTok with grilling and BBQ creators. Their Buttery Steakhouse seasoning went viral through cooking demos. Leaned hard into &quot;dad content&quot; and backyard BBQ culture.</p>
                <h4>Key insight</h4>
                <p>They owned a niche (BBQ) before expanding. Became synonymous with one thing, then grew from there.</p>
              </div>
            </div>
            <div className="competitive-card">
              <div className="competitive-brand">
                <img src="/badia/spicology-logo.jpg" alt="Spicology" className="competitive-logo spicology-logo" />
                <span className="competitive-tag">Premium craft</span>
              </div>
              <div className="competitive-stats">
                <div className="competitive-stat">
                  <span className="stat-value">180K</span>
                  <span className="stat-label">IG followers</span>
                </div>
                <div className="competitive-stat">
                  <span className="stat-value">4.8</span>
                  <span className="stat-label">Amazon rating</span>
                </div>
              </div>
              <div className="competitive-details">
                <h4>What they did</h4>
                <p>Positioned as the &quot;craft beer&quot; of spices. Heavy gifting to food influencers and chefs. Built a loyal community through educational content about spice blends and flavor profiles.</p>
                <h4>Key insight</h4>
                <p>Premium positioning + micro-influencer strategy. They didn&apos;t chase big names, they built a tribe of passionate advocates.</p>
              </div>
            </div>
          </div>
          <div className="competitive-recommendation">
            <div className="recommendation-header">
              <img src="/badia/badia-logo.svg" alt="Badia" className="recommendation-logo" />
              <h3>Our recommendation</h3>
            </div>
            <div className="recommendation-content">
              <div className="recommendation-text">
                <p><strong>Own the &quot;everyday cooking&quot; space on TikTok and Instagram.</strong></p>
                <p>Tajín grew 28% by letting creators make the brand part of their content, not through ads, but through genuine use. McCormick&apos;s Tabitha Brown partnership drove 288% higher engagement because it felt real. The playbook is proven: creator-led content beats brand content every time.</p>
                <p>Badia has an advantage: a massive product range that works across every type of cuisine, grilling, quick dinners, meal prep, comfort food. The opportunity is to become the go-to spice brand for home cooks across all demographics.</p>
                <p><strong>The data supports this:</strong></p>
                <ul>
                  <li>49% of consumers depend on TikTok influencer recommendations for food purchases</li>
                  <li>Creator ads see 20% higher engagement than brand ads on TikTok</li>
                  <li>Integrated content (product woven into recipes) outperforms ad reads 3:1</li>
                  <li>Food content on TikTok has 1.5B+ daily views, massive untapped reach</li>
                </ul>
                <p><strong>Move now, move authentically, and own the kitchen.</strong></p>
              </div>
              <div className="recommendation-actions">
                <div className="action-item">
                  <span className="action-num">1</span>
                  <span className="action-text">Launch with 10-15 food & cooking creators across niches (grilling, meal prep, quick dinners, comfort food)</span>
                </div>
                <div className="action-item">
                  <span className="action-num">2</span>
                  <span className="action-text">Focus on integrated recipe content, not ad reads</span>
                </div>
                <div className="action-item">
                  <span className="action-num">3</span>
                  <span className="action-text">Amplify top performers through paid media immediately</span>
                </div>
                <div className="action-item">
                  <span className="action-num">4</span>
                  <span className="action-text">Build toward a signature creator partnership (the &quot;Tabitha Brown&quot; moment)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="strategy" id="strategy">
        <div className="strategy-header">
          <h2>Recommended strategy</h2>
          <p>Tajín grew 28% in one year by letting creators drive authentic cultural content. McCormick&apos;s Tabitha Brown collab saw 288% higher TikTok engagement. The playbook is clear: partner with food creators who already love cooking with bold flavors, and let them tell Badia&apos;s story in their own voice. Not as a sponsorship, but as part of their real kitchen.</p>
        </div>
        <div className="strategy-cols stagger-children">
          <div className="strategy-col">
            <span className="strategy-label">UGC Content</span>
            <h3>High-volume ad creative</h3>
            <p>Recipe videos, cooking tutorials, and &quot;pantry staples&quot; content, all featuring Badia naturally. Full usage rights for paid media. Built for A/B testing across Meta and TikTok to find what converts.</p>
            <span className="strategy-use">Best for: Paid ads, retargeting, always-on creative</span>
          </div>
          <div className="strategy-col dark">
            <span className="strategy-label">Influencer Posts</span>
            <h3>Authentic reach</h3>
            <p>Partner with food creators who genuinely cook, grilling experts, meal prep pros, home chefs. Let them feature Badia naturally in their content. No scripts, no forced plugs. This is how the best brands win: creator-first, not ad-first.</p>
            <span className="strategy-use">Best for: Awareness, trust, organic reach</span>
          </div>
        </div>
        <div className="strategy-viral-wrapper">
          <div className="strategy-col viral">
            <span className="strategy-label">Viral Play</span>
            <h3>#BadiaBurnChallenge</h3>
            <p>Send creators Badia&apos;s hottest spices and film their reactions. Start with food creators, then expand to comedians and streamers who&apos;ve never cooked. The twist: if they can handle the heat, they get to create their own &quot;signature spice blend&quot; with Badia. UGC goldmine with built-in shareability.</p>
            <span className="strategy-use">Best for: Virality, brand awareness, Gen Z reach</span>
          </div>
        </div>
      </section>

      {/* Creators */}
      <section className="creators" id="creators">
        <h2>Examples of creators that meet Badia&apos;s goals</h2>
        <p className="creators-sub">Authentic voices with highly engaged followings in food, cooking, and lifestyle</p>
        <div className="creators-grid stagger-children">
          <div className="creator">
            <div className="creator-video">
              <iframe src="https://www.instagram.com/reel/DHYyAiMoiqM/embed" frameBorder="0" allow="autoplay" allowFullScreen></iframe>
              <span className="video-placeholder">Video embed</span>
            </div>
            <div className="creator-details">
              <div className="creator-info">
                <span className="creator-name">Meat Curator</span>
                <span className="creator-handle">@meatcurator</span>
                <span className="creator-meta">614K followers · Instagram</span>
              </div>
              <p className="creator-why">Why they fit: Grilling and BBQ content creator with highly engaged audience. Perfect for showcasing Badia spice rubs and seasonings in action.</p>
            </div>
          </div>
          <div className="creator">
            <div className="creator-video">
              <iframe src="https://www.instagram.com/p/DTbhm9bD9-E/embed" frameBorder="0" allow="autoplay" allowFullScreen></iframe>
              <span className="video-placeholder">Video embed</span>
            </div>
            <div className="creator-details">
              <div className="creator-info">
                <span className="creator-name">Kiwi Celeste</span>
                <span className="creator-handle">@kiwiceleste_</span>
                <span className="creator-meta">1M followers · Instagram</span>
              </div>
              <p className="creator-why">Why they fit: Food and recipe creator with massive reach. Authentic cooking content that naturally integrates spices and seasonings.</p>
            </div>
          </div>
          <div className="creator">
            <div className="creator-video">
              <iframe src="https://www.instagram.com/reel/Cw2XDIvvh6G/embed" frameBorder="0" allow="autoplay" allowFullScreen></iframe>
              <span className="video-placeholder">Video embed</span>
            </div>
            <div className="creator-details">
              <div className="creator-info">
                <span className="creator-name">From Scratch with Bob</span>
                <span className="creator-handle">@fromscratchwithbob</span>
                <span className="creator-meta">2M followers · Instagram</span>
              </div>
              <p className="creator-why">Why they fit: From-scratch cooking creator with massive engaged following. His content on homemade staples and seasonal recipes is perfect for showcasing Badia as an essential pantry ingredient.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Ideas */}
      <section className="content-ideas" id="content-ideas">
        <div className="content-ideas-inner">
          <div className="content-ideas-header">
            <h2>Content ideas for Badia</h2>
            <div className="content-ideas-intro">
              <p>Badia&apos;s tagline is <strong>&quot;The Soul of Cooking&quot;</strong>, and their content should reflect that. These ideas are built around their actual products (Complete Seasoning, Sazon Tropical, Lemon Pepper) and recipe categories (quick weeknight meals to Mediterranean gourmet).</p>
              <p>Each concept uses integrated content where Badia appears naturally in the cooking process, not as an ad read, but as a genuine part of the recipe.</p>
            </div>
          </div>
          <div className="content-ideas-grid stagger-children">
            <div className="content-idea">
              <span className="idea-num">01</span>
              <h3>&quot;$5 vs $50 meal&quot; challenge</h3>
              <p>Creator makes the same dish two ways: cheap ingredients + Badia vs expensive restaurant version. Plot twist: the $5 version wins. Proves you don&apos;t need fancy ingredients, just the right spices.</p>
            </div>
            <div className="content-idea">
              <span className="idea-num">02</span>
              <h3>&quot;Rate my abuela&apos;s recipe&quot;</h3>
              <p>Creators share family recipes passed down through generations. Emotional storytelling meets cooking content. Badia is already in these kitchens, we just capture it.</p>
            </div>
            <div className="content-idea">
              <span className="idea-num">03</span>
              <h3>&quot;Fridge raid&quot; series</h3>
              <p>What can you make with random fridge ingredients + Badia spices? Relatable, unscripted, and shows how Complete Seasoning saves any meal from being boring.</p>
            </div>
            <div className="content-idea">
              <span className="idea-num">04</span>
              <h3>&quot;First generation cooks&quot;</h3>
              <p>Kids of immigrants learning family recipes for the first time. The learning curve, the phone calls to mom, the emotional payoff. Badia as the bridge between generations.</p>
            </div>
            <div className="content-idea">
              <span className="idea-num">05</span>
              <h3>&quot;Partner taste test&quot;</h3>
              <p>Couples content with a Badia twist. Partner tries creator&apos;s dish and rates it. Funny reactions, genuine moments, built-in engagement bait.</p>
            </div>
            <div className="content-idea">
              <span className="idea-num">06</span>
              <h3>&quot;This spice changed my life&quot;</h3>
              <p>Creator discovers a Badia product and shows their genuine reaction. Before/after of their cooking. Authentic testimonial format that doesn&apos;t feel like an ad.</p>
            </div>
            <div className="content-idea">
              <span className="idea-num">07</span>
              <h3>&quot;Meal prep but make it easy&quot;</h3>
              <p>Sunday meal prep content showing how Badia simplifies batch cooking. One seasoning, five different meals. Practical value that gets saved and shared.</p>
            </div>
            <div className="content-idea">
              <span className="idea-num">08</span>
              <h3>&quot;Recreating viral recipes&quot;</h3>
              <p>Take trending food videos and recreate them with Badia. Ride existing trends while showcasing product. Built-in audience already searching for these recipes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline" id="timeline">
        <div className="timeline-inner">
          <div className="timeline-header">
            <h2>Typical timeline</h2>
            <p>From kickoff to live content in 5 weeks. Timeline can vary based on number of creators and campaign scope.</p>
          </div>
          <div className="timeline-steps stagger-children">
            <div className="timeline-step">
              <span className="timeline-week">Week 1</span>
              <h3>Kickoff & Strategy</h3>
              <p>Understand goals, review brand guidelines, present campaign brief, finalize creative direction</p>
            </div>
            <div className="timeline-step">
              <span className="timeline-week">Week 2</span>
              <h3>Creator Sourcing</h3>
              <p>AI-powered creator discovery, outreach to top matches, negotiate terms</p>
            </div>
            <div className="timeline-step">
              <span className="timeline-week">Week 3</span>
              <h3>Creator Approval</h3>
              <p>Present creator shortlist, finalize partnerships, send briefs to approved creators</p>
            </div>
            <div className="timeline-step">
              <span className="timeline-week">Week 4</span>
              <h3>Content Review</h3>
              <p>Creators submit drafts, review and request revisions, approve final content</p>
            </div>
            <div className="timeline-step">
              <span className="timeline-week">Week 5</span>
              <h3>Go Live</h3>
              <p>Content posted, paid amplification begins, performance tracking starts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="case-study" id="case-study" ref={caseStudyRef}>
        <div className="case-study-inner">
          <div className="case-study-text">
            <span className="case-study-label">Case Study</span>
            <h2>0 to 45M views<br/>in 90 days</h2>
            <p>A brand that had never run creator ads. We built their entire UGC program from scratch.</p>
            <div className="case-study-results">
              <div className="result">
                <span className="result-value"><Counter target={45} />M</span>
                <span className="result-label">Views</span>
              </div>
              <div className="result">
                <span className="result-value"><Counter target={700} />%</span>
                <span className="result-label">ROI</span>
              </div>
              <div className="result">
                <span className="result-value">$<Counter target={300} />K</span>
                <span className="result-label">Revenue</span>
              </div>
            </div>
          </div>
          <div className="case-study-graph">
            <div className="graph-header">
              <span className="graph-title">Views over 90 days</span>
            </div>
            <div className="graph-area">
              <div className="graph-y-axis">
                <span>45M</span>
                <span>30M</span>
                <span>15M</span>
                <span>0</span>
              </div>
              <div className="graph-canvas">
                <svg viewBox="0 0 300 150" preserveAspectRatio="none" className="graph-svg">
                  {/* Grid lines */}
                  <line x1="0" y1="37.5" x2="300" y2="37.5" stroke="#e8e6e3" strokeWidth="1" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke="#e8e6e3" strokeWidth="1" />
                  <line x1="0" y1="112.5" x2="300" y2="112.5" stroke="#e8e6e3" strokeWidth="1" />
                  {/* Views line (orange) */}
                  <polyline
                    className={`graph-line views-line ${graphAnimated ? 'animated' : ''}`}
                    points="0,145 100,120 200,60 300,8"
                    fill="none"
                    stroke="#FF9F66"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="graph-x-axis">
                <span>Week 1</span>
                <span>Week 4</span>
                <span>Week 8</span>
                <span>Week 12</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="cta">
        <h2>Let&apos;s talk</h2>
        <p>Ready to scale creator marketing for Badia?</p>
        <a href="mailto:rj@onghost.com?subject=Badia x Mango" className="cta-btn">Get in touch</a>
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
        <span className="footer-logo">
          <img src="/badia/mango-logo.png" alt="Mango" className="footer-img" />
        </span>
        <span className="footer-note">
          Prepared for <img src="/badia/badia-logo.svg" alt="Badia" className="footer-badia-logo" />
        </span>
      </footer>
    </div>
  );
}
