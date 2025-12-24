import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

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

  await mongoose.connect(process.env.MONGODB)
}

export async function GET() {
  try {
    await connectToDatabase()

    // Get all cached news categories
    const cachedNews = await NewsCache.find({})

    if (!cachedNews || cachedNews.length === 0) {
      return NextResponse.json(
        { error: 'No cached news available' },
        { status: 404 }
      )
    }

    // Transform to object format: { category: articles[] }
    const newsData = {}
    cachedNews.forEach(item => {
      newsData[item.category] = item.articles
    })

    return NextResponse.json({
      success: true,
      data: newsData,
      lastUpdated: cachedNews[0]?.updatedAt
    })

  } catch (error) {
    console.error('Error reading news cache:', error)
    return NextResponse.json(
      { error: 'Failed to read cached news' },
      { status: 500 }
    )
  }
}
