import { useNavigate } from "react-router-dom"


export default function Home() {
    const navigate = useNavigate()

    async function handleClickLogoutButton() {
        const response = await fetch('https://localhost:7125/auth/logout', {
            method: "POST",
            credentials: "include"
        })

        if (response.ok) {
            navigate('/')
        }
    }

    return <>
        <button onClick={handleClickLogoutButton}>Logout</button>
    </>
}