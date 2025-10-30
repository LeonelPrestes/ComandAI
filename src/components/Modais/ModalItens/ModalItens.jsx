import styles from "./ModalItens.module.css";

export default function ModalItens({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className={styles.Modal}>
            <div className={styles.content}>
                <button className={styles.close} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}
