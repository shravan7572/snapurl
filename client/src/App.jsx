import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Signin from "./pages/signin"
import Signup from "./pages/signup"
import Dashboard from "./pages/dashboard"
import Landing from "./pages/landing"

function App() {
    return (
        <BrowserRouter>
            <Routes>
               <Route path="/"           element={<Landing />} />   
                <Route path="/app"       element={<Home />} />     
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/signin"     element={<Signin />} />
                <Route path="/signup"    element={<Signup />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App