import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <h1 className={styles.headerH1}>🍽️ Sistema Restaurante</h1>
                <div className={styles.connectionStatus} id="connectionStatus">
                    <span className={`${styles.statusIndicator} ${styles.offline}`}></span>
                    <span className={styles.statusText}>Conectando...</span>
                </div>
            </div>
        </header>
    );
}