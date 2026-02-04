import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Smart Chatbot Documentation</h1>
        <p className={styles.description}>
          Comprehensive documentation for the Smart Chatbot monorepo project
        </p>

        <div className={styles.grid}>
          <Link href="/auth" className={styles.card}>
            <h2>Authentication 🔐</h2>
            <p>Learn how to implement JWT authentication with bcrypt</p>
          </Link>

          <Link href="/api" className={styles.card}>
            <h2>API Reference 📡</h2>
            <p>Complete API endpoints documentation</p>
          </Link>

          <Link href="/database" className={styles.card}>
            <h2>Database 🗄️</h2>
            <p>Prisma setup and database schema</p>
          </Link>

          <Link href="/deployment" className={styles.card}>
            <h2>Deployment 🚀</h2>
            <p>Deploy your application to production</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
