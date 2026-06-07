import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Dashboard.css"
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

    function handleCopy(url, id) {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    // toggle enable/disable
    async function handleToggle(id) {
        try {
            await axios.patch(
                `http://localhost:5001/api/${id}/toggle`,
                {},
                { headers: { token } }
            )
            fetchUrls()  // refresh list
        } catch(e) {
            console.log(e)
        }
    }

    // delete url
    async function handleDelete(id) {
        try {
            await axios.delete(
                `http://localhost:5001/api/urls/${id}`,
                { headers: { token } }
            )
            fetchUrls()  // refresh list
        } catch(e) {
            console.log(e)
        }
    }

    // fetch analytics for a specific url
    async function handleAnalytics(id) {
        if(showAnalytics === id) {
            setShowAnalytics(null)  // toggle off
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
        <div className="orb orb-blue"></div>
        <div className="orb orb-yellow"></div>
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
             <div className="orb orb-blue"></div>
        <div className="orb orb-yellow"></div>
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

                            <p className="short-url-text">{url.shorturl}</p>

                            <div className="card-actions">
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
        </div>
    )
}

export default Dashboard