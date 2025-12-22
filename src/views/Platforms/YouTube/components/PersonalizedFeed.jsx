'use client'

import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '@/../app/providers'
import { FadeUp, LoadingSkeleton, Button } from '@/components'
import Post from './Post'

// Simple cache for subscription videos (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
let videoCache = null
let cacheTimestamp = null

const PersonalizedFeed = () => {
  const { user } = useContext(AppContext)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptionVideos = async () => {
      if (!user?.linkedAccounts?.youtube?.accessToken) {
        setLoading(false)
        return
      }

      try {
        const subscriptions = user.linkedAccounts.youtube.subscriptions || []

        if (subscriptions.length === 0) {
          setLoading(false)
          return
        }

        // Check if we have valid cached data
        const now = Date.now()
        if (videoCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
          console.log('Using cached subscription videos')
          setVideos(videoCache)
          setLoading(false)
          return
        }

        // Extract channel IDs from subscriptions
        const channelIds = subscriptions.map(sub => sub.snippet.resourceId.channelId)
        console.log(`Fetching videos from ${channelIds.length} subscribed channels`)

        // Fetch videos from subscribed channels via API route
        const response = await fetch('/api/youtube/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ channelIds }),
        })
        const data = await response.json()

        if (data.error) {
          console.error('YouTube API error:', data.error)
          return
        }

        if (data.items) {
          console.log(`Fetched ${data.items.length} videos from subscriptions`)
          // Update cache
          videoCache = data.items
          cacheTimestamp = now
          setVideos(data.items)
        } else {
          console.log('No items in response:', data)
        }
      } catch (error) {
        console.error('Error fetching subscription videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptionVideos()
  }, [user])

  const youtubeConnected = !!user?.linkedAccounts?.youtube
  const subscriptions = user?.linkedAccounts?.youtube?.subscriptions || []

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!youtubeConnected) {
    return (
      <div className="py-8 px-6 bg-accent/10 dark:bg-black/20 rounded-lg border border-border-light dark:border-border-dark">
        <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Connect your YouTube account to see videos from channels you subscribe to.
        </p>
        <a
          href="/accounts"
          className="inline-block px-4 py-2 bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-medium rounded-lg transition-colors"
        >
          Connect YouTube
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-merriweather text-2xl font-semibold mb-2">Your Subscriptions</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Latest videos from channels you follow
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No recent videos from your subscriptions.
          </p>
        </div>
      ) : (
        <>
          <div className="my-6">
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
              {videos.map((video) => (
                <FadeUp
                  key={video.id}
                  className="break-inside-avoid mb-6 md:mb-12 border-white/15 border-b last:border-b-0 md:border-b-0"
                >
                  <Post data={video} />
                </FadeUp>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={() => window.open('https://www.youtube.com/feed/subscriptions', '_blank')}>
              See more on YouTube
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default PersonalizedFeed
