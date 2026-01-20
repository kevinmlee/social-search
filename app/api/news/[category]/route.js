import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

const VALID_CATEGORIES = ['top', 'technology', 'business', 'science', 'sports', 'health']

// Article schema
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

export async function GET(request, { params }) {
  const { category } = await params

  // Validate category
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: `Invalid category: ${category}. Valid categories: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 }
    )
  }

  try {
    await connectToDatabase()

    const ArticleModel = getCollectionModel(category)
    const articles = await ArticleModel.find({}).sort({ pubDate: -1 }).lean()

    return NextResponse.json({
      success: true,
      category,
      articles,
      count: articles.length
    })

  } catch (error) {
    console.error(`Error fetching ${category}:`, error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
