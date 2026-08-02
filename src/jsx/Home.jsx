import { useEffect, useState } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function ImageDiv({ storedFileId }) {
    return (
        <div style={{ width: "200px" }}>
            <img
                src={`${API_BASE_URL}/storedFile/download/${storedFileId}`}
                loading="lazy"
                style={{ width: "100%" }}
            />
        </div>
    )
}

function SeaBeanSelector({ value, seaBeans, handleSeaBeanSelected }) {
    function onChangeSelect(e) {
        const id = e.target.value
        const selectedSeaBean = seaBeans.find(sb => sb.id === id)
        handleSeaBeanSelected?.(selectedSeaBean)
    }

    return <>
        <select onChange={onChangeSelect} value={value}>
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
        <input type="file" accept="image/*" onChange={onChangeFileInput} />
    </>
}

function SeaBeanEntryForm({ seaBeans, handleSeaBeanEntryCreated }) {
    const [seaBeanId, setSeaBeanId] = useState(seaBeans[0].id)
    const [notes, setNotes] = useState('')
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    // const [entryDate, setEntryDate] = useState()
    const [storedFiles, setStoredFiles] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

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
                entryDate: (new Date().toISOString()),
                storedFileIds: storedFiles.map(sf => sf.id)
            })
        })
        setIsSubmitting(false)

        if (!response.ok) return

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
                value={seaBeanId}
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
            <br />
            <div>Files:</div>
            {storedFiles.map((storedFile) => {
                return (
                    <ImageDiv key={storedFile.id} storedFileId={storedFile.id} />
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

function SeaBeanEntryList({ users, seaBeanEntries, setSeaBeanEntries, seaBeans }) {
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
            const creator = users.find(u => seaBeanEntry.creatorId === u.id) ?? { name: "Unknown User" }
            const seaBean = seaBeans?.find(sb => sb.id === seaBeanEntry.seaBeanId)
            const entryDate = new Date(seaBeanEntry.entryDate)
            const entryDateString = new Intl.DateTimeFormat(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: "numeric",
                minute: "numeric"
            }).format(entryDate)

            return (
                <div style={({ marginBottom: "25px", boxShadow: "3px 3px 6px #00000030;", backgroundColor: "#1b1d21", padding: "20px", borderRadius: "10px" })} key={seaBeanEntry.id}>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <div style={{ height: "40px", aspectRatio: "1", borderRadius: "50px", backgroundColor: "gray" }}></div>
                        <div>
                            <div style={{ fontSize: "16px", marginTop: "10px" }}>
                                <strong>{creator.username}</strong> found a <strong>{seaBean.name}</strong> on <strong>{entryDateString}</strong>
                            </div>
                            {!!seaBeanEntry.notes && <>
                                <div style={{ padding: "10px 15px", backgroundColor: "#232b3b", borderRadius: "12px", margin: "10px 0 0 0" }}>
                                    {seaBeanEntry.notes}
                                </div>
                            </>}
                            {seaBeanEntry.storedFileIds?.length > 0 ? <>
                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginTop: "20px" }}>
                                    {seaBeanEntry.storedFileIds?.map((storedFileId) => {
                                        return (
                                            <ImageDiv
                                                key={storedFileId}
                                                storedFileId={storedFileId}
                                            />
                                        )
                                    })}
                                </div>
                            </> : null}
                        </div>
                    </div>
                </div>
            )
        })}
    </>
}

export default function Home() {
    const [seaBeanEntries, setSeaBeanEntries] = useState([])
    const [seaBeans, setSeaBeans] = useState([])
    const [users, setUsers] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [seaBeanEntryFormKey, setSeaBeanEntryFormKey] = useState(0)

    useEffect(() => {
        async function load() {
            const loadSeaBeans = async function () {
                const response = await fetch(`${API_BASE_URL}/seaBean`, {
                    credentials: "include"
                })
                return await response.json();
            }

            const loadUsers = async function () {
                const response = await fetch(`${API_BASE_URL}/user`, {
                    credentials: "include"
                })
                return await response.json();
            }

            const [
                seaBeanResponse,
                userResponse
            ] = await Promise.all([
                loadSeaBeans(),
                loadUsers()
            ])

            setSeaBeans(seaBeanResponse)
            setUsers(userResponse)
            setLoaded(true)
        }

        load()
    }, [])

    function handleSeaBeanEntryCreated(seaBeanEntry) {
        setSeaBeanEntryFormKey(seaBeanEntryFormKey + 1)
        setSeaBeanEntries([seaBeanEntry, ...seaBeanEntries])
    }

    if (!loaded) {
        return <>
            Loading...
        </>
    }

    return <>
    <div style={{fontSize: "30px"}}>Home</div>
        <SeaBeanEntryForm
            key={seaBeanEntryFormKey}
            handleSeaBeanEntryCreated={handleSeaBeanEntryCreated}
            seaBeans={seaBeans}
        />
        <br />
        <SeaBeanEntryList
            users={users}
            seaBeans={seaBeans}
            seaBeanEntries={seaBeanEntries}
            setSeaBeanEntries={setSeaBeanEntries}
        />
    </>
}