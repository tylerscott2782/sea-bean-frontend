import { Link, useNavigate, Outlet } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function NavBar() {
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
        <div style={{ margin: "0 auto", width: "100%", maxWidth: "900px", minWidth: "500px", padding: "25px 30px", minHeight: "100vh" }}>
            <div style={{ borderBottom: "1px solid #e6e8f0", padding: "0 0 15px 0", margin: "0 0 15px 0", display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link style={{ color: "#e6e8f0" }} to="/home">Home</Link>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link style={{ color: "#e6e8f0" }} to="/profile">Profile</Link>
                    <button onClick={handleClickLogoutButton}>Logout</button>
                </div>
            </div>
            <button style={{
                cursor: "pointer",
                fontSize: "20px",
                // backgroundColor: "#434361",
                // color: "#e6e8f0",
                backgroundColor: "#c0ddff",
                borderRadius: "10px", 
                marginBottom: "15px",
                padding: "10px 20px",
                position: "fixed",
                bottom: "10px",
                right: "30px"
            }}>
                + New Sea Bean Entry
            </button>
            <Outlet />
        </div>
    </>
}