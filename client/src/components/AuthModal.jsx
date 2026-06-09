import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Modal from "./Modal"
import "./AuthModal.css"

export default function AuthModal({ mode: initialMode, onClose }) {
    const [mode, setMode] = useState(initialMode)
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/sign-in`, { email, password })
            localStorage.setItem("token", res.data.token)
            onClose()
            navigate("/app")
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.")
        } finally {
            setLoading(false)
        }
    }

    async function handleSignup(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/user/sign-up`, { firstname, lastname, email, password })
            setMode("login")
            setError("")
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal onClose={onClose}>
            <div className="auth-modal">
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`auth-tab ${mode === "login" ? "auth-tab--active" : ""}`}
                        onClick={() => { setMode("login"); setError("") }}
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${mode === "signup" ? "auth-tab--active" : ""}`}
                        onClick={() => { setMode("signup"); setError("") }}
                    >
                        Sign up
                    </button>
                </div>

                <div className="auth-modal-body">
                    <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
                    <p className="auth-subtitle">
                        {mode === "login"
                            ? "Enter your credentials to access your links."
                            : "Start shortening and tracking links in seconds."}
                    </p>

                    {error && <div className="alert">{error}</div>}

                    <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="auth-form">
                        {mode === "signup" && (
                            <div className="auth-row">
                                <div className="field">
                                    <label className="field-label" htmlFor="first">First name</label>
                                    <input id="first" className="input" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                                </div>
                                <div className="field">
                                    <label className="field-label" htmlFor="last">Last name</label>
                                    <input id="last" className="input" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                                </div>
                            </div>
                        )}
                        <div className="field">
                            <label className="field-label" htmlFor="email">Email</label>
                            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label className="field-label" htmlFor="password">Password</label>
                            <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                            {loading ? <span className="spinner" /> : mode === "login" ? "Log in" : "Create account"}
                        </button>
                    </form>

                    <div className="auth-divider"><span>or</span></div>

                    <button
                        type="button"
                        className="btn btn-secondary auth-google"
                        onClick={() => { window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google` }}
                    >
                        <img src="https://www.google.com/favicon.ico" width="16" height="16" alt="" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </Modal>
    )
}
