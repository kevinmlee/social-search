import { useState, useContext } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { AppContext } from '@/../app/providers'

export const useYouTubeAuth = () => {
  const { user, setUser } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      setError(null)

      try {
        // Get user's YouTube channel info
        const channelResponse = await fetch(
          'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        )
        const channelData = await channelResponse.json()

        if (channelData.error) {
          throw new Error(channelData.error.message || 'Failed to fetch channel data')
        }

        // Get user's subscriptions
        const subscriptionsResponse = await fetch(
          'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        )
        const subscriptionsData = await subscriptionsResponse.json()

        if (subscriptionsData.error) {
          throw new Error(subscriptionsData.error.message || 'Failed to fetch subscriptions')
        }

        // Save to user profile
        const updatedUser = {
          ...user,
          linkedAccounts: {
            ...user.linkedAccounts,
            youtube: {
              accessToken: tokenResponse.access_token,
              channel: channelData.items?.[0],
              subscriptions: subscriptionsData.items || [],
              connectedAt: new Date().toISOString(),
            },
          },
        }

        // Update user in context and localStorage
        setUser(updatedUser)

        // TODO: Save to database via API
        // await fetch('/api/users/update', {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ linkedAccounts: updatedUser.linkedAccounts })
        // })

        return { success: true, data: updatedUser.linkedAccounts.youtube }
      } catch (err) {
        console.error('Error connecting YouTube:', err)
        setError(err.message || 'Failed to connect YouTube account')
        return { success: false, error: err.message }
      } finally {
        setLoading(false)
      }
    },
    onError: (err) => {
      console.error('YouTube login error:', err)
      const errorMessage = 'Failed to connect YouTube account'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  })

  const disconnect = () => {
    const updatedUser = {
      ...user,
      linkedAccounts: {
        ...user.linkedAccounts,
        youtube: null,
      },
    }
    setUser(updatedUser)

    // TODO: Call API to disconnect account from database
    // await fetch('/api/users/update', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ linkedAccounts: updatedUser.linkedAccounts })
    // })
  }

  const isConnected = !!user?.linkedAccounts?.youtube

  return {
    login,
    disconnect,
    loading,
    error,
    isConnected,
    data: user?.linkedAccounts?.youtube,
  }
}
