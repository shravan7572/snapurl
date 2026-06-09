import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./oauth.css"

export default function OAuthSuccess() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")
        if (token) {
            localStorage.setItem("token", token)
            navigate("/dashboard", { replace: true })
        } else {
            navigate("/", { replace: true })
        }
    }, [navigate])

    return (
        <div className="oauth-loading">
            <span className="spinner" />
            <p>Signing you in…</p>
        </div>
    )
}
