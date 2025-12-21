'use client'

import { useContext } from 'react'
import { AppContext } from '../providers'
import Header from '@/views/Header/Header'
import Sidebar from '@/views/Sidebar/Sidebar'

export default function MainLayout({ children }) {
  const { fullWidth } = useContext(AppContext)

  return (
    <>
      <Header />
      <Sidebar />
      <main className="pl-[200px]">{children}</main>
    </>
  )
}
