import { AppProvider } from './providers'
import './globals.css'

export const metadata = {
  title: 'Currently - Social Media Trends',
  description: 'Track social media trends across Reddit, YouTube, and more',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
