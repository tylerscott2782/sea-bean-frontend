import { useState } from "react"

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [testResultMessage, setTestResultMessage] = useState('')

    function handleChangeUsername(e) {
        const value = e.target.value
        setUsername(value)
    }

    function handleChangePassword(e) {
        const value = e.target.value
        setPassword(value)
    }

    function handleButtonClick() {
        if (username?.length === 0) {
            setMessage('Please enter a username')
            return
        }
        if (password?.length === 0) {
            setMessage('Please enter a password')
            return
        }
        setMessage('')
        fetch('https://localhost:7125/auth/login', {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            setMessage(response.status)
        })
    }

    function handleTestButtonClick() {
        fetch('https://localhost:7125/auth/me', {
            credentials: "include"
        })
        .then((response) => {
            if (response.ok) {
                setTestResultMessage('ok')
            } else {
                setTestResultMessage(':[')
            }
        })
    }

    return <>
        <input placeholder="Username" type="text" value={username} onChange={handleChangeUsername} />
        <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} />
        <button onClick={handleButtonClick}>Submit</button>
        <div>{message}</div>
        <br />
        <button onClick={handleTestButtonClick}>Test Connection</button>
        <div>{testResultMessage}</div>
    </>
}