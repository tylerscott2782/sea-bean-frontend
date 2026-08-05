import { useEffect, useState } from "react"
import { SeaBeanEntryForm, ImageDiv } from "./SeaBeanEntryForm"
import { Modal } from "./Modal"
import { useSeaBeans } from "./SeaBeansContext"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function SeaBeanEntryList({ users, seaBeanEntries, setSeaBeanEntries }) {
    const { seaBeans } = useSeaBeans()

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
                <div style={({ marginBottom: "25px", boxShadow: "3px 3px 6px #00000030", backgroundColor: "#1b1d21", padding: "15px 25px 20px 15px", borderRadius: "10px" })} key={seaBeanEntry.id}>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ height: "38px", aspectRatio: "1", borderRadius: "50px", backgroundColor: "gray" }}></div>
                        <div style={{ width: "100%" }}>
                            <div style={{ fontSize: "16px", marginTop: "8px" }}>
                                <strong>{creator.username}</strong> found a <strong>{seaBean?.name}</strong> on <strong>{entryDateString}</strong>
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
    const [users, setUsers] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [seaBeanEntryFormKey, setSeaBeanEntryFormKey] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        async function load() {
            const loadUsers = async function () {
                const response = await fetch(`${API_BASE_URL}/user`, {
                    credentials: "include"
                })
                return await response.json();
            }

            const userResponse = await loadUsers()

            setUsers(userResponse)
            setLoaded(true)
        }

        load()
    }, [])

    function handleSeaBeanEntryCreated(seaBeanEntry) {
        setIsModalOpen(false)
        setSeaBeanEntryFormKey(seaBeanEntryFormKey + 1)
        setSeaBeanEntries([seaBeanEntry, ...seaBeanEntries])
    }

    if (!loaded) {
        return <>
            Loading...
        </>
    }

    return <>
        <div style={{ fontSize: "30px" }}>Home</div>
        <br />
        <SeaBeanEntryList
            users={users}
            seaBeanEntries={seaBeanEntries}
            setSeaBeanEntries={setSeaBeanEntries}
        />

        <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
        >
            <SeaBeanEntryForm
                key={seaBeanEntryFormKey}
                handleSeaBeanEntryCreated={handleSeaBeanEntryCreated}
            />
        </Modal>

        <button
            style={{
                cursor: "pointer",
                fontSize: "20px",
                backgroundColor: "#c0ddff",
                borderRadius: "10px",
                marginBottom: "15px",
                padding: "10px 20px",
                position: "fixed",
                bottom: "10px",
                right: "30px"
            }}
            onClick={() => setIsModalOpen(!isModalOpen)}
        >
            + New Sea Bean Entry
        </button>
    </>
}