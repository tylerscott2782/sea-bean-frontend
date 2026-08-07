import { useEffect, useState } from "react";
import { CurrentUserContext } from "./CurrentUserContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function CurrentUserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        async function loadCurrentUser() {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: "include"
            })
            setCurrentUser(await response.json())
        }

        loadCurrentUser()
    }, [])

    return <>
        <CurrentUserContext value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUserContext>
    </>
}