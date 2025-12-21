# API Endpoints Reference

## Complete Endpoint Mapping

This document shows the mapping between old Netlify Functions and new Next.js API Routes.

### Location API

| Method | Old Endpoint | New Endpoint | Description |
|--------|-------------|--------------|-------------|
| GET | `/.netlify/functions/getLocation` | `/api/location` | Get user's geolocation based on IP |

### Authentication & Users

| Method | Old Endpoint | New Endpoint | Description |
|--------|-------------|--------------|-------------|
| POST | `/.netlify/functions/auth` | `/api/auth` | Authenticate user login |
| POST | `/.netlify/functions/createUser` | `/api/users/create` | Create new user account |
| POST | `/.netlify/functions/getUser` | `/api/users/get` | Get user by username |
| POST | `/.netlify/functions/updateUser` | `/api/users/update` | Update user information |
| POST | `/.netlify/functions/sendRecoveryEmail` | `/api/users/send-recovery-email` | Send password recovery email |

### Twitter API

| Method | Old Endpoint | New Endpoint | Description |
|--------|-------------|--------------|-------------|
| POST | `/.netlify/functions/tweets` | `/api/twitter/tweets` | Search tweets and get user tweets |

**Request Body:**
```json
{
  "searchQuery": "username or search term"
}
```

**Response:**
```json
{
  "userTweets": {...},
  "searchResults": {...},
  "user": {...}
}
```

### YouTube API

| Method | Old Endpoint | New Endpoint | Description |
|--------|-------------|--------------|-------------|
| POST | `/.netlify/functions/youtubeSearch` | `/api/youtube/search` | Search YouTube videos |
| POST | `/.netlify/functions/youtubeTrending` | `/api/youtube/trending` | Get trending YouTube videos |

**Search Request Body:**
```json
{
  "searchQuery": "search term",
  "order": "relevance|date|viewCount|rating"
}
```

**Trending Request Body:**
```json
{
  "countryCode": "US" // optional
}
```

### Reddit API

| Method | Old Endpoint | New Endpoint | Description |
|--------|-------------|--------------|-------------|
| POST | `/.netlify/functions/fetchSubredditPosts` | `/api/reddit/posts` | Fetch posts from a subreddit |

**Request Body:**
```json
{
  "subreddit": "subreddit_name"
}
```

### Google Trends API

| Method | Old Endpoint | New Endpoint | Description |
|--------|-------------|--------------|-------------|
| POST | `/.netlify/functions/trends-interestOverTime` | `/api/trends/interest-over-time` | Get interest over time for a keyword |
| POST | `/.netlify/functions/trends-relatedQueries` | `/api/trends/related-queries` | Get related queries for a keyword |
| POST | `/.netlify/functions/trends-relatedTopics` | `/api/trends/related-topics` | Get related topics for a keyword |

**Interest Over Time Request:**
```json
{
  "searchQuery": "search term",
  "startTime": "2024-01-01", // optional
  "endTime": "2024-12-31",   // optional
  "granularTimeResolution": "MONTH|WEEK|DAY" // optional
}
```

**Related Queries Request:**
```json
{
  "searchQuery": "search term"
}
```

**Related Topics Request:**
```json
{
  "searchQuery": "search term",
  "startTime": "2024-01-01", // optional
  "endTime": "2024-12-31"    // optional
}
```

## Usage Examples

### Client-Side API Calls

#### Old Way (Netlify Functions)
```javascript
const response = await fetch('/.netlify/functions/getLocation')
const data = await response.json()
```

#### New Way (Next.js API Routes)
```javascript
const response = await fetch('/api/location')
const data = await response.json()
```

### Posting Data

#### Authentication Example
```javascript
// Old
const response = await fetch('/.netlify/functions/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})

// New - same code, just different endpoint!
const response = await fetch('/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})
```

#### YouTube Search Example
```javascript
const response = await fetch('/api/youtube/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    searchQuery: 'Next.js tutorial',
    order: 'relevance'
  })
})
const data = await response.json()
```

## Server-Side API Calls (New in Next.js)

You can now call these APIs directly from Server Components:

```javascript
// app/page.js (Server Component)
export default async function HomePage() {
  // This runs on the server, no client-side fetch needed!
  const locationResponse = await fetch('http://localhost:3000/api/location')
  const location = await locationResponse.json()

  return <Home location={location} />
}
```

Or use absolute URLs in production:

```javascript
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const response = await fetch(`${baseUrl}/api/location`)
```

## Error Handling

All API routes return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

Status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Environment Variables

Required for API routes to work:

```bash
# MongoDB
MONGODB=mongodb+srv://...

# Google OAuth
GOOGLE_CLIENT_ID=...

# Twitter API
TWITTER_BEARER_TOKEN=...

# YouTube API
YOUTUBE_API_KEY=...

# Email (for password recovery)
EMAIL_USER=...
EMAIL_PASSWORD=...

# App URL (for emails and server-side fetches)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Migration Checklist

To migrate your API calls:

1. **Find all Netlify Function calls:**
   ```bash
   grep -r "\.netlify/functions" client/src/
   ```

2. **Replace with new endpoints:**
   - `/.netlify/functions/getLocation` → `/api/location`
   - `/.netlify/functions/auth` → `/api/auth`
   - etc. (see table above)

3. **Test each endpoint:**
   ```bash
   npm run dev
   # Test in browser or with curl
   curl http://localhost:3000/api/location
   ```

4. **Update API client files:**
   - `client/src/api/` directory
   - Any components making direct API calls

## Additional Resources

- [Next.js API Routes Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
