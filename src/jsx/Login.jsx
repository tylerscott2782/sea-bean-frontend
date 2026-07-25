import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [testResultMessage, setTestResultMessage] = useState('')
    const navigate = useNavigate()

    async function fetchMe() {
        const response = await fetch('https://localhost:7125/auth/me', {
            credentials: "include"
        })
        return response
    }

    useEffect(() => {
        const controller = new AbortController();

        async function checkAuthStatus() {
            const response = await fetchMe()
            if (response.ok) {
                navigate('/dashboard')
            }
        }
        
        checkAuthStatus()

        return () => controller.abort()
    }, [navigate])

    function handleChangeUsername(e) {
        const value = e.target.value
        setUsername(value)
    }

    function handleChangePassword(e) {
        const value = e.target.value
        setPassword(value)
    }

    async function handleButtonClick() {
        if (!username) {
            setMessage('Please enter a username')
            return
        }
        if (!password) {
            setMessage('Please enter a password')
            return
        }
        setMessage('')

        const response = await fetch('https://localhost:7125/auth/login', {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
        setMessage(response.status)
    }

    async function handleTestButtonClick() {
        const response = await fetchMe()
        if (response.ok) {
            setTestResultMessage('ok')
        } else {
            setTestResultMessage(':[')
        }
    }

    return <>
        <h1>Login</h1>
        <input placeholder="Username" type="text" value={username} onChange={handleChangeUsername} />
        <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} />
        <button onClick={handleButtonClick}>Submit</button>
        <div>{message}</div>
        <br />
        <button onClick={handleTestButtonClick}>Test Connection</button>
        <div>{testResultMessage}</div>
        <br />
        <Link to="/register">Register</Link>
    </>
}