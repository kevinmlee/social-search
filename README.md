# Currently - Social Media Trends Tracker

> **✨ Recently upgraded to Next.js 15 with Tailwind CSS!**

A modern social media trends tracking application built with **Next.js 15**, **React 19**, and **Tailwind CSS**.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Database:** MongoDB
- **APIs:** Twitter, YouTube, Reddit, Google Trends

## 📦 Quick Start

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kevinmlee/social-search.git
cd social-search

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

### Environment Variables

Create a `.env` file with these required variables:

```env
MONGODB=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
YOUTUBE_API_KEY=your_youtube_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎯 Features

- **Reddit Integration** - Track subreddit trends and posts
- **YouTube Analytics** - Monitor trending videos and search results
- **Twitter/X Tracking** - Search tweets and user activity
- **Google Trends** - Analyze search interest over time
- **User Authentication** - Secure user accounts with MongoDB
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Server-Side Rendering** - Fast page loads with Next.js
- **API Routes** - Built-in serverless API endpoints

## 📁 Project Structure

```
social-search/
├── app/                      # Next.js App Router
│   ├── (main)/              # Pages with Header/Sidebar
│   ├── (auth)/              # Auth pages (Sign In/Up)
│   ├── api/                 # API Routes (14 endpoints)
│   ├── providers.js         # Context providers
│   └── globals.css          # Global styles
├── src/                     # Source code
│   ├── views/               # Page components
│   ├── components/          # Shared components
│   ├── lib/                 # Utilities
│   ├── util/                # Helper functions
│   └── api/                 # API client functions
├── lib/                     # Shared utilities (cn function)
├── public/                  # Static assets
└── [config files]
```

## 🗂️ API Routes

All API endpoints are in `app/api/`:

- `/api/location` - Get user location
- `/api/auth` - User authentication
- `/api/users/*` - User management (create, get, update, password recovery)
- `/api/twitter/tweets` - Twitter search
- `/api/youtube/search` - YouTube search
- `/api/youtube/trending` - Trending videos
- `/api/reddit/posts` - Subreddit posts
- `/api/trends/*` - Google Trends data (interest over time, related queries, related topics)

See **[API_ENDPOINTS.md](API_ENDPOINTS.md)** for complete API documentation.

## 📚 Documentation

- **[NEXT_JS_UPGRADE_SUMMARY.md](NEXT_JS_UPGRADE_SUMMARY.md)** - Migration overview
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Detailed migration guide
- **[TAILWIND_MIGRATION.md](TAILWIND_MIGRATION.md)** - Tailwind CSS patterns
- **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - API documentation
- **[CLEANUP_GUIDE.md](CLEANUP_GUIDE.md)** - Remove legacy files

## 🎨 Styling with Tailwind CSS

This project uses Tailwind CSS for styling:

```javascript
// Use the cn() utility to merge classes
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

See **[TAILWIND_MIGRATION.md](TAILWIND_MIGRATION.md)** for common patterns.

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy automatically

### Other Platforms

- **Netlify:** Compatible with `@netlify/plugin-nextjs`
- **Self-hosted:** Run `npm run build` then `npm start`

## 🔧 Development

### Adding New Pages

```javascript
// app/(main)/example/page.js
export default function ExamplePage() {
  return <div>Example Page</div>
}
// Accessible at /example
```

### Adding API Routes

```javascript
// app/api/example/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  return NextResponse.json({ message: 'Hello' })
}
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b your-name/issue-#`
2. Make your changes
3. Commit: `git commit -m "descriptive message"`
4. Push: `git push`
5. Submit a pull request on GitHub

**Commit message guidelines:**
- ✅ "Fixed bug causing page component to crash. Updated auth function."
- ❌ "Fixed bug"

## 📄 License

ISC License

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- All API providers (Twitter, YouTube, Reddit, Google)

---

**Built with Next.js 15, React 19, and Tailwind CSS** | [Documentation](NEXT_JS_UPGRADE_SUMMARY.md)
