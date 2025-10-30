import Header from "@/components/Header/Header";
import "../styles/globals.css";
import styles from "./layout.module.css";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "ComandAÍ",
  description: "Tecnologia para seu restaurante",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}