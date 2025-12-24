# News Cache System

This project uses NewsData.io API with MongoDB caching to provide fast, reliable news feeds on the homepage.

## How It Works

1. **Netlify Scheduled Function** (`netlify/functions/cache-news.mjs`)
   - Runs every hour (`0 * * * *`)
   - Fetches 30 articles for each of 7 categories from NewsData.io
   - Stores in MongoDB "news" collection
   - Uses **upsert** to overwrite old data (no accumulation)

2. **Homepage** (`src/views/Home/Home.jsx`)
   - Fetches cached news from `/api/news/cached`
   - Falls back to Reddit if cache unavailable
   - Instant load times for users

3. **Manual Cache Trigger** (`/api/news/cache-now`)
   - Visit this endpoint to manually populate/refresh cache
   - Useful for testing and initial setup

## Categories

| Homepage Category | NewsData.io Category |
|------------------|---------------------|
| news             | top                 |
| technology       | technology          |
| science          | science             |
| sports           | sports              |
| nutrition        | food                |
| space            | science             |
| futurology       | technology          |

## Setup

1. Add to `.env`:
   ```
   NEWSDATA_API_KEY=pub_bb53cc8b0f3f413eb52324e74899fd91
   MONGODB=your_mongodb_connection_string
   ```

2. Deploy to Netlify - the scheduled function will start automatically

3. Or manually trigger: `GET /api/news/cache-now`

## Rate Limits

- **NewsData.io Free Tier**: 200 requests/day
- **Our Usage**: 7 categories × 24 hours = 168 requests/day ✅
- **Cache refresh**: Every 1 hour

## MongoDB Collection

- **Collection name**: `news`
- **Documents**: One per category (7 total)
- **Structure**:
  ```javascript
  {
    category: "technology",
    articles: [...], // 30 articles
    updatedAt: Date
  }
  ```

## Benefits

- ✅ No Reddit rate limiting issues
- ✅ Instant page loads (cached data)
- ✅ More reliable news sources
- ✅ Mobile-friendly (no burst requests)
- ✅ Free tier friendly (168/200 requests/day)
