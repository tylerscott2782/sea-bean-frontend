import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    async function fetchMe() {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            credentials: "include"
        })
        return response
    }

    useEffect(() => {
        const controller = new AbortController();

        async function checkAuthStatus() {
            const response = await fetchMe()
            if (response.ok) {
                navigate('/home')
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

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
        if (response.status === 401) {
            setMessage('Invalid credentials')
            return
        }
        if (!response.ok) {
            setMessage('Something went wrong')
            return
        }
        const checkResponse = await fetchMe()
        if (checkResponse.ok) {
            navigate('/home')
        }
    }

    return <>
        <h1>Login</h1>
        <input placeholder="Username" type="text" value={username} onChange={handleChangeUsername} />
        <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} />
        <button onClick={handleButtonClick}>Submit</button>
        <div>{message}</div>
        <br />
        <Link to="/register">Register</Link>
    </>
}