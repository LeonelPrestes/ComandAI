import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer>
            <div className={styles.footerContent}>
                <p className={styles.footerText}>© 2025 ComandAÍ. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}