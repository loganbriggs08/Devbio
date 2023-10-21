import './globals.css'
import type { Metadata } from 'next'
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: 'devbio.me',
  description: 'Easy to make profiles made to enhance the developer experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.website_wrapper}>
          {children}
        </div>
      </body>
    </html>
  )
}
