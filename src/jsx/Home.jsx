import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// function FileUploadTest() {
//     const [fileUploadMessage, setFileUploadMessage] = useState('')
//     const [imgSrc, setImgSrc] = useState('http://localhost:5093/storedFile/download/babe6c36-60e0-40f3-9d96-c60bac9cc2e7');

//     async function onChangeFileInput(e) {
//         const file = e.target.files[0];
//         if (!file) return

//         const formData = new FormData();
//         formData.append('file', file)

//         setFileUploadMessage('Uploading...')
//         const response = await fetch(`${API_BASE_URL}/storedFile`, {
//             method: 'POST',
//             credentials: "include",
//             body: formData,
//         })

//         if (!response.ok) {
//             setFileUploadMessage('Something went wrong')
//         }

//         setFileUploadMessage('Uploaded')

//         const data = await response.json()
//         setImgSrc(`${API_BASE_URL}/storedFile/download/${data.id}`)
//     }

//     return <>
//         <input type="file" onChange={onChangeFileInput} />
//         <div>{fileUploadMessage}</div>
//         <img src={imgSrc} />
//     </>
// }

function SeaBeanEntries() {
    const [isLoading, setIsLoading] = useState(true)
    const [seaBeanEntries, setSeaBeanEntries] = useState([])

    useEffect(() => {
        async function getSeaBeanEntries() {
            const response = await fetch(`${API_BASE_URL}/seaBeanEntry`, {
                credentials: "include"
            })
            const responseJson = await response.json()
            setSeaBeanEntries(responseJson)
            setIsLoading(false)
        }

        getSeaBeanEntries()
    }, [])

    if (isLoading) {
        return <>
            Loading Sea Beans...
        </>
    }

    return <>
        {seaBeanEntries.map((seaBeanEntry) => {
            return <>
                <div key={seaBeanEntry.id}>
                    <div>Id: {seaBeanEntry.id}</div>
                    <div>SeaBeanId: {seaBeanEntry.seaBeanId}</div>
                    <div>Notes: {seaBeanEntry.notes}</div>
                    <div>Latitude: {seaBeanEntry.latitude}</div>
                    <div>Longitude: {seaBeanEntry.longitude}</div>
                    <div>DateCreated: {seaBeanEntry.seaBeanId}</div>
                    <div>EntryDate: {seaBeanEntry.seaBeanId}</div>
                    <div>
                        {seaBeanEntry.storedFileIds?.map((storedFileId) => {
                            return <>
                                <img 
                                    loading="lazy"
                                    src={`${API_BASE_URL}/storedFile/download/${storedFileId}`}
                                />
                            </>
                        })}
                    </div>
                </div>
            </>
        })}
    </>
}

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
        <br />
        <SeaBeanEntries />
    </>
}