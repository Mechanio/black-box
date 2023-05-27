import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import fetchservice from "../services/fetch.service";
import authService from "../services/auth.service";

export default function Register() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authService.signup(firstname, lastname, nickname, email, password)
            if(response && response.data && response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/profile")
            } else {
                throw new Error(response.response.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="login">
            <div className="left-div"></div>
            <h2 className="text-center">Add a New User</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-form-row">
                    <div className="login-form-column" style={{ marginRight: '10px' }}>
                        <label>Firstname:</label>
                        <label>Lastname:</label>
                        <label>Nickname:</label>
                        <label>Email:</label>
                        <label>Password:</label>
                    </div>
                    <div className="login-form-column">
                        <input type="text" required value={firstname} onChange={(e) => setFirstname(e.target.value)}/>
                        <input type="text" required value={lastname} onChange={(e) => setLastname(e.target.value)}/>
                        <input type="text" required value={nickname} onChange={(e) => setNickname(e.target.value)}/>
                        <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <button className="btn btn-primary" type="submit">Create</button>
                    </div>

                </div>
            </form>
            <div className="right-div"></div>
        </div>
    )

}
