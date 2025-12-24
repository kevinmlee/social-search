import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY

const CATEGORIES = {
  'news': 'top',
  'technology': 'technology',
  'business': 'business',
  'science': 'science',
  'sports': 'sports',
  'health': 'health',
}

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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  await mongoose.connect(process.env.MONGODB)
}

async function fetchNewsForCategory(category, newsdataCategory) {
  try {
    // Free tier limit is 10 articles per request
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=${newsdataCategory}&language=en&size=10`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`NewsData API error for ${category}:`, response.status, errorText)
      return []
    }

    const data = await response.json()

    if (data.status !== 'success') {
      console.error(`NewsData API failed for ${category}:`, data.message)
      return []
    }

    console.log(`Fetched ${data.results?.length} articles for ${category}`)
    return data.results || []

  } catch (error) {
    console.error(`Error fetching news for ${category}:`, error)
    return []
  }
}

export async function GET() {
  try {
    await connectToDatabase()

    const results = {}

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
        results[category] = articles.length
      } else {
        console.log(`Skipping cache update for ${category} - no articles fetched`)
        results[category] = 0
      }

      // Wait 3 seconds between requests
      await delay(3000)
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully cached all news categories',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error caching news:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
