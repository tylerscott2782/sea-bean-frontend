import { createPortal } from "react-dom";

export function Modal({ isOpen, setIsOpen, children }) {
    if (!isOpen) return null

    return createPortal(
        <div style={{ position: "fixed", top: "0", width: "100dvw", height: "100dvh", backgroundColor: "#00000099", paddingBottom: "10%" }}>
            <div style={{ maxWidth: "1000px", maxHeight: "100%", height: "800px", backgroundColor: "#1c202c", borderRadius: "30px", margin: "5% auto 0 auto", padding: "30px 30px 60px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", height: "45px", maxHeight: "45px" }}>
                    <div style={{ fontSize: "20px", marginBottom: "20px" }}><strong>New Sea Bean Entry</strong></div>
                    <div
                        style={{ fontSize: "30px", cursor: "pointer" }}
                        onClick={() => setIsOpen(false)}
                    >x</div>
                </div>
                <div style={{ height: "calc(100% - 45px)", overflow: "auto" }}>
                    {children}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    )
}