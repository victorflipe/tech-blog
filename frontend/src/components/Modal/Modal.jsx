import React from 'react'
import ReactDOM from 'react-dom'
import styles from "./Modal.module.css"

const Modal = ({ children, onClose}) => {
    return ReactDOM.createPortal(
        <div className={`${styles.modal} fixed inset-0 z-50 flex items-center justify-center p-5 lg:p-0`} >
            <div className={`${styles.modalBox} p-6 relative`}>
                <button
                    onClick={onClose}
                    className={`${styles.close} absolute top-2 right-2 text-gray-500 hover:text-black`}
                >
                    ✕
                </button>
                <div className='h-full w-full'>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Modal