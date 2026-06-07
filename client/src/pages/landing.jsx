import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./landing.css"

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
        const res = await axios.post("http://localhost:5001/user/sign-in", {
            email, password
        })
        localStorage.setItem("token", res.data.token)
        navigate("/app")
    } catch(e) {
        setError(e.response?.data?.message || "Login failed!")
    }
}

async function handleSignup() {
    try {
        await axios.post("http://localhost:5001/user/sign-up", {
            firstname, lastname, email, password
        })
        setError("")
        setShowModal("login")  // after signup → show login modal!
    } catch(e) {
        setError(e.response?.data?.message || "Signup failed!")
    }
}


    const features = [
        {
            icon: "🔗",
            title: "Instant URL Shortening",
            desc: "Turn any long URL into a clean short link in seconds. No bloat, no friction."
        },
        {
            icon: "🎨",
            title: "Custom Aliases",
            desc: "Choose your own short code. Make links memorable like /my-portfolio."
        },
        {
            icon: "📊",
            title: "Click Analytics",
            desc: "Track every click. See browser, device, OS data for every link you create."
        },
        {
            icon: "📱",
            title: "QR Code Generation",
            desc: "Every short link gets a downloadable QR code. Ready for print or sharing."
        },
        {
            icon: "🔛",
            title: "Enable / Disable Links",
            desc: "Pause any link without deleting it. Full control over your URLs anytime."
        },
        {
            icon: "🔒",
            title: "Secure by Default",
            desc: "JWT authentication. Your links belong to you and only you."
        }
    ]

    return (
        <div className="landing">

            {/* NAVBAR */}
            <nav className="landing-nav">
                <div className="nav-logo">Snap<span>URL</span></div>
                <div className="nav-actions">
                    <button className="btn-ghost" onClick={() => setShowModal("signin")}>
                        Login
                    </button>
                    <button className="btn-solid" onClick={() => setShowModal("signup")}>
                        Get Started Free
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-badge">✦ Free & Open to Use</div>
                <h1>
                    Shorten. Track.<br />
                    <span>Own your links.</span>
                </h1>
                <p>
                    Powerful link management with click analytics,
                    custom aliases, and QR codes. Everything bit.ly
                    charges for — completely free.
                </p>
                <div className="hero-actions">
                    <button className="btn-hero" onClick={() => setShowModal("signup")}>
                        Start Shortening Free →
                    </button>
                    <button className="btn-hero-ghost" onClick={() => setShowModal("signin")}>
                        I have an account
                    </button>
                </div>
            </section>

            {/* STATS */}
            <div className="stats">
                <div className="stat-item">
                    <span className="stat-number">6+</span>
                    <span className="stat-label">Powerful features</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">0₹</span>
                    <span className="stat-label">Always free</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">∞</span>
                    <span className="stat-label">Links you can create</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">QR</span>
                    <span className="stat-label">Auto generated codes</span>
                </div>
            </div>

            {/* FEATURES */}
            <section className="features">
                <p className="section-label">Features</p>
                <h2 className="section-title">
                    More than just a URL shortener.
                </h2>
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
            <section className="how-it-works">
                <p className="section-label">How it works</p>
                <h2 className="section-title">Three steps. That's it.</h2>
                <div className="steps">
                    <div className="step">
                        <span className="step-number">01</span>
                        <h3>Create your account</h3>
                        <p>Sign up in seconds. No credit card, no verification email. Just a username and password.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">02</span>
                        <h3>Paste your long URL</h3>
                        <p>Drop in any URL. Add a custom alias if you want. Hit shorten. Done in under 3 seconds.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">03</span>
                        <h3>Share and track</h3>
                        <p>Copy your short link or scan the QR code. Watch your analytics grow in real time.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta">
                <h2>Ready to <span>own your links?</span></h2>
                <p>Join SnapURL and start shortening for free. No hidden fees, ever.</p>
                <button className="btn-hero" onClick={() => navigate("/signup")}>
                    Get Started Free →
                </button>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-logo">Snap<span>URL</span></div>
                <p>© 2026 SnapURL. Built with 🔥 by Shravan.</p>
            </footer>
            {/* MODAL OVERLAY */}
{showModal && (
    <div className="modal-overlay" onClick={() => {
        setShowModal(null)
        setError("")
    }}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            {/* TABS */}
            <div className="modal-tabs">
                <button
                    className={showModal === "signin" ? "tab active" : "tab"}
                    onClick={() => { setShowModal("signin"); setError("") }}
                >
                    Login
                </button>
                <button
                    className={showModal === "signup" ? "tab active" : "tab"}
                    onClick={() => { setShowModal("signup"); setError("") }}
                >
                    Sign Up
                </button>
            </div>

            <h2 className="modal-title">
                {showModal === "signin" ? "Welcome back" : "Create account"}
            </h2>

            {error && <p className="modal-error">{error}</p>}

            {/* SIGNUP EXTRA FIELDS */}
            {showModal === "signup" && (
                <>
                    <input
                        className="modal-input"
                        type="text"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <input
                        className="modal-input"
                        type="text"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </>
            )}

            <input
                className="modal-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="modal-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="modal-btn"
                onClick={showModal === "signin" ? handleLogin : handleSignup}
            >
                {showModal === "signin" ? "signin →" : "Create Account →"}
            </button>

            <p className="modal-switch">
                {showModal === "signin" ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => { 
                    setShowModal(showModal === "signin" ? "signup" : "signin")
                    setError("")
                }}>
                    {showModal === "signin" ? "Sign up" : "signin"}
                </span>
            </p>

        </div>
    </div>
)}

        </div>
    )
}

export default Landing