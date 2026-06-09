import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AuthModal from "../components/AuthModal"
import ProductPreview from "../components/ProductPreview"
import ThemeToggle from "../components/ThemeToggle"
import LandingStats from "../components/landing/LandingStats"
import AnalyticsPreview from "../components/landing/AnalyticsPreview"
import "./landing.css"

const BENTO = [
    {
        size: "large",
        tag: "Core",
        title: "Instant URL shortening",
        desc: "Paste any long URL and get a clean short link in seconds. Supports HTTP, HTTPS, and deep links.",
        points: ["Sub-second generation", "Automatic QR code", "Copy with one click"],
    },
    {
        size: "small",
        tag: "Branding",
        title: "Custom aliases",
        desc: "Choose readable paths like /launch or /docs instead of random strings.",
    },
    {
        size: "small",
        tag: "Control",
        title: "Pause anytime",
        desc: "Disable links without deleting them. Paused links return 404 until re-enabled.",
    },
    {
        size: "medium",
        tag: "Insights",
        title: "Per-click analytics",
        desc: "Every click records browser, operating system, and device type so you know how links perform.",
        points: ["Browser breakdown", "Device & OS data", "Click history"],
    },
    {
        size: "medium",
        tag: "Export",
        title: "QR codes included",
        desc: "Every short link ships with a downloadable PNG — ready for print, packaging, or slides.",
        points: ["High-res PNG", "Points to short URL", "Analytics still track"],
    },
    {
        size: "small",
        tag: "Security",
        title: "Your links only",
        desc: "JWT authentication keeps your workspace private. Google sign-in supported.",
    },
]

const USE_CASES = [
    {
        title: "Product launches",
        desc: "Share a memorable short link across ads, email, and social. Swap the destination without changing the URL.",
    },
    {
        title: "Developer portfolios",
        desc: "Use a clean alias on your resume and GitHub. Track which sources drive the most visits.",
    },
    {
        title: "Event registration",
        desc: "Print QR codes on posters. Monitor mobile vs desktop signups in real time.",
    },
    {
        title: "Campaign tracking",
        desc: "Create separate aliases per channel and compare click performance side by side.",
    },
]

const INCLUDED = [
    "Unlimited short links",
    "Unlimited clicks",
    "Custom aliases",
    "QR code downloads",
    "Click analytics",
    "Enable / disable links",
    "Google sign-in",
    "No credit card required",
]


