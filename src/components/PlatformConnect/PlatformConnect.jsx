import React from 'react'

const PlatformConnect = ({
  platform,
  isConnected,
  loading,
  onConnect,
  onDisconnect,
}) => {
  const Icon = platform.icon

  return (
    <div className="flex items-center justify-between p-6 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-dark hover:shadow-md transition-shadow">
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
        {isConnected ? (
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-green-600 dark:text-green-400">
              ✓ Connected
            </span>
            <button
              onClick={onDisconnect}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-black dark:text-white hover:bg-accent/40 dark:hover:bg-black/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${platform.color} ${platform.hoverColor} text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  )
}

export default PlatformConnect
