import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./landing.css"

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false)
    return (
        <div className={`faq-item ${open ? "faq-open" : ""}`} onClick={() => setOpen(!open)}>
            <div className="faq-question">
                <span>{q}</span>
                <span className="faq-chevron">{open ? "−" : "+"}</span>
            </div>
            {open && <div className="faq-answer">{a}</div>}
        </div>
    )
}

function Landing() {
    const [showModal,  setShowModal]  = useState(null)
    const [firstname,  setFirstname]  = useState("")
    const [lastname,   setLastname]   = useState("")
    const [email,      setEmail]      = useState("")
    const [password,   setPassword]   = useState("")
    const [error,      setError]      = useState("")
    const navigate = useNavigate()

    async function handleLogin() {
        try {
            const res = await axios.post("http://localhost:5001/user/sign-in", { email, password })
            localStorage.setItem("token", res.data.token)
            navigate("/app")
        } catch(e) {
            setError(e.response?.data?.message || "Login failed!")
        }
    }
  

    async function handleSignup() {
        try {
            await axios.post("http://localhost:5001/user/sign-up", { firstname, lastname, email, password })
            setError("")
            setShowModal("login")
        } catch(e) {
            setError(e.response?.data?.message || "Signup failed!")
        }
    }

    const features = [
        { icon: "__", title: "Instant Shortening", desc: "Turn any long URL into a clean short link in seconds." },
        { icon: "__", title: "Custom Aliases",     desc: "Choose your own short code like /my-portfolio." },
        { icon: "__", title: "Click Analytics",    desc: "Track browser, device, and OS for every click." },
        { icon: "__", title: "QR Code Generator",  desc: "Every short link gets a downloadable QR code." },
        { icon: "__", title: "Enable / Disable",   desc: "Pause any link without deleting it." },
        { icon: "__", title: "JWT Auth",           desc: "Your links belong to you and only you." }
    ]

    function scrollTo(id) {
        const el = document.getElementById(id)
        if (!el) return
        const navHeight = document.querySelector(".landing-nav")?.offsetHeight || 80
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16
        window.scrollTo({ top, behavior: "smooth" })
    }

    return (
        <div className="landing">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            {/* NAVBAR */}
            <nav className="landing-nav">
                <div className="nav-logo" onClick={() => navigate("/")}>
                    Snap<span>URL</span>
                </div>
                <div className="nav-center">
                    <button className="nav-link" onClick={() => scrollTo("features")}>Features</button>
                    <button className="nav-link" onClick={() => scrollTo("how-it-works")}>How it works</button>
                    <button className="nav-link" onClick={() => scrollTo("faq")}>FAQ</button>
                </div>
                <div className="nav-actions">
                    <button className="btn-ghost" onClick={() => setShowModal("login")}>Login</button>
                    <button className="btn-solid" onClick={() => setShowModal("signup")}>Get Started Free</button>
                </div>
            </nav>

            {/* HERO - 2 column */}
            <section className="hero">
                <div className="hero-left">
                    <div className="hero-badge">✦ Free forever — no credit card needed</div>
                    <h1>The smarter<br />way to <span>share links.</span></h1>
                    <p>Powerful link management with click analytics, custom aliases, and QR codes. Everything bit.ly charges for — completely free.</p>
                    <div className="hero-actions">
                        <button className="btn-hero" onClick={() => setShowModal("signup")}>
                            Start for free →
                        </button>
                        <button className="btn-hero-ghost" onClick={() => setShowModal("login")}>
                            I have an account
                        </button>
                    </div>
                    <div className="social-proof">
                        <div className="avatars">
                            <div className="avatar" style={{background:"#fca5a5"}}>S</div>
                            <div className="avatar" style={{background:"#93c5fd"}}>R</div>
                            <div className="avatar" style={{background:"#86efac"}}>A</div>
                            <div className="avatar" style={{background:"#c4b5fd"}}>M</div>
                        </div>
                        <span>Join developers already using SnapURL</span>
                    </div>
                </div>

                <div className="hero-right">
                    {/* Floating mock cards */}
                    <div className="mock-card mock-card-main">
                        <div className="mock-label">YOUR SHORT LINK</div>
                        <div className="mock-url">snap.url/<span>my-portfolio</span></div>
                        <div className="mock-divider"></div>
                        <div className="mock-stats">
                            <div className="mock-stat">
                                <span className="stat-val">247</span>
                                <span className="stat-lbl">Total clicks</span>
                            </div>
                            <div className="mock-stat">
                                <span className="stat-val">14</span>
                                <span className="stat-lbl">Today</span>
                            </div>
                            <div className="mock-stat">
                                <span className="stat-val">89%</span>
                                <span className="stat-lbl">Mobile</span>
                            </div>
                        </div>
                    </div>

                    <div className="mock-card mock-card-qr">
                        <div className="mock-qr">
                            <div className="qr-grid">
                                {Array(16).fill(0).map((_,i) => (
                                    <div key={i} className={`qr-cell ${Math.random() > 0.5 ? "filled" : ""}`}></div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="mock-label">QR CODE</div>
                            <div style={{fontSize:"13px", color:"var(--muted)", marginTop:"4px"}}>Ready to download</div>
                        </div>
                    </div>

                    <div className="mock-card mock-card-analytics">
                        <div className="mock-label">ANALYTICS</div>
                        <div className="mini-bars">
                            {[40,70,55,90,65,80,100,75,85,95].map((h,i) => (
                                <div key={i} className="mini-bar" style={{height:`${h}%`}}></div>
                            ))}
                        </div>
                    </div>

                    <div className="mock-card mock-card-badge">
                        <div className="badge-icon">|</div>
                        <div>
                            <div style={{fontWeight:"600", fontSize:"14px"}}>Custom Alias</div>
                            <div style={{fontSize:"12px", color:"var(--muted)"}}>snap.url/your-brand</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features" id="features">
                <div className="section-header">
                    <p className="section-label">Features</p>
                    <h2 className="section-title">More than just a URL shortener.</h2>
                </div>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div className="feature-card" key={i}>
                            <span className="feature-icon">{f.icon}</span>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="how-it-works"id="how-it-works">
                <div className="section-header">
                    <p className="section-label">How it works</p>
                    <h2 className="section-title">Three steps. That's it.</h2>
                </div>
                <div className="steps">
                    <div className="step">
                        <span className="step-number">01</span>
                        <h3>Create your account</h3>
                        <p>Sign up in seconds. No credit card, no verification. Just email and password.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">02</span>
                        <h3>Paste your long URL</h3>
                        <p>Drop in any URL, add a custom alias if you want, and hit shorten.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">03</span>
                        <h3>Share and track</h3>
                        <p>Copy your short link or scan the QR code. Watch analytics in real time.</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq" id="faq">
                <div className="section-header">
                    <p className="section-label">FAQ</p>
                    <h2 className="section-title">Common questions.</h2>
                </div>
                <div className="faq-list">
                    {[
                        { q: "Is SnapURL really free?", a: "Yes, completely. No credit card, no hidden fees, no premium tier. Everything you see is available to all users." },
                        { q: "Are there any link or click limits?", a: "No limits on the number of links you can create or the clicks they receive. Shorten as many URLs as you need." },
                        { q: "Can I use a custom alias for my links?", a: "Absolutely. When shortening a URL, just type your preferred alias — like /my-portfolio — and we'll use it if it's available." },
                        { q: "What analytics do I get per link?", a: "Each link tracks total clicks, clicks today, and a breakdown by browser, device type, and operating system." },
                        { q: "Can I disable a link without deleting it?", a: "Yes. Every link has an enable/disable toggle. Disabled links return a 404 until you turn them back on." },
                        { q: "How does the QR code work?", a: "Every short link automatically gets a QR code you can download. It points to your short URL, so analytics still work through it." },
                    ].map((item, i) => (
                        <FaqItem key={i} q={item.q} a={item.a} />
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta" id="cta">
                <div className="cta-inner">
                    <h2>Ready to <span>own your links?</span></h2>
                    <p>Join SnapURL and start shortening for free. No hidden fees, ever.</p>
                    <button className="btn-hero" onClick={() => setShowModal("signup")}>
                        Get Started Free →
                    </button>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-left">
                    <div className="footer-logo">Snap<span>URL</span></div>
                    <p>Powerful link management with analytics,<br/>custom aliases, and QR codes.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Product</h4>
                        <button className="footer-link-btn" onClick={() => scrollTo("features")}>Features</button>
                        <button className="footer-link-btn" onClick={() => scrollTo("how-it-works")}>How it works</button>
                        <button className="footer-link-btn" onClick={() => setShowModal("signup")}>Get Started</button>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <a href="https://github.com/shravan7572/snapurl" target="_blank">GitHub</a>
                        <button className="footer-link-btn" onClick={() => scrollTo("faq")}>FAQ</button>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <p>© 2026 SnapURL</p>
                    </div>
                </div>
            </footer>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={() => { setShowModal(null); setError("") }}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-tabs">
                            <button className={showModal === "login" ? "tab active" : "tab"}
                                onClick={() => { setShowModal("login"); setError("") }}>Login</button>
                            <button className={showModal === "signup" ? "tab active" : "tab"}
                                onClick={() => { setShowModal("signup"); setError("") }}>Sign Up</button>
                        </div>
                        <h2 className="modal-title">
                            {showModal === "login" ? "Welcome back 👋" : "Create account"}
                        </h2>
                        {error && <p className="modal-error">{error}</p>}
                        {showModal === "signup" && (
                            <div className="modal-row">
                                <input className="modal-input" type="text" placeholder="First Name"
                                    value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                <input className="modal-input" type="text" placeholder="Last Name"
                                    value={lastname} onChange={(e) => setLastname(e.target.value)} />
                            </div>
                        )}
                        <input className="modal-input" type="email" placeholder="Email"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input className="modal-input" type="password" placeholder="Password"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="modal-btn"
                            onClick={showModal === "login" ? handleLogin : handleSignup}>
                            {showModal === "login" ? "Login →" : "Create Account →"}
                            <div className="modal-divider">
                                <span>or</span>
                            </div>
                            <button className="modal-google-btn"
                                onClick={() => window.location.href = "http://localhost:5001/auth/google"}>
                                <img src="https://www.google.com/favicon.ico" width="16" height="16" />
                                Continue with Google
                            </button>
                          </button>
                        <p className="modal-switch">
                            {showModal === "login" ? "Don't have an account? " : "Already have an account? "}
                            <span onClick={() => { setShowModal(showModal === "login" ? "signup" : "login"); setError("") }}>
                                {showModal === "login" ? "Sign up" : "Login"}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Landing