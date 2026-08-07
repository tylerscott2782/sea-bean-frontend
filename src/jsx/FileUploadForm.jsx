import { useState } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function FileUploadForm({ handleFileUploaded }) {
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