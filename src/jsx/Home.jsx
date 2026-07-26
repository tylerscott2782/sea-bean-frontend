import { useNavigate } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function Home() {
    const navigate = useNavigate()

    async function handleClickLogoutButton() {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
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