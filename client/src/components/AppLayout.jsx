import { NavLink, useNavigate } from "react-router-dom"
import ThemeToggle from "./ThemeToggle"
import "./AppLayout.css"

export default function AppLayout({ children }) {
    const navigate = useNavigate()

    function logout() {
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="app-header-shell">
                    <div className="app-header-inner">
                        <button type="button" className="app-brand" onClick={() => navigate("/app")}>
                            Snap<span>URL</span>
                        </button>

                        <nav className="app-nav" aria-label="Main">
                            <NavLink to="/app" className={({ isActive }) => `app-nav-link ${isActive ? "app-nav-link--active" : ""}`} end>
                                Workspace
                            </NavLink>
                            <NavLink to="/dashboard" className={({ isActive }) => `app-nav-link ${isActive ? "app-nav-link--active" : ""}`}>
                                All links
                            </NavLink>
                        </nav>

                        <div className="app-header-actions">
                            <ThemeToggle />
                            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="app-main">
                <div className="app-main-inner animate-in">
                    {children}
                </div>
            </main>
        </div>
    )
}
