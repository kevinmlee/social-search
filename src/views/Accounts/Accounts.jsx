'use client'

import React from 'react'
import { FaReddit, FaYoutube } from 'react-icons/fa'
import { PlatformConnect } from '@/components'
import { useYouTubeAuth } from '@/hooks/useYouTubeAuth'

const PLATFORMS = [
  {
    id: 'reddit',
    name: 'Reddit',
    icon: FaReddit,
    color: 'bg-[#FF4500]',
    hoverColor: 'hover:bg-[#FF4500]/90',
    description: 'Connect your Reddit account to personalize your feed',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: FaYoutube,
    color: 'bg-[#FF0000]',
    hoverColor: 'hover:bg-[#FF0000]/90',
    description: 'Connect your YouTube account to access personalized recommendations',
  },
]

const Accounts = () => {
  const youtube = useYouTubeAuth()

  const handleConnect = (platformId) => {
    if (platformId === 'reddit') {
      // TODO: Implement Reddit OAuth
      alert('Reddit OAuth not yet implemented')
    } else if (platformId === 'youtube') {
      youtube.login()
    }
  }

  const handleDisconnect = (platformId) => {
    if (platformId === 'youtube') {
      youtube.disconnect()
    } else if (platformId === 'reddit') {
      // TODO: Implement Reddit disconnect
      alert('Reddit OAuth not yet implemented')
    }
  }

  const isConnected = (platformId) => {
    if (platformId === 'youtube') return youtube.isConnected
    if (platformId === 'reddit') return false
    return false
  }

  return (
    <section id="accounts" className="px-8 py-6">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-semibold mb-2">Linked Accounts</h2>
        <p className="text-sm text-black/60 dark:text-white/60 mb-8">
          Connect your social media accounts to personalize your experience
        </p>

        <div className="flex flex-col gap-4">
          {PLATFORMS.map((platform) => (
            <PlatformConnect
              key={platform.id}
              platform={platform}
              isConnected={isConnected(platform.id)}
              loading={platform.id === 'youtube' ? youtube.loading : false}
              onConnect={() => handleConnect(platform.id)}
              onDisconnect={() => handleDisconnect(platform.id)}
            />
          ))}
        </div>

        {/* Info section */}
        <div className="mt-8 p-4 rounded-lg bg-accent/20 dark:bg-black/20 border border-border-light dark:border-border-dark">
          <p className="text-sm text-black/70 dark:text-white/70">
            <strong>Note:</strong> By connecting your accounts, you agree to allow this application
            to access your public profile information. You can disconnect at any time.
          </p>
        </div>

        {/* Error display */}
        {youtube.error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              {youtube.error}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Accounts
