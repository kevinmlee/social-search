import { schedule } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

const TOPICS = [
  'news',
  'technology',
  'futurology',
  'science',
  'sports',
  'space',
  'nutrition'
]

// Helper to add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function fetchRedditPosts(subreddit, filter = 'hot', limit = 20) {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${limit}`,
      {
        headers: {
          'User-Agent': 'CurrentlyApp/1.0'
        }
      }
    )

    if (!res.ok) {
      console.error(`Reddit API error for r/${subreddit}:`, res.status, res.statusText)
      return []
    }

    const json = await res.json()
    return json?.data?.children?.map((item) => item.data) || []
  } catch (err) {
    console.error(`Reddit fetch error for r/${subreddit}:`, err)
    return []
  }
}

async function cacheRedditFeeds() {
  const store = getStore('reddit-cache')
  const results = {}

  console.log('Starting Reddit feed caching...')

  // Fetch feeds with staggered delays to avoid rate limiting
  for (const topic of TOPICS) {
    console.log(`Fetching r/${topic}...`)

    const posts = await fetchRedditPosts(topic, 'hot', 20)
    results[topic] = posts

    console.log(`Cached ${posts.length} posts from r/${topic}`)

    // Wait 2 seconds between requests to avoid rate limiting
    if (topic !== TOPICS[TOPICS.length - 1]) {
      await delay(2000)
    }
  }

  // Store all results with timestamp
  const cacheData = {
    data: results,
    timestamp: new Date().toISOString(),
    topics: TOPICS
  }

  await store.set('homepage-feeds', JSON.stringify(cacheData))

  console.log('Successfully cached all Reddit feeds')

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Successfully cached Reddit feeds',
      topics: TOPICS,
      timestamp: cacheData.timestamp
    })
  }
}

// Run every 10 minutes: "*/10 * * * *"
export const handler = schedule('*/10 * * * *', cacheRedditFeeds)
