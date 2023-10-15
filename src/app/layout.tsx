import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavbarComponent } from '@/components/navbar'

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
      <NavbarComponent />
      <div>
        {children}
      </div>
    </html>
  )
}
