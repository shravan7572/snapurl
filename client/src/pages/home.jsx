import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import AppLayout from "../components/AppLayout"
import "./home.css"

const BASE_URL = import.meta.env.VITE_BASE_URL

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
}

export default function Home() {
    const [url, setUrl] = useState("")
    const [alias, setAlias] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [copied, setCopied] = useState(null)
    const [links, setLinks] = useState([])
    const [linksLoading, setLinksLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("token")) navigate("/", { replace: true })
        else fetchLinks()
    }, [navigate])

    async function fetchLinks() {
        try {
            const res = await axios.get("http://localhost:5001/api/urls", {
                headers: { token: localStorage.getItem("token") },
            })
            setLinks(res.data.getallurls || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLinksLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!url.trim()) {
            setError("Enter a URL to shorten.")
            return
        }

        setError("")
        setLoading(true)
        const originalUrl = url.trim()
        const aliasValue = alias.trim()

        try {
            const response = await axios.post(
                "http://localhost:5001/api/shorten",
                { originalurl: originalUrl, aliasurl: aliasValue },
                { headers: { token: localStorage.getItem("token") } }
            )
            const data = response.data
            setResult(data)
            setUrl("")
            setAlias("")
            fetchLinks()
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    function handleCopy(shorturl) {
        navigator.clipboard.writeText(`${shorturl}`)
        setCopied(shorturl)
        setTimeout(() => setCopied(null), 2000)
    }

    const totalClicks = links.reduce((s, l) => s + (l.clicks || 0), 0)
    const activeCount = links.filter((l) => l.isActive).length
    const recentLinks = links.slice(0, 6)

    return (
        <AppLayout>
            <section className="workspace-hero animate-in">
                <div className="workspace-hero-copy">
                    <p className="workspace-eyebrow">{getGreeting()}</p>
                    <h1>Your link workspace</h1>
                    <p>Shorten URLs, track clicks, and manage everything from one place.</p>
                </div>
                <div className="workspace-stats">
                    <div className="workspace-stat animate-in stagger-1">
                        <span className="workspace-stat-value">{linksLoading ? "—" : links.length}</span>
                        <span className="workspace-stat-label">Links</span>
                    </div>
                    <div className="workspace-stat animate-in stagger-2">
                        <span className="workspace-stat-value">{linksLoading ? "—" : activeCount}</span>
                        <span className="workspace-stat-label">Active</span>
                    </div>
                    <div className="workspace-stat animate-in stagger-3">
                        <span className="workspace-stat-value">{linksLoading ? "—" : totalClicks}</span>
                        <span className="workspace-stat-label">Clicks</span>
                    </div>
                </div>
            </section>

            <div className="workspace-grid">
                <div className="workspace-main">
                    <section className="shorten-card card animate-in stagger-1">
                        <div className="shorten-card-head">
                            <h2>Create a short link</h2>
                            <p>Paste a destination URL below. Add a custom alias if you want a readable path.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="shorten-form">
                            <div className="field">
                                <label className="field-label" htmlFor="url">Destination URL</label>
                                <input
                                    id="url"
                                    type="url"
                                    className="input"
                                    placeholder="https://example.com/your-page"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                            <div className="field">
                                <label className="field-label" htmlFor="alias">Custom alias</label>
                                <div className="alias-row">
                                    <span className="alias-prefix">{BASE_URL || "snap.url"}/</span>
                                    <input
                                        id="alias"
                                        type="text"
                                        className="input input-mono alias-input"
                                        placeholder="my-link"
                                        value={alias}
                                        onChange={(e) => setAlias(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            {error && <div className="alert">{error}</div>}
                            <button type="submit" className="btn btn-primary btn-lg shorten-submit" disabled={loading}>
                                {loading ? <><span className="spinner" /> Creating link…</> : "Create short link"}
                            </button>
                        </form>
                   </section>

                    {result && (
                        <section className="result-card card card-raised animate-in">
                            <div className="result-card-head">
                                <div>
                                    <p className="result-label">Just created</p>
                                    <h3>Your link is ready</h3>
                                </div>
                                <span className="badge"><span className="badge-dot" /> Active</span>
                            </div>
                            <div className="result-url-box">
                                <code>  {result.shorturl}</code>
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleCopy(result.shorturl)}>
                                    {copied === result.shorturl ? "Copied" : "Copy"}
                                </button>
                            </div>
                            {result.qrCode && (
                                <div className="result-qr-row">
                                    <img src={result.qrCode} alt="QR code" />
                                    <div>
                                        <p className="result-qr-title">QR code</p>
                                        <p className="result-qr-desc">Download and use on print or signage.</p>
                                        <a href={result.qrCode} download="snapurl-qr.png" className="btn btn-secondary btn-sm">
                                            Download PNG
                                        </a>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                <aside className="workspace-side">
                    <section className="side-panel card animate-in stagger-2">
                        <div className="side-panel-head">
                            <h2>Recent links</h2>
                            {links.length > 0 && (
                                <Link to="/dashboard" className="side-panel-link">View all →</Link>
                            )}
                        </div>

                        {linksLoading ? (
                            <div className="side-skeleton">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="side-skeleton-row" />
                                ))}
                            </div>
                        ) : recentLinks.length === 0 ? (
                            <div className="side-empty">
                                <p className="side-empty-title">No links yet</p>
                                <p>Create your first short link using the form. It will show up here instantly.</p>
                                <ol className="side-steps">
                                    <li>Paste your long URL</li>
                                    <li>Optionally set an alias</li>
                                    <li>Hit create and share</li>
                                </ol>
                            </div>
                        ) : (
                            <ul className="side-link-list">
                                {recentLinks.map((link, i) => (
                                    <li key={link._id} className="side-link-item" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="side-link-top">
                                            <span className="side-link-short">{link.shorturl}</span>
                                            <span className="side-link-clicks">{link.clicks} clicks</span>
                                        </div>
                                        <p className="side-link-original" title={link.originalurl}>{link.originalurl}</p>
                                        <div className="side-link-actions">
                                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleCopy(link.shorturl)}>
                                                {copied === link.shorturl ? "Copied" : "Copy"}
                                            </button>
                                            {!link.isActive && <span className="badge badge--paused"><span className="badge-dot badge-dot--off" /> Paused</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="quick-actions card animate-in stagger-3">
                        <h2>Quick actions</h2>
                        <div className="quick-actions-grid">
                            <button type="button" className="quick-action" onClick={() => document.getElementById("url")?.focus()}>
                                <span className="quick-action-label">New link</span>
                                <span className="quick-action-desc">Shorten a URL</span>
                            </button>
                            <button type="button" className="quick-action" onClick={() => navigate("/dashboard")}>
                                <span className="quick-action-label">Dashboard</span>
                                <span className="quick-action-desc">Search & manage</span>
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </AppLayout>
    )
}
