import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth/context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Family Management',
  description: 'Manage your family finances, assets, and events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
