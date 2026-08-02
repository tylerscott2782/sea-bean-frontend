import { useEffect, useState } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function ProfileRow({ title, value }) {
    const [isEdit, setIsEdit] = useState(false)

    return <>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", marginTop: "20px" }}>
            <div><strong>{title}</strong></div>
            <div>
                <button style={{ marginRight: "20px" }} onClick={() => setIsEdit(!isEdit)}>
                    {!isEdit ? "Edit" : "Save"}
                </button>
                {!isEdit ? (value ?? <i>Not Set</i>) : <input value={value} />}
            </div>
        </div>
    </>
}

export default function Profile() {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: "include"
            })
            const userJson = await response.json()

            setUser(userJson)
            setIsLoading(false)
        }

        load()
    }, [])

    if (isLoading) {
        return <>
            Loading...
        </>
    }

    return <>
        <div style={{ backgroundColor: "#1b1d21", padding: "20px", borderRadius: "10px" }}>
            <div style={{ fontSize: "28px", marginBottom: "30px" }}><strong>Profile</strong></div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
                <div style={{ height: "100px", aspectRatio: "1", borderRadius: "50px", backgroundColor: "gray" }}></div>
                <input type="file" accept="image/*" />
            </div>
            <ProfileRow
                key={"alias"}
                title={"Alias"}
                value={user.alias}
            />
            <ProfileRow
                key={"username"}
                title={"Username"}
                value={user.username}
            />
        </div>
    </>
}