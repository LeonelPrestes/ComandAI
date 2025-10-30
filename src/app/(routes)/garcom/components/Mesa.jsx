import styles from "./Mesa.module.css";
import Button from "@/components/Button/Button";
import { abrirModal } from "@/components/Modais/ModalItens/ModalItens";

export default function Mesa() {
    return (
        <div className={styles.Container}>
            <Button label="ENTREGA" variant="entrega" />
            <Button label="1" onClick={abrirModal} />
            <Button label="2" />
            <Button label="3" />
            <Button label="4" />
            <Button label="5" />
            <Button label="6" />
            <Button label="7" />
            <Button label="8" />
            <Button label="9" />
            <Button label="10" />
            <Button label="11" />
            <Button label="12" />
            <Button label="13" />
            <Button label="14" />
            <Button label="15" />
            <Button label="16" />
            <Button label="17" />
            <Button label="18" />
            <Button label="19" />
            <Button label="20" />
            <Button label="21" />
            <Button label="22" />
            <Button label="23" />
            <Button label="24" />
            <Button label="25" />
            <Button label="26" />
            <Button label="27" />
            <Button label="28" />
            <Button label="29" />
        </div>
    );
}
