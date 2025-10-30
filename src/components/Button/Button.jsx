import styles from './Button.module.css';

export default function Button({ label, variant, selected onClick }) {
    const classNames = `${styles.btn} ${variant === 'selected' ? styles.selected : ''}`;
    return (
        <button className={classNames} data-mesa="1">{label}</button>
    );
}