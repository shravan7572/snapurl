import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Analytics } from '@vercel/analytics/react'
import Home from "./pages/home"
import Dashboard from "./pages/dashboard"
import Landing from "./pages/landing"
import OAuthSuccess from "./pages/OAuthSuccess"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/app" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/oauth-success" element={<OAuthSuccess />} />
                <Route path="/signin" element={<Navigate to="/" replace />} />
                <Route path="/signup" element={<Navigate to="/" replace />} />
            </Routes>
            <Analytics />
        </BrowserRouter>
    )
}

export default App
