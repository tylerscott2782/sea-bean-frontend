import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function SeaBeanSelector({ seaBeans, handleSeaBeanSelected }) {
    function onChangeSelect(e) {
        const id = e.target.value
        const selectedSeaBean = seaBeans.find(sb => sb.id === id)
        handleSeaBeanSelected?.(selectedSeaBean)
    }

    return <>
        <select onChange={onChangeSelect}>
            {seaBeans.map((seaBean) => {
                return (
                    <option
                        key={seaBean.id}
                        value={seaBean.id}
                    >
                        {seaBean.name}
                    </option>
                )
            })}
        </select>
    </>
}

function FileUploadForm({ handleFileUploaded }) {
    const [isUploading, setIsUploading] = useState(false)

    async function onChangeFileInput(e) {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        setIsUploading(true)
        const response = await fetch(`${API_BASE_URL}/storedFile`, {
            method: 'POST',
            credentials: "include",
            body: formData
        })
        setIsUploading(false)

        if (!response.ok) return

        const storedFile = await response.json()
        handleFileUploaded?.(storedFile)
    }

    if (isUploading) {
        return <>
            Uploading...
        </>
    }

    return <>
        <input type="file" onChange={onChangeFileInput} />
    </>
}

function SeaBeanEntryForm({ seaBeans, handleSeaBeanEntryCreated }) {
    const [seaBeanId, setSeaBeanId] = useState('')
    const [notes, setNotes] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [entryDate, setEntryDate] = useState(new Date().toISOString())
    const [storedFiles, setStoredFiles] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    function clearFields() {
        setSeaBeanId('')
        setNotes('')
        setLatitude('')
        setLongitude('')
        setEntryDate(new Date().toISOString())
        setStoredFiles([])
    }

    function handleClickUseLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
        })
    }

    function handleFileUploaded(storedFile) {
        setStoredFiles([...storedFiles, storedFile])
    }

    async function handleClickSubmit() {
        setIsSubmitting(true)
        const response = await fetch(`${API_BASE_URL}/seaBeanEntry`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                seaBeanId,
                notes,
                latitude,
                longitude,
                entryDate,
                storedFileIds: storedFiles.map(sf => sf.id)
            })
        })
        setIsSubmitting(false)

        if (!response.ok) return
        clearFields()

        const responseJson = await response.json()
        handleSeaBeanEntryCreated?.(responseJson)
    }

    if (isSubmitting) {
        return <>
            <div>Submitting your entry...</div>
        </>
    }

    return <>
        <div>
            <div>Sea Bean:</div>
            <SeaBeanSelector
                seaBeans={seaBeans}
                handleSeaBeanSelected={(seaBean) => setSeaBeanId(seaBean.id)}
            />
            <div>Notes:</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div>Latitude:</div>
            <input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            <div>Longitude:</div>
            <input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            <button onClick={handleClickUseLocation}>Use my location</button>
            <div>Entry Date:</div>
            <input type="text" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
            <br />
            <div>Files:</div>
            {storedFiles.map((storedFile) => {
                return (
                    <img
                        key={storedFile.id}
                        src={`${API_BASE_URL}/storedFile/download/${storedFile.id}`}
                    />
                )
            })}
            <FileUploadForm
                handleFileUploaded={handleFileUploaded}
            />
            <br />
            <button onClick={handleClickSubmit}>Submit Sea Bean Entry</button>
        </div>
    </>
}

function SeaBeanEntryList({ seaBeanEntries, setSeaBeanEntries, seaBeans }) {
    const [isLoading, setIsLoading] = useState(true)

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
    }, [setSeaBeanEntries])

    if (isLoading) {
        return <>
            Loading Sea Beans...
        </>
    }

    return <>
        {seaBeanEntries.map((seaBeanEntry) => {
            return (
                <div style={({ marginBottom: "20px" })} key={seaBeanEntry.id}>
                    <div>Id: {seaBeanEntry.id}</div>
                    <div>Sea Bean: {seaBeans?.find(sb => sb.id === seaBeanEntry.seaBeanId)?.name}</div>
                    <div>Notes: {seaBeanEntry.notes}</div>
                    <div>Latitude: {seaBeanEntry.latitude}</div>
                    <div>Longitude: {seaBeanEntry.longitude}</div>
                    <div>Date Created: {seaBeanEntry.dateCreated}</div>
                    <div>Entry Date: {seaBeanEntry.entryDate}</div>
                    <div>
                        {seaBeanEntry.storedFileIds?.map((storedFileId) => {
                            return (
                                <img
                                    key={storedFileId}
                                    loading="lazy"
                                    src={`${API_BASE_URL}/storedFile/download/${storedFileId}`}
                                />
                            )
                        })}
                    </div>
                </div>
            )
        })}
    </>
}

export default function Home() {
    const [seaBeanEntries, setSeaBeanEntries] = useState([])
    const [seaBeans, setSeaBeans] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function getSeaBeans() {
            const response = await fetch(`${API_BASE_URL}/seaBean`, {
                credentials: "include"
            })
            const responseJson = await response.json();
            setSeaBeans(responseJson)
        }

        getSeaBeans()
    }, [])

    async function handleClickLogoutButton() {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        })

        if (response.ok) {
            navigate('/')
        }
    }

    function handleSeaBeanEntryCreated(seaBeanEntry) {
        setSeaBeanEntries([seaBeanEntry, ...seaBeanEntries])
    }

    return <>
        <button onClick={handleClickLogoutButton}>Logout</button>
        <br />
        <SeaBeanEntryForm
            handleSeaBeanEntryCreated={handleSeaBeanEntryCreated}
            seaBeans={seaBeans}
        />
        <br />
        <SeaBeanEntryList
            seaBeans={seaBeans}
            seaBeanEntries={seaBeanEntries}
            setSeaBeanEntries={setSeaBeanEntries}
        />
    </>
}