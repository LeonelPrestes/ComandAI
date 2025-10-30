import GarcomPages from "./(routes)/garcom/page";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <Link href="/Garcom">Páginas do Garçom</Link>
    </div>
  );
}
