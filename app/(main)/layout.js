'use client'

import { useContext } from 'react'
import { AppContext } from '../providers'
import Header from '@/views/Header/Header'
import Sidebar from '@/views/Sidebar/Sidebar'

export default function MainLayout({ children }) {
  const { fullWidth } = useContext(AppContext)

  return (
    <>
      {!fullWidth && (
        <div>
          <Header />
          <Sidebar />
        </div>
      )}
      <div id="main-content" className={fullWidth ? 'fw' : ''}>
        {children}
      </div>
    </>
  )
}
