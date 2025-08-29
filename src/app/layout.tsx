import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Linear Kanban Board',
  description: 'A beautiful, modern kanban board task tracker inspired by Linear',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}