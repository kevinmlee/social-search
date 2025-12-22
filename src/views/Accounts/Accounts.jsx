'use client'

import React, { useContext, useState } from 'react'
import { FaReddit, FaYoutube } from 'react-icons/fa'
import { AppContext } from '@/../app/providers'

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
  const { user } = useContext(AppContext)
  const [linkedAccounts, setLinkedAccounts] = useState({
    reddit: false,
    youtube: false,
  })

  const handleConnect = (platformId) => {
    // TODO: Implement OAuth flow for each platform
    console.log(`Connecting to ${platformId}...`)

    // Placeholder for OAuth implementation
    if (platformId === 'reddit') {
      // Reddit OAuth flow will go here
      alert('Reddit OAuth not yet implemented')
    } else if (platformId === 'youtube') {
      // YouTube OAuth flow will go here
      alert('YouTube OAuth not yet implemented')
    }
  }

  const handleDisconnect = (platformId) => {
    setLinkedAccounts(prev => ({ ...prev, [platformId]: false }))
    // TODO: Call API to disconnect account
    console.log(`Disconnecting from ${platformId}...`)
  }

  return (
    <section id="accounts" className="px-8 py-6">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-semibold mb-2">Linked Accounts</h2>
        <p className="text-sm text-black/60 dark:text-white/60 mb-8">
          Connect your social media accounts to personalize your experience
        </p>

        <div className="flex flex-col gap-4">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon
            const isLinked = linkedAccounts[platform.id]

            return (
              <div
                key={platform.id}
                className="flex items-center justify-between p-6 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-dark hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${platform.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-black dark:text-white">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      {platform.description}
                    </p>
                  </div>
                </div>

                <div>
                  {isLinked ? (
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-black dark:text-white hover:bg-accent/40 dark:hover:bg-black/50 transition-colors"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(platform.id)}
                      className={`px-4 py-2 rounded-lg ${platform.color} ${platform.hoverColor} text-white font-medium transition-colors`}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info section */}
        <div className="mt-8 p-4 rounded-lg bg-accent/20 dark:bg-black/20 border border-border-light dark:border-border-dark">
          <p className="text-sm text-black/70 dark:text-white/70">
            <strong>Note:</strong> By connecting your accounts, you agree to allow this application
            to access your public profile information. You can disconnect at any time.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Accounts
