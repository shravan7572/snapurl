import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Home.css"

function Home() {
    const [url,    setUrl]    = useState("")
    const [alias,  setAlias]  = useState("")
    const [result, setResult] = useState(null)
    const [error,  setError]  = useState("")
    const [copied, setCopied] = useState(false)

    const navigate = useNavigate()

    async function handleShorten() {
        if(!url.trim()) return setError("Please enter a URL!")
        setError("")
        try {
            const response = await axios.post(
                "http://localhost:5001/api/shorten",
                { originalurl: url, aliasurl: alias },
                { headers: { token: localStorage.getItem("token") } }
            )
            setResult(response.data)
        } catch(e) {
            setResult(null)
            setError(e.response?.data?.message || "Something went wrong!")
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(result.shorturl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleShare() {
        if(navigator.share) navigator.share({ url: result.shorturl })
        else handleCopy()
    }

    return (
        <div className="home">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            {/* NAVBAR */}
            <nav className="home-nav">
                <div className="logo" onClick={() => navigate("/")}>
                    Snap<span>URL</span>
                </div>
                <div className="nav-links">
                    <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                    <button className="btn-primary" onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/")
                    }}>Logout</button>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="home-content">

                {/* LEFT SIDE */}
                <div className="home-left">
                    <h1>Shorten<br />your link.</h1>
                    <p>Paste any URL below and get a clean short link with QR code and analytics.</p>

                    <div className="form-card">
                        {error && <p className="error">{error}</p>}
                        {result?.message && (
                            <p className="message-box">ℹ️ {result.message}</p>
                        )}

                        <label className="input-label">Long URL</label>
                        <input
                            className="url-input"
                            type="text"
                            placeholder="https://your-very-long-url.com/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                        <label className="input-label">Custom Alias <span>(optional)</span></label>
                        <input
                            className="url-input"
                            type="text"
                            placeholder="e.g. my-portfolio"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                        />

                        <button className="shorten-btn" onClick={handleShorten}>
                            Shorten URL →
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE - RESULT */}
                <div className="home-right">
                    {!result ? (
                        <div className="empty-result">
                            <div className="empty-icon">🔗</div>
                            <h3>Your short link<br />appears here</h3>
                            <p>Paste a URL on the left<br />and click Shorten</p>
                        </div>
                    ) : (
                        <div className="result-content">
                            <div className="result-label">YOUR SHORT LINK</div>
                            <div className="result-url">{result.shorturl}</div>

                            <div className="result-btns">
                                <button onClick={handleCopy}>
                                    {copied ? "✓ Copied!" : "Copy Link"}
                                </button>
                                <button onClick={handleShare}>Share</button>
                                <button onClick={() => navigate("/dashboard")}>
                                    Dashboard
                                </button>
                            </div>

                            {result.qrCode && (
                                <div className="qr-box">
                                    <div className="result-label">QR CODE</div>
                                    <img src={result.qrCode} alt="QR Code" />
                                    <a href={result.qrCode} download="snapurl-qr.png">
                                        <button className="download-btn">Download QR</button>
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Home