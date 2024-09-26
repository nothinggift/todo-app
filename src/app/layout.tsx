import { Providers } from './providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import AuthWrapper from '@/components/AuthWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo app built with Next.js and Nest.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <AuthWrapper>
            <Header />
            <main className="flex-grow container min-w-full">
              {children}
            </main>
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  )
}
