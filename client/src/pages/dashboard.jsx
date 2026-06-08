    import { useState, useEffect } from "react"
    import { useNavigate } from "react-router-dom"
    import axios from "axios"
    import "./Dashboard.css"
    const BASE_URL = import.meta.env.VITE_BASE_URL
    function SkeletonCard() {
        return (
            <div className="url-card" style={{cursor:"default"}}>
                <div className="skeleton-line" style={{width:"60%", height:"14px", marginBottom:"10px"}}></div>
                <div className="skeleton-line" style={{width:"40%", height:"20px", marginBottom:"16px"}}></div>
                <div style={{display:"flex", gap:"8px"}}>
                    <div className="skeleton-line" style={{width:"70px", height:"32px"}}></div>
                    <div className="skeleton-line" style={{width:"70px", height:"32px"}}></div>
                    <div className="skeleton-line" style={{width:"70px", height:"32px"}}></div>
                </div>
            </div>
        )
    }

    function Dashboard() {
        const [urls,          setUrls]          = useState([])
        const [loading,       setLoading]       = useState(true)
        const [copiedId,      setCopiedId]      = useState(null)
        const [analyticsData, setAnalyticsData] = useState({})
        const [showAnalytics, setShowAnalytics] = useState(null)
        const [qrModal, setQrModal] = useState(null)
        

        const navigate = useNavigate()
        const token = localStorage.getItem("token")

        // fetch all urls on page load
        useEffect(() => {
            fetchUrls()
        }, [])

        async function fetchUrls() {
            try {
                const response = await axios.get(
                    "http://localhost:5001/api/urls",
                    { headers: { token } }
                )
                setUrls(response.data.getallurls)
            } catch(e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }

        function handleCopy(shorturl, id) {
            const fullUrl = `${BASE_URL}/${shorturl}`
            navigator.clipboard.writeText(`${BASE_URL}/${shorturl}`)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        }

        async function handleToggle(id) {
            try {
                await axios.patch(
                    `http://localhost:5001/api/${id}/toggle`,
                    {},
                    { headers: { token } }
                )
                fetchUrls()  
            } catch(e) {
                console.log(e)
            }
        }

    
        async function handleDelete(id) {
            try {
                await axios.delete(
                    `http://localhost:5001/api/urls/${id}`,
                    { headers: { token } }
                )
                fetchUrls()  
            } catch(e) {
                console.log(e)
            }
        }


        async function handleAnalytics(id) {
            if(showAnalytics === id) {
                setShowAnalytics(null)  
                return
            }
            try {
                const response = await axios.get(
                    `http://localhost:5001/api/urls/${id}/analytics`,
                    { headers: { token } }
                )
                setAnalyticsData(prev => ({ ...prev, [id]: response.data.analytics }))
                setShowAnalytics(id)
            } catch(e) {
                console.log(e)
            }
        }

    if(loading) return (
        <div className="dashboard">
            <nav>
                <div className="logo">Snap<span>URL</span></div>
            </nav>
            <div className="dashboard-content">
                {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
        </div>
    )

        return (
            <div className="dashboard">
                <nav>
                    <div className="logo">Snap<span>URL</span></div>
                    <div className="nav-links">
                        <button onClick={() => navigate("/app")}>Shorten URL</button>
                        <button onClick={() => {
                            localStorage.removeItem("token")
                            navigate("/")
                        }}>Logout</button>
                    </div>
                </nav>

                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <h1>Your <span>Links</span></h1>
                        <div className="total-links">
                            <span>{urls.length}</span> links created
                        </div>
                    </div>

                    {urls.length === 0 ? (
                        <div className="empty-state">
                            <h2>No links yet!</h2>
                            <p>Start shortening URLs to see them here.</p>
                            <button onClick={() => navigate("/app")}>Shorten your first URL</button>
                        </div>
                    ) : (
                        urls.map((url) => (
                            <div
                                key={url._id}
                                className={`url-card ${!url.isActive ? "disabled" : ""}`}
                            >
                                <div className="card-top">
                                    <p className="original-url">{url.originalurl}</p>
                                    <span className="clicks-badge">{url.clicks} clicks</span>
                                </div>

                                    <a 
                                        href={`${BASE_URL}/${url.shorturl}`} 
                                        target="_blank" 
                                        className="short-url-text"
                                        >
                                        {BASE_URL}/{url.shorturl}
                                    </a>

                                <div className="card-actions">
                                    <button onClick={() => setQrModal(url)}>
                                            QR Code
                                                </button>
                                    <button onClick={() => handleCopy(url.shorturl, url._id)}>
                                        {copiedId === url._id ? "✓ Copied!" : "Copy"}
                                    </button>
                                    <button
                                        className={!url.isActive ? "btn-toggle-off" : ""}
                                        onClick={() => handleToggle(url._id)}
                                    >
                                        {url.isActive ? "Disable" : "Enable"}
                                    </button>
                                    <button onClick={() => handleAnalytics(url._id)}>
                                        {showAnalytics === url._id ? "Hide Analytics" : "Analytics"}
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(url._id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {showAnalytics === url._id && analyticsData[url._id] && (
                                    <div className="analytics-section">
                                        {analyticsData[url._id].length === 0 ? (
                                            <p style={{color:"#444", fontSize:"13px"}}>
                                                No clicks yet!
                                            </p>
                                        ) : (
                                            analyticsData[url._id].slice(0,6).map((click, i) => (
                                                <div className="analytics-item" key={i}>
                                                    <label>Click {i + 1}</label>
                                                    <p>{click.browser} · {click.os}</p>
                                                    <p style={{color:"#555", fontSize:"11px"}}>
                                                        {click.device}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                    {qrModal && (
    <div 
        onClick={() => setQrModal(null)}
        style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999
        }}
    >
        <div 
            onClick={(e) => e.stopPropagation()}
            style={{
                background: "var(--bg-secondary)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "32px",
                width: "320px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                position: "relative"
            }}
        >
            {/* Close button */}
            <button 
                onClick={() => setQrModal(null)}
                style={{
                    position: "absolute",
                    top: "12px", right: "12px",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    width: "28px", height: "28px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "var(--glass)";
                    e.target.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--muted)";
                }}
            >✕</button>

            <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "8px"
            }}>QR Code</h3>

            <p style={{
                fontSize: "12px",
                color: "var(--accent)",
                marginBottom: "20px",
                wordBreak: "break-all",
                fontWeight: "600"
            }}>{BASE_URL}/{qrModal.shorturl}</p>

            <img 
                src={qrModal.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${BASE_URL}/${qrModal.shorturl}`}
                alt="QR Code"
                style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    border: "1px solid var(--border)"
                }}
            />

            <a 
                href={qrModal.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${BASE_URL}/${qrModal.shorturl}`}
                download="snapurl-qr.png"
            >
                <button style={{
                    width: "100%",
                    background: "var(--accent)",
                    border: "none",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.background = "var(--accent-pink)"}
                onMouseLeave={(e) => e.target.style.background = "var(--accent)"}
                >
                    Download QR
                </button>
            </a>
        </div>
    </div>
)}
                
                        
            </div>
        )
    }

    export default Dashboard