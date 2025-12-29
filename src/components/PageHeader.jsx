import React from 'react'

const PageHeader = ({ title, className = '' }) => {
  return (
    <header className={`mb-6 md:mb-8 ${className}`.trim()}>
      <h1 className="text-4xl md:text-5xl font-merriweather font-bold text-black dark:text-white">
        {title}
      </h1>
    </header>
  )
}

export default PageHeader
