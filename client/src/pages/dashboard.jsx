import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import AppLayout from "../components/AppLayout"
import LinkRow from "../components/LinkRow"
import Modal, { useModal } from "../components/Modal"
import SearchBar from "../components/SearchBar"
import "./dashboard.css"

const BASE_URL = import.meta.env.VITE_BASE_URL

const FILTERS = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "paused", label: "Paused" },
]

function SkeletonRow() {
    return (
        <div className="skeleton-row">
            <div className="skeleton-line" style={{ width: "45%", height: 14 }} />
            <div className="skeleton-line" style={{ width: "70%", height: 12, marginTop: 10 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <div className="skeleton-line" style={{ width: 64, height: 30 }} />
                <div className="skeleton-line" style={{ width: 64, height: 30 }} />
                <div className="skeleton-line" style={{ width: 64, height: 30 }} />
            </div>
        </div>
    )
}

function QrModalInner({ url, onClose }) {
    const modal = useModal()
    const handleClose = modal ? modal.triggerClose : onClose

    return (
        <div className="qr-modal-content">
            <div className="modal-header">
                <h2>QR code</h2>
                <button type="button" className="modal-close" onClick={handleClose} aria-label="Close">×</button>
            </div>
            <div className="modal-body qr-modal-body">
                <p className="qr-modal-url">{BASE_URL}/{url.shorturl}</p>
                <img
                    src={url.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${BASE_URL}/${url.shorturl}`}
                    alt="QR code"
                    className="qr-modal-img"
                />
                <a
                    href={url.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${BASE_URL}/${url.shorturl}`}
                    download="snapurl-qr.png"
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={handleClose}
                >
                    Download
                </a>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const [urls, setUrls] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("all")
    const [copiedId, setCopiedId] = useState(null)
    const [analyticsData, setAnalyticsData] = useState({})
    const [showAnalytics, setShowAnalytics] = useState(null)
    const [qrModal, setQrModal] = useState(null)
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    useEffect(() => {
        if (!token) navigate("/", { replace: true })
    }, [token, navigate])

    useEffect(() => {
        if (token) fetchUrls()
    }, [token])

    async function fetchUrls() {
        try {
            const response = await axios.get("http://localhost:5001/api/urls", { headers: { token } })
            setUrls(response.data.getallurls)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return urls.filter((u) => {
            const matchesFilter =
                filter === "all" ||
                (filter === "active" && u.isActive) ||
                (filter === "paused" && !u.isActive)
            const matchesSearch =
                !q ||
                u.shorturl?.toLowerCase().includes(q) ||
                u.originalurl?.toLowerCase().includes(q)
            return matchesFilter && matchesSearch
        })
    }, [urls, search, filter])

    function handleCopy(shorturl, id) {
        navigator.clipboard.writeText(`${BASE_URL}/${shorturl}`)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    async function handleToggle(id) {
        try {
            await axios.patch(`http://localhost:5001/api/${id}/toggle`, {}, { headers: { token } })
            fetchUrls()
        } catch (e) {
            console.error(e)
        }
    }

    async function handleDelete(id) {
        try {
            await axios.delete(`http://localhost:5001/api/urls/${id}`, { headers: { token } })
            if (showAnalytics === id) setShowAnalytics(null)
            fetchUrls()
        } catch (e) {
            console.error(e)
        }
    }

    async function handleAnalytics(id) {
        if (showAnalytics === id) {
            setShowAnalytics(null)
            return
        }
        try {
            const response = await axios.get(`http://localhost:5001/api/urls/${id}/analytics`, { headers: { token } })
            setAnalyticsData((prev) => ({ ...prev, [id]: response.data.analytics }))
            setShowAnalytics(id)
        } catch (e) {
            console.error(e)
        }
    }

    const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0)
    const activeCount = urls.filter((u) => u.isActive).length

    if (!token) return null

    return (
        <AppLayout>
            <header className="dashboard-page-header animate-in">
                <div>
                    <h1>All links</h1>
                    <p>Search, filter, and manage every short URL in your account.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate("/app")}>
                    New link
                </button>
            </header>

            {!loading && urls.length > 0 && (
                <div className="stats-row animate-in stagger-1">
                    <div className="stat-card">
                        <span className="stat-value">{urls.length}</span>
                        <span className="stat-label">Total links</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{activeCount}</span>
                        <span className="stat-label">Active</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{totalClicks}</span>
                        <span className="stat-label">Total clicks</span>
                    </div>
                </div>
            )}

            {!loading && urls.length > 0 && (
                <div className="dashboard-toolbar card animate-in stagger-2">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search by short URL or destination…" />
                    <div className="filter-tabs" role="tablist" aria-label="Filter links">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                role="tab"
                                aria-selected={filter === f.id}
                                className={`filter-tab ${filter === f.id ? "filter-tab--active" : ""}`}
                                onClick={() => setFilter(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="links-section">
                {loading ? (
                    <>
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                    </>
                ) : urls.length === 0 ? (
                    <div className="dashboard-empty card animate-in">
                        <h2>No links yet</h2>
                        <p>Create your first short link to see it here with click analytics.</p>
                        <button type="button" className="btn btn-primary" onClick={() => navigate("/app")}>
                            Go to workspace
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="dashboard-empty card animate-in">
                        <h2>No matches</h2>
                        <p>Try a different search term or filter.</p>
                        <button type="button" className="btn btn-secondary" onClick={() => { setSearch(""); setFilter("all") }}>
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="links-list">
                        <p className="links-count">{filtered.length} link{filtered.length !== 1 ? "s" : ""}</p>
                        {filtered.map((url) => (
                            <LinkRow
                                key={url._id}
                                url={url}
                                copiedId={copiedId}
                                showAnalytics={showAnalytics}
                                analyticsData={analyticsData[url._id]}
                                onCopy={handleCopy}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onAnalytics={handleAnalytics}
                                onQr={setQrModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {qrModal && (
                <Modal onClose={() => setQrModal(null)} size="sm">
                    <QrModalInner url={qrModal} onClose={() => setQrModal(null)} />
                </Modal>
            )}
        </AppLayout>
    )
}
