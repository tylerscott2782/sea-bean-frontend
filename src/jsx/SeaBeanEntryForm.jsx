import { useState } from "react"
import { useSeaBeans } from "./SeaBeansContext"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function ImageDiv({ storedFileId }) {
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

export function SeaBeanEntryForm({ handleSeaBeanEntryCreated }) {
    const { seaBeans } = useSeaBeans()

    const [seaBeanId, setSeaBeanId] = useState(seaBeans[0]?.id)
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
            <br />
            <br />
            <div>Notes:</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            <br />
            <br />
            <div>Latitude:</div>
            <input type="number" value={latitude ?? ''} onChange={(e) => setLatitude(e.target.value)} />
            <br />
            <div>Longitude:</div>
            <input type="number" value={longitude ?? ''} onChange={(e) => setLongitude(e.target.value)} />
            <br />
            <button onClick={handleClickUseLocation}>Use my location</button>
            <br />
            <br />
            <div>Photos:</div>
            {storedFiles.map((storedFile) => {
                return (
                    <ImageDiv key={storedFile.id} storedFileId={storedFile.id} />
                )
            })}
            <FileUploadForm
                handleFileUploaded={handleFileUploaded}
            />
            <br />
            <br />
            <br />
            <button onClick={handleClickSubmit}>Submit Sea Bean Entry</button>
        </div>
    </>
}