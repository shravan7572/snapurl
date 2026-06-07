import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Home.css"


//clear all the bugs    
function Home() {
    const [url,       setUrl]       = useState("")
    const [alias,     setAlias]     = useState("")
    const [result,    setResult]    = useState(null)
    const [error,     setError]     = useState("")
    const [copied,    setCopied]    = useState(false)

    const navigate = useNavigate()

    async function handleShorten() {
        if(!url) return setError("Please enter a URL!")
        setError("")
        try {
            const response = await axios.post(
                "http://localhost:5001/api/shorten",
                { originalurl: url, aliasurl: alias },
                { headers: { token: localStorage.getItem("token") } }
            )
            setResult(response.data)
        } catch(e) {
            setError(e.response?.data?.message || "Something went wrong!")
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(result.shorturl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleShare() {
        if(navigator.share) {
            navigator.share({ url: result.shorturl, title: "Check this link!" })
        } else {
            handleCopy()
        }
    }

    return (
        <div className="home">
            <nav>
                <div className="logo">Snap<span>URL</span></div>
                <div className="nav-links">
                    <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                    <button className="btn-primary" onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/signin")
                    }}>Logout</button>
                </div>
            </nav>

            <div className="hero">
                <h1>Shorten. Share.<br /><span>Track everything.</span></h1>
                <p>Powerful link management with click analytics and custom aliases.</p>

                {error && <p className="error">{error}</p>}

                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Paste your long URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button onClick={handleShorten}>Shorten →</button>
                </div>

                <input
                    className="alias-input"
                    type="text"
                    placeholder="Custom alias (optional) e.g. my-portfolio"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />

                {result && (
                    <div className="result-card">
                        <h3>Your Short URL</h3>
                        <p className="short-url">{result.shorturl}</p>

                        <div className="result-actions">
                            <button onClick={handleCopy}>
                                {copied ? "✓ Copied!" : "Copy Link"}
                            </button>
                            <button onClick={handleShare}>Share</button>
                            <button onClick={() => navigate("/dashboard")}>
                                View All Links
                            </button>
                        </div>
                        

                        {result.qrCode && (
                            <div className="qr-section">
                                <h3>QR Code</h3>
                                <img src={result.qrCode} alt="QR Code" />
                                <br />
                                <a href={result.qrCode} download="snapurl-qr.png">
                                    <button style={{
                                        background: "none",
                                        border: "1px solid #333",
                                        color: "#aaa",
                                        padding: "8px 20px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "14px"
                                    }}>
                                        Download QR
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home