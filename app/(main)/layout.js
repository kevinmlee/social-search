'use client'

import Header from '@/views/Header/Header'
import Sidebar from '@/views/Sidebar/Sidebar'

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="md:pl-[200px] bg-white dark:bg-dark">{children}</main>
    </>
  )
}
