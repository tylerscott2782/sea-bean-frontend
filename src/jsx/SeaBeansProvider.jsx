import { useEffect, useState } from "react";
import { SeaBeansContext } from "./SeaBeansContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function SeaBeansProvider({ children }) {
    const [seaBeans, setSeaBeans] = useState([])

    useEffect(() => {
        async function loadSeaBeans() {
            const response = await fetch(`${API_BASE_URL}/seaBean`, {
                credentials: "include"
            })
            setSeaBeans(await response.json())
        }

        loadSeaBeans()
    }, [])

    return <>
        <SeaBeansContext value={{ seaBeans }}>
            {children}
        </SeaBeansContext>
    </>
}