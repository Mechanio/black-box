import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleClick = async (event) => {
        event.preventDefault()

        try {
           const response = await authService.login(email, password)
            if (response && response.data && response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate('/profile')
                return response.data;
            } else {
                throw new Error(response.response.data.message)
            }
        } catch(err) {
            setError(err.message)
        }
    }

    return (
        <div className="login">
            <div className="left-div"></div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form className="login-form" onSubmit={handleClick}>
                <div className="login-form-row">
                    <div className="login-form-column" style={{ marginRight: '10px' }}>
                        <label>Email:</label>
                        <label>Password:</label>
                    </div>
                    <div className="login-form-column">

                        <input  type="email" value={email}
                           onChange={(e) => setEmail(e.target.value)}/>

                        <input  type="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                        <button className="btn btn-primary" type="submit">Login</button>
                    </div>

                </div>
            </form>
            <div className="right-div"></div>
        </div>
    )
}