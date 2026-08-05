import { Link, useNavigate, Outlet } from "react-router-dom"
import { SeaBeanEntryForm } from "./SeaBeanEntryForm"
import { useState } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function NavBar() {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

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
        <div style={{ margin: "0 auto", width: "100%", maxWidth: "900px", padding: "20px 15px 200px 15px", minHeight: "100dvh" }}>
            <div style={{ borderBottom: "1px solid #e6e8f0", padding: "0 0 15px 0", margin: "0 0 15px 0", display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link style={{ color: "#e6e8f0" }} to="/home">Home</Link>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link style={{ color: "#e6e8f0" }} to="/profile">Profile</Link>
                    <button onClick={handleClickLogoutButton}>Logout</button>
                </div>
            </div>
            <button
                style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    backgroundColor: "#c0ddff",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    padding: "10px 20px",
                    position: "fixed",
                    bottom: "10px",
                    right: "30px"
                }}
                onClick={() => setIsModalOpen(!isModalOpen)}
            >
                + New Sea Bean Entry
            </button>
            <Outlet />
        </div>

        {isModalOpen ? <>
            <div style={{ position: "fixed", top: "0", width: "100dvw", height: "100dvh", backgroundColor: "#00000099" }}>
                <div style={{ maxWidth: "1000px", width: "100%", height: "800px", maxHeight: "95%", backgroundColor: "#1c202c", borderRadius: "30px", margin: "5% auto", padding: "30px" }}>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ fontSize: "20px", marginBottom: "20px" }}><strong>New Sea Bean Entry</strong></div>
                            <div
                                style={{ fontSize: "30px", cursor: "pointer" }}
                                onClick={() => setIsModalOpen(false)}
                            >x</div>
                        </div>

                        <SeaBeanEntryForm />
                    </div>
                </div>
            </div>
        </> : null}

    </>
}