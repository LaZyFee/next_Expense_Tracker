import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ExpenseFlow',
  description: 'Personal finance tracker',
}

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors`}>
        <ThemeProvider>
          <Navbar />
          {children}
          {modal}
        </ThemeProvider>
      </body>
    </html>
  )
}