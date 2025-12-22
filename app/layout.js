import { AppProvider } from './providers'
import './globals.css'
import { Poppins, Merriweather } from 'next/font/google'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
})

export const metadata = {
  title: 'Currently - Social Media Trends',
  description: 'Track social media trends across Reddit, YouTube, and more',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${merriweather.variable}`}>
      <body className="bg-white dark:bg-dark text-black dark:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
