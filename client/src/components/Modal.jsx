import { createContext, useContext, useState } from "react"
import "./Modal.css"

const ModalContext = createContext(null)

export function useModal() {
    return useContext(ModalContext)
}

export default function Modal({ children, onClose, size = "md" }) {
    const [isClosing, setIsClosing] = useState(false)

    function triggerClose() {
        setIsClosing(true)
    }

    function handleAnimationEnd(e) {
        if (isClosing && e.target.classList.contains("modal-backdrop")) {
            onClose()
        }
    }

    return (
        <ModalContext.Provider value={{ triggerClose, isClosing }}>
            <div
                className={`modal-backdrop ${isClosing ? "modal-backdrop--closing" : ""}`}
                onClick={triggerClose}
                role="presentation"
                onAnimationEnd={handleAnimationEnd}
            >
                <div
                    className={`modal-panel modal-panel--${size} ${isClosing ? "modal-panel--closing" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                >
                    {children}
                </div>
            </div>
        </ModalContext.Provider>
    )
}

