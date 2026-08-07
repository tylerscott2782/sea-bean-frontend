import { useState } from "react"
import { useCurrentUser } from "./CurrentUserContext"
import { FileUploadForm } from "./FileUploadForm"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function ProfileRow({ title, value }) {
    const [isEdit, setIsEdit] = useState(false)

    return <>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", marginTop: "20px" }}>
            <div><strong>{title}</strong></div>
            <div>
                <button style={{ marginRight: "20px", display: "none" }} onClick={() => setIsEdit(!isEdit)}>
                    {!isEdit ? "Edit" : "Save"}
                </button>
                {!isEdit ? (value ?? <i>Not Set</i>) : <input value={value} />}
            </div>
        </div>
    </>
}

function ProfileImageForm({ currentUser }) {
    const { setCurrentUser } = useCurrentUser()

    async function handleFileUploaded(storedFile) {
        const response = await fetch(`${API_BASE_URL}/user/${currentUser.id}`, {
            credentials: "include",
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...currentUser, profilePictureId: storedFile.id })
        })
        if (!response.ok) return

        setCurrentUser(await response.json())
    }

    return <>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
            <div
                style={{
                    height: "100px",
                    aspectRatio: "1",
                    borderRadius: "50px",
                    backgroundColor: "gray",
                    ...(currentUser?.profilePictureId ? { background: `url("${API_BASE_URL}/storedFile/download/${currentUser.profilePictureId}/thumbnail") center center no-repeat` } : {})
                }}
            ></div>
            <FileUploadForm
                handleFileUploaded={handleFileUploaded}
            />
        </div>
    </>
}

export default function Profile() {
    const { currentUser } = useCurrentUser()

    if (!currentUser) {
        return <>
            Loading...
        </>
    }

    return <>
        <div style={{ backgroundColor: "#1b1d21", padding: "20px", borderRadius: "10px" }}>
            <div style={{ fontSize: "28px", marginBottom: "30px" }}><strong>Profile</strong></div>
            <ProfileImageForm
                currentUser={currentUser}
            />
            {/* <ProfileRow
                key={"alias"}
                title={"Alias"}
                value={currentUser.alias}
            /> */}
            <ProfileRow
                key={"username"}
                title={"Username"}
                value={currentUser.username}
            />
        </div>
    </>
}