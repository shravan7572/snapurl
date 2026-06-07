import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Signup() {
    const [email,     setEmail]     = useState("")
    const [password,  setPassword]  = useState("")
    const [error,     setError]     = useState("")

    const navigate = useNavigate()

    async function handlesignin() {
        try {
         const response=  await axios.post("http://localhost:5001/user/sign-in", {
                email,
                password
            }
    )
        localStorage.setItem("token",response.data.token)
            navigate("/")

        } catch(e) {
            setError(e.response?.data?.message || "Sign-in failed!! check your cerendials")
        }
    }

    return (
        <div>
            <h1>Create Account</h1>

            {error && <p style={{color:"red"}}>{error}</p>}

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

            <button onClick={handlesignin}>Sign Up</button>

        </div>
    )
}

export default Signup