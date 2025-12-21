# Next.js 15 Migration Guide

This repository has been upgraded from a Create React App + Netlify Functions setup to **Next.js 15** with App Router.

## What Changed

### Architecture
- **From**: React App (react-scripts) + Netlify Functions
- **To**: Next.js 15 App Router with API Routes

### Key Benefits
1. **Server Components**: Use React Server Components for better performance
2. **API Routes**: Netlify Functions → Next.js API routes (no need for separate serverless functions)
3. **File-based Routing**: React Router → Next.js automatic routing
4. **Better Performance**: Automatic code splitting, image optimization, and more
5. **Simplified Deployment**: Single application instead of client + functions

## Project Structure

```
social-search/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main layout group (with Header/Sidebar)
│   │   ├── layout.js             # Layout with Header & Sidebar
│   │   ├── page.js               # Home page (/)
│   │   ├── reddit/               # Reddit pages
│   │   │   ├── page.js           # /reddit
│   │   │   └── [query]/page.js   # /reddit/[query]
│   │   ├── youtube/              # YouTube pages
│   │   ├── trends/[query]/       # Trends pages
│   │   ├── profile/              # Profile page
│   │   └── settings/             # Settings page
│   ├── (auth)/                   # Auth layout group (no Header/Sidebar)
│   │   ├── signin/page.js        # Sign in page
│   │   └── signup/page.js        # Sign up page
│   ├── api/                      # API Routes (replaces Netlify Functions)
│   │   ├── location/route.js     # GET /api/location
│   │   ├── auth/route.js         # POST /api/auth
│   │   ├── users/                # User endpoints
│   │   │   ├── create/route.js   # POST /api/users/create
│   │   │   ├── get/route.js      # POST /api/users/get
│   │   │   ├── update/route.js   # POST /api/users/update
│   │   │   └── send-recovery-email/route.js
│   │   ├── twitter/tweets/route.js
│   │   ├── youtube/              # YouTube API routes
│   │   │   ├── search/route.js
│   │   │   └── trending/route.js
│   │   ├── reddit/posts/route.js
│   │   └── trends/               # Google Trends API routes
│   │       ├── interest-over-time/route.js
│   │       ├── related-queries/route.js
│   │       └── related-topics/route.js
│   ├── layout.js                 # Root layout
│   ├── providers.js              # Client-side providers (Context, MUI)
│   ├── globals.css               # Global styles
│   ├── styles/components/        # Component-specific styles
│   └── not-found.js              # 404 page
├── client/src/                   # Legacy client code (kept for reference)
│   ├── views/                    # View components (still used)
│   ├── components/               # Shared components
│   ├── api/                      # API client functions (needs updating)
│   ├── lib/                      # Helper utilities
│   └── util/                     # Utility functions
├── public/                       # Static assets
├── next.config.js                # Next.js configuration
├── jsconfig.json                 # Path aliasing configuration
├── package.json                  # Updated dependencies
└── .env                          # Environment variables

```

## Migration Steps Completed

### 1. ✅ Next.js Configuration
- Created [next.config.js](next.config.js)
- Created [jsconfig.json](jsconfig.json) with path aliasing (`@/*` → `client/src/*`)
- Updated [package.json](package.json) with Next.js dependencies

### 2. ✅ API Routes (Netlify Functions → Next.js)
All Netlify Functions have been migrated to Next.js API routes:

| Netlify Function | Next.js API Route |
|-----------------|-------------------|
| `/.netlify/functions/getLocation` | `/api/location` |
| `/.netlify/functions/auth` | `/api/auth` |
| `/.netlify/functions/createUser` | `/api/users/create` |
| `/.netlify/functions/getUser` | `/api/users/get` |
| `/.netlify/functions/updateUser` | `/api/users/update` |
| `/.netlify/functions/sendRecoveryEmail` | `/api/users/send-recovery-email` |
| `/.netlify/functions/tweets` | `/api/twitter/tweets` |
| `/.netlify/functions/youtubeSearch` | `/api/youtube/search` |
| `/.netlify/functions/youtubeTrending` | `/api/youtube/trending` |
| `/.netlify/functions/fetchSubredditPosts` | `/api/reddit/posts` |
| `/.netlify/functions/trends-interestOverTime` | `/api/trends/interest-over-time` |
| `/.netlify/functions/trends-relatedQueries` | `/api/trends/related-queries` |
| `/.netlify/functions/trends-relatedTopics` | `/api/trends/related-topics` |

### 3. ✅ Routing (React Router → Next.js)
File-based routing replaces React Router:

| React Router Route | Next.js Page |
|-------------------|--------------|
| `/` | `app/(main)/page.js` |
| `/reddit` | `app/(main)/reddit/page.js` |
| `/reddit/:query` | `app/(main)/reddit/[query]/page.js` |
| `/youtube` | `app/(main)/youtube/page.js` |
| `/youtube/:query` | `app/(main)/youtube/[query]/page.js` |
| `/trends/:query` | `app/(main)/trends/[query]/page.js` |
| `/profile` | `app/(main)/profile/page.js` |
| `/settings` | `app/(main)/settings/page.js` |
| `/signin` | `app/(auth)/signin/page.js` |
| `/signup` | `app/(auth)/signup/page.js` |

### 4. ✅ Layout & Providers
- Created [app/layout.js](app/layout.js) - Root layout
- Created [app/providers.js](app/providers.js) - Client-side context and MUI theme
- Created [app/(main)/layout.js](app/(main)/layout.js) - Layout with Header/Sidebar
- Created [app/(auth)/layout.js](app/(auth)/layout.js) - Auth layout (no Header/Sidebar)

### 5. ✅ Styles
- Migrated CSS to [app/globals.css](app/globals.css)
- Copied component styles to `app/styles/components/`
- Kept existing CSS structure

### 6. ✅ Environment Variables
- Created [.env.example](.env.example)
- Environment variables are now loaded automatically by Next.js

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `MONGODB` - MongoDB connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `TWITTER_BEARER_TOKEN` - Twitter API bearer token
- `YOUTUBE_API_KEY` - YouTube API key
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASSWORD` - Gmail app password
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., `http://localhost:3000`)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Next Steps (TODO)

### Update Client Code
The existing view components in `client/src/views/` are still using React Router navigation. Update them to use Next.js navigation:

```javascript
// OLD (React Router)
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/profile')

// NEW (Next.js)
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/profile')
```

Also update:
```javascript
// OLD
import { Link } from 'react-router-dom'
<Link to="/profile">Profile</Link>

// NEW
import Link from 'next/link'
<Link href="/profile">Profile</Link>
```

### Update API Calls
Update API calls in `client/src/api/` to use the new Next.js API routes:

```javascript
// OLD
fetch('/.netlify/functions/getLocation')

// NEW
fetch('/api/location')
```

### Server Components (Optional)
Consider converting some pages to Server Components for better performance:
- Fetch data on the server
- Reduce client-side JavaScript
- Improve SEO

Example:
```javascript
// app/(main)/page.js
export default async function HomePage() {
  // This runs on the server!
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()

  return <Home data={json} />
}
```

### Add Middleware (Optional)
Create `middleware.js` for auth protection, redirects, etc.

## Deployment

### Vercel (Recommended)
Next.js is developed by Vercel and has first-class support:

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Netlify
Next.js also works on Netlify:

1. Add a `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. Deploy to Netlify

### Other Platforms
Next.js can be deployed to:
- AWS (Amplify, EC2, ECS)
- Google Cloud (Cloud Run, App Engine)
- Azure
- DigitalOcean
- Self-hosted with `npm start`

## Key Differences

### Routing
- **Before**: React Router with `<Route>` components
- **After**: File-based routing with folder structure

### Data Fetching
- **Before**: `useEffect` + `fetch` in components
- **After**: Server Components can fetch data directly, or use client components with hooks

### API Endpoints
- **Before**: Netlify Functions in `client/netlify/functions/`
- **After**: API Routes in `app/api/`

### Navigation
- **Before**: `useNavigate()` from React Router
- **After**: `useRouter()` from `next/navigation`

### Environment Variables
- **Before**: Netlify dashboard + `process.env`
- **After**: `.env.local` + `process.env` (auto-loaded)
- **Public vars**: Prefix with `NEXT_PUBLIC_`

## Troubleshooting

### Path Aliasing Not Working
Make sure `jsconfig.json` is configured correctly and restart your dev server.

### MongoDB Connection Issues
Ensure your MongoDB connection string in `.env` is correct and your IP is whitelisted.

### MUI Styles Not Loading
MUI v6 works with Next.js 15, but make sure `@emotion/react` and `@emotion/styled` are installed.

### API Routes Returning 404
Check that route files are named `route.js` (not `index.js`) and are in the correct folder structure.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [MUI with Next.js](https://mui.com/material-ui/integrations/nextjs/)
- [Deploying Next.js](https://nextjs.org/docs/app/building-your-application/deploying)

## Questions?

If you encounter issues during migration, check:
1. This guide
2. [Next.js Documentation](https://nextjs.org/docs)
3. Open an issue in the repository
