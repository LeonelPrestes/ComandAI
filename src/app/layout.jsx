import "../styles/globals.css";
import styles from "./layout.module.css";


export const metadata = {
  title: "ComandAÍ",
  description: "Tecnologia para seu restaurante",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}