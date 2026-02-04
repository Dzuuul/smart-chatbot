import Link from "next/link";
import styles from "./layout.module.css";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.docsContainer}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoHighlight}>SMART</span>DOCS
          </Link>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Getting Started</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/introduction" className={styles.navLink}>
                  Introduction
                </Link>
              </li>
              <li>
                <Link href="/prerequisites" className={styles.navLink}>
                  Prerequisites
                </Link>
              </li>
              <li>
                <Link href="/installation" className={styles.navLink}>
                  Installation
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Authentication</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/auth" className={styles.navLink}>
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/auth/jwt" className={styles.navLink}>
                  JWT Strategy
                </Link>
              </li>
              <li>
                <Link href="/auth/password" className={styles.navLink}>
                  Password Hashing
                </Link>
              </li>
              <li>
                <Link href="/auth/frontend" className={styles.navLink}>
                  Frontend Integration
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>API Reference</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/api/endpoints" className={styles.navLink}>
                  Endpoints
                </Link>
              </li>
              <li>
                <Link href="/api/authentication" className={styles.navLink}>
                  Authentication
                </Link>
              </li>
              <li>
                <Link href="/api/errors" className={styles.navLink}>
                  Error Handling
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Database</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/database/schema" className={styles.navLink}>
                  Schema
                </Link>
              </li>
              <li>
                <Link href="/database/prisma" className={styles.navLink}>
                  Prisma Setup
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <p>Made by WebSTemplates</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
