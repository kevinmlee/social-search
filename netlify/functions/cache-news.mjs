import { schedule } from '@netlify/functions'
import mongoose from 'mongoose'

const NEWSDATA_API_KEY = 'pub_bb53cc8b0f3f413eb52324e74899fd91'
const MONGODB_URI = process.env.MONGODB

// Category mapping from your homepage to NewsData.io categories
const CATEGORIES = {
  'news': 'top',
  'technology': 'technology',
  'business': 'business',
  'science': 'science',
  'sports': 'sports',
  'health': 'health',
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// MongoDB Schema
const NewsCacheSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true, index: true },
  articles: { type: Array, required: true, default: [] },
  updatedAt: { type: Date, default: Date.now }
})

let NewsCache
try {
  NewsCache = mongoose.model('NewsCache')
} catch {
  NewsCache = mongoose.model('NewsCache', NewsCacheSchema, 'news')
}

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')
}

async function fetchNewsForCategory(category, newsdataCategory) {
  try {
    // Free tier limit is 10 articles per request
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=${newsdataCategory}&language=en&size=10`

    console.log(`Fetching news for ${category} (${newsdataCategory})...`)

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`NewsData API error for ${category}:`, response.status, response.statusText)
      return []
    }

    const data = await response.json()

    if (data.status !== 'success') {
      console.error(`NewsData API failed for ${category}:`, data.message || 'Unknown error')
      return []
    }

    console.log(`Fetched ${data.results?.length || 0} articles for ${category}`)
    return data.results || []

  } catch (error) {
    console.error(`Error fetching news for ${category}:`, error)
    return []
  }
}

async function cacheNews() {
  try {
    await connectToDatabase()

    const results = {}
    console.log('Starting news caching process...')

    // Fetch all categories with staggered delays
    for (const [category, newsdataCategory] of Object.entries(CATEGORIES)) {
      const articles = await fetchNewsForCategory(category, newsdataCategory)

      // Only update MongoDB if we got articles (don't overwrite with empty data)
      if (articles && articles.length > 0) {
        await NewsCache.findOneAndUpdate(
          { category },
          {
            category,
            articles,
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        )
        console.log(`Cached ${articles.length} articles for ${category}`)
        results[category] = articles.length
      } else {
        console.log(`Skipping cache update for ${category} - no articles fetched`)
        results[category] = 0
      }

      // Wait 3 seconds between requests to avoid rate limiting
      await delay(3000)
    }

    console.log('Successfully cached all news categories')

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully cached news categories',
        results,
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Error in cacheNews:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}

// Run every 2 hours: "0 */2 * * *"
export const handler = schedule('0 */2 * * *', cacheNews)
