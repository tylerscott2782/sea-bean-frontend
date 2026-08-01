import { useState } from "react"
import { Link } from "react-router-dom"
import fetchRetry from "./fetchRetry"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function Register() {
    const [username, setUsername] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [message, setMessage] = useState('')

    function handleChangeUsername(e) {
        const value = e.target.value
        setUsername(value)
    }

    function handleChangePassword1(e) {
        const value = e.target.value
        setPassword1(value)
    }

    function handleChangePassword2(e) {
        const value = e.target.value
        setPassword2(value)
    }

    async function handleCreateAccountButtonClick() {
        if (!username) {
            setMessage('Please enter a username')
            return
        }
        if (!password1 || !password2) {
            setMessage('Please enter a password')
            return
        }
        if (password1 !== password2) {
            setMessage('Passwords do not match')
            return
        }
        setMessage('')
        const response = await fetchRetry(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password: password1
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.ok) {
            setMessage('Account Created Successfully! Please return to the login page below.')
        } else if (response.status === 409) {
            const conflictMessage = await response.text()
            setMessage(conflictMessage)
        }
    }

    return <>
        <h1>Register</h1>
        <input placeholder="Username" type="text" value={username} onChange={handleChangeUsername} />
        <input placeholder="Password" type="password" value={password1} onChange={handleChangePassword1} />
        <input placeholder="Verfiy Password" type="password" value={password2} onChange={handleChangePassword2} />
        <button onClick={handleCreateAccountButtonClick}>Create Account</button>
        <div>{message}</div>
        <br />
        <Link to="/login">Back to Login</Link>
    </>
}