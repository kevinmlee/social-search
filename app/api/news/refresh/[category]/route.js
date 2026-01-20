import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY

// Map our category names to NewsData.io category names
const CATEGORY_MAP = {
  'top': 'top',
  'technology': 'technology',
  'business': 'business',
  'science': 'science',
  'sports': 'sports',
  'health': 'health',
}

// Article schema for individual documents
const ArticleSchema = new mongoose.Schema({
  article_id: { type: String, required: true, unique: true },
  title: String,
  link: String,
  description: String,
  content: String,
  pubDate: String,
  image_url: String,
  source_id: String,
  source_name: String,
  source_url: String,
  source_icon: String,
  category: [String],
  country: [String],
  language: String,
  creator: [String],
  keywords: [String],
  fetchedAt: { type: Date, default: Date.now }
}, { strict: false })

// Get or create model for a specific collection
function getCollectionModel(categoryName) {
  const modelName = `Article_${categoryName}`
  try {
    return mongoose.model(modelName)
  } catch {
    return mongoose.model(modelName, ArticleSchema, categoryName)
  }
}

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  // Connect to the 'data' database
  const mongoUri = process.env.MONGODB.replace(/\/[^/]*(\?|$)/, '/data$1')
  await mongoose.connect(mongoUri)
}

async function fetchNewsForCategory(newsdataCategory) {
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=${newsdataCategory}&language=en&size=10`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`NewsData API error:`, response.status, errorText)
      return []
    }

    const data = await response.json()

    if (data.status !== 'success') {
      console.error(`NewsData API failed:`, data.message)
      return []
    }

    return data.results || []

  } catch (error) {
    console.error(`Error fetching news:`, error)
    return []
  }
}

export async function GET(request, { params }) {
  const { category } = await params

  // Validate category
  if (!CATEGORY_MAP[category]) {
    return NextResponse.json(
      { error: `Invalid category: ${category}. Valid categories: ${Object.keys(CATEGORY_MAP).join(', ')}` },
      { status: 400 }
    )
  }

  try {
    await connectToDatabase()

    const newsdataCategory = CATEGORY_MAP[category]
    const articles = await fetchNewsForCategory(newsdataCategory)

    if (!articles || articles.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No articles fetched for ${category}`,
        category,
        count: 0
      })
    }

    // Get the model for this category's collection
    const ArticleModel = getCollectionModel(category)

    // Clear existing documents and insert new ones
    await ArticleModel.deleteMany({})

    // Add fetchedAt timestamp to each article
    const articlesWithTimestamp = articles.map(article => ({
      ...article,
      fetchedAt: new Date()
    }))

    await ArticleModel.insertMany(articlesWithTimestamp)

    return NextResponse.json({
      success: true,
      message: `Successfully refreshed ${category}`,
      category,
      count: articles.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error(`Error refreshing ${category}:`, error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