export default function Landing() {
    const [authMode, setAuthMode] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/app", { replace: true })
    }, [navigate])

    function scrollTo(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <div className="landing">
            <header className="landing-header">
                <div className="landing-header-inner">
                    <button type="button" className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        Snap<span>URL</span>
                    </button>
                    <nav className="landing-nav" aria-label="Sections">
                        <button type="button" onClick={() => scrollTo("features")}>Features</button>
                        <button type="button" onClick={() => scrollTo("analytics")}>Analytics</button>
                        <button type="button" onClick={() => scrollTo("use-cases")}>Use cases</button>
                    </nav>
                    <div className="landing-header-actions">
                        <ThemeToggle />
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAuthMode("login")}>Log in</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => setAuthMode("signup")}>Get started</button>
                    </div>
                </div>
            </header>

            <section className="landing-hero">
                <div className="landing-hero-inner">
                    <div className="landing-hero-copy animate-in">
                        <p className="landing-eyebrow">Link management for teams</p>
                        <h1>Short URLs with analytics built in.</h1>
                        <p className="landing-lead">
                            Create branded short links, track every click, and manage everything from a single dashboard.
                        </p>
                        <div className="landing-hero-cta">
                            <button type="button" className="btn btn-primary btn-lg" onClick={() => setAuthMode("signup")}>
                                Create free account
                            </button>
                            <button type="button" className="btn btn-secondary btn-lg" onClick={() => setAuthMode("login")}>
                                Log in
                            </button>
                        </div>
                    </div>
                    <div className="landing-hero-visual animate-in stagger-2">
                        <ProductPreview />
                    </div>
                </div>
            </section>

            <LandingStats />

            <section className="landing-section" id="features">
                <div className="landing-section-inner">
                    <div className="landing-section-head animate-in">
                        <p className="section-eyebrow">Features</p>
                        <h2>Built for a practical workflow</h2>
                        <p>Everything you need to shorten, share, and measure — without feature bloat.</p>
                    </div>
                    <div className="bento-grid">
                        {BENTO.map((item, i) => (
                            <article key={item.title} className={`bento-card bento-card--${item.size} animate-in stagger-${(i % 5) + 1}`}>
                                <span className="bento-tag">{item.tag}</span>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                {item.points && (
                                    <ul className="bento-points">
                                        {item.points.map((pt) => (
                                            <li key={pt}>{pt}</li>
                                        ))}
                                    </ul>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-section landing-section--split" id="analytics">
                <div className="landing-section-inner split-layout">
                    <div className="split-copy animate-in">
                        <p className="section-eyebrow">Analytics</p>
                        <h2>Know exactly who clicks your links</h2>
                        <p>
                            Every visit is logged with browser, device, and operating system data.
                            See totals, daily trends, and a full visit history per link.
                        </p>
                        <ul className="split-checklist">
                            <li>Total and daily click counts</li>
                            <li>Browser, OS, and device per visit</li>
                            <li>Expandable stats on each link card</li>
                            <li>Works through QR scans too</li>
                        </ul>
                    </div>
                    <div className="split-visual animate-in stagger-2">
                        <AnalyticsPreview />
                    </div>
                </div>
            </section>

            <section className="landing-section landing-section--muted" id="use-cases">
                <div className="landing-section-inner">
                    <div className="landing-section-head animate-in">
                        <p className="section-eyebrow">Use cases</p>
                        <h2>Works across teams and channels</h2>
                        <p>From solo developers to marketing campaigns — one tool for every link.</p>
                    </div>
                    <div className="use-case-grid">
                        {USE_CASES.map((uc, i) => (
                            <div key={uc.title} className={`use-case-card animate-in stagger-${i + 1}`}>
                                <h3>{uc.title}</h3>
                                <p>{uc.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-section">
                <div className="landing-section-inner">
                    <div className="landing-section-head animate-in">
                        <p className="section-eyebrow">How it works</p>
                        <h2>Three steps. That's it.</h2>
                    </div>
                    <ol className="steps-list steps-list--cards">
                        <li className="step-card animate-in stagger-1">
                            <span className="step-num">1</span>
                            <h3>Create your account</h3>
                            <p>Sign up with email or Google. No credit card, no verification delays.</p>
                        </li>
                        <li className="step-card animate-in stagger-2">
                            <span className="step-num">2</span>
                            <h3>Paste your URL</h3>
                            <p>Drop in any destination URL. Add a custom alias if you want a readable path.</p>
                        </li>
                        <li className="step-card animate-in stagger-3">
                            <span className="step-num">3</span>
                            <h3>Share and track</h3>
                            <p>Copy the short link or download the QR code. Monitor clicks from your dashboard.</p>
                        </li>
                    </ol>
                </div>
            </section>

            <section className="landing-section landing-section--muted">
                <div className="landing-section-inner">
                    <div className="landing-section-head animate-in">
                        <p className="section-eyebrow">Included</p>
                        <h2>Everything in one free plan</h2>
                    </div>
                    <div className="included-grid">
                        {INCLUDED.map((item, i) => (
                            <div key={item} className={`included-box animate-in stagger-${(i % 5) + 1}`}>
                                <span className="included-check">✓</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-cta">
                <div className="landing-cta-glow"></div>
                <div className="landing-cta-inner animate-in">
                    <span className="cta-badge"> Get Started Instantly</span>
                    <h2>Start shortening links today</h2>
                    <p className="cta-desc">Free account. Full analytics. No credit card required.</p>
                    <div className="cta-features">
                        <div className="cta-feature-item">
                            <span className="cta-feature-icon"></span>
                            <span>Setup in 30 seconds</span>
                        </div>
                        <div className="cta-feature-item">
                            <span className="cta-feature-icon"></span>
                            <span>Real-time analytics</span>
                        </div>
                        <div className="cta-feature-item">
                            <span className="cta-feature-icon"></span>
                            <span>Custom aliases</span>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary btn-lg btn-cta-main" onClick={() => setAuthMode("signup")}>
                        Get started for free
                        <svg className="cta-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "16px", height: "16px", marginLeft: "8px" }}>
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <span className="landing-brand">Snap<span>URL</span></span>
                    <div className="landing-footer-links">
                        <button type="button" onClick={() => scrollTo("features")}>Features</button>
                        <button type="button" onClick={() => scrollTo("use-cases")}>Use cases</button>
                        <a href="https://github.com/shravan7572/snapurl" target="_blank" rel="noreferrer">GitHub</a>
                    </div>
                    <span className="landing-footer-copy">© 2026 SnapURL</span>
                </div>
            </footer>

            {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
        </div>
    )
}
