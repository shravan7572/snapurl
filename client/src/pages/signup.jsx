import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Signup() {
    const [firstname, setFirstname] = useState("")
    const [lastname,  setLastname]  = useState("")
    const [email,     setEmail]     = useState("")
    const [password,  setPassword]  = useState("")
    const [error,     setError]     = useState("")

    const navigate = useNavigate()

    async function handleSignup() {
        try {
            await axios.post("http://localhost:5001/user/sign-up", {
                firstname,
                lastname,
                email,
                password
            })
            navigate("/signin")

        } catch(e) {
            setError(e.response?.data?.message || "Sign-up failed!! check your cerendials")
        }
    }

    return (
        <div>
            <h1>Create Account</h1>

            {error && <p style={{color:"red"}}>{error}</p>}

            <input 
                type="text" 
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
            />
            <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSignup}>Sign Up</button>
            <p>Already have an account? 
                <span style={{cursor:"pointer"}}onClick={() => navigate("/signin")}>Login</span>
            </p>
        </div>
    )
}

export default Signup