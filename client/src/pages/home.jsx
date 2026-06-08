import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Home.css"

function Home() {
    const [url,      setUrl]      = useState("")
    const [alias,    setAlias]    = useState("")
    const [messages, setMessages] = useState([])
    const [error,    setError]    = useState("")
    const [copied,   setCopied]   = useState(false)
    const [loading,  setLoading]  = useState(false)
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    async function handleShorten() {
        if(!url.trim()) {
            setError("Please enter a URL!")
            return
        }
        
        setError("")
        setLoading(true)

        const userMessage = {
            type: "user",
            text: `Shorten URL${alias ? ` with alias "${alias}"` : ""}: ${url}`
        }
        setMessages(prev => [...prev, userMessage])
        setUrl("")
        setAlias("")

        try {
            const response = await axios.post(
                "http://localhost:5001/api/shorten",
                { originalurl: url, aliasurl: alias },
                { headers: { token: localStorage.getItem("token") } }
            )
            
            const assistantMessage = {
                type: "assistant",
                text: `Your short link is ready`,
                data: response.data
            }
            setMessages(prev => [...prev, assistantMessage])
        } catch(e) {
            const errorMsg = {
                type: "error",
                text: e.response?.data?.message || "Something went wrong!"
            }
            setMessages(prev => [...prev, errorMsg])
            setError(e.response?.data?.message || "Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    function handleCopy(shorturl) {
        navigator.clipboard.writeText(shorturl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleShorten()
        }
    }

    return (
        <div className="home">
            {/* NAVBAR */}
            <nav className="home-nav">
                <div className="logo" onClick={() => navigate("/")}>
                    Snap<span>URL</span>
                </div>
                <div className="nav-links">
                    <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                    <button className="btn-logout" onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/")
                    }}>Logout</button>
                </div>
            </nav>

            {/* CHAT CONTAINER */}
            <div className="chat-container">
                
                {/* MESSAGES */}
                <div className="messages-area">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔗</div>
                            <h2>Welcome to SnapURL</h2>
                            <p>Paste a URL below to create a short link with analytics and QR code</p>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message message-${msg.type}`}>
                                    <div className="message-content">
                                        <p className="message-text">{msg.text}</p>
                                        
                                        {msg.type === "assistant" && msg.data && (
                                            <div className="result-card">
                                                <div className="result-item">
                                                    <span className="label">Short URL</span>
                                                    <div className="url-display">
                                                        <code>{msg.data.shorturl}</code>
                                                        <button 
                                                            className="copy-btn"
                                                            onClick={() => handleCopy(msg.data.shorturl)}
                                                        >
                                                            {copied ? "✓" : "📋"}
                                                        </button>
                                                    </div>
                                                </div>

                                                {msg.data.qrCode && (
                                                    <div className="qr-section">
                                                        <span className="label">QR Code</span>
                                                        <img src={msg.data.qrCode} alt="QR" className="qr-img" />
                                                        <a href={msg.data.qrCode} download="snapurl-qr.png">
                                                            <button className="download-btn">Download</button>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* INPUT AREA */}
                <div className="input-area">
                    {error && <p className="error-banner">{error}</p>}
                    
                    <div className="input-group">
                        <input
                            type="text"
                            className="url-input"
                            placeholder="Paste your URL here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        
                        <input
                            type="text"
                            className="alias-input"
                            placeholder="Custom alias (optional)"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        
                        <button 
                            className="send-btn"
                            onClick={handleShorten}
                            disabled={loading}
                        >
                            {loading ? "..." : "→"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home