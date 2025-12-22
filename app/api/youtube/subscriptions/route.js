import { NextResponse } from 'next/server'
import https from 'https'

const ENDPOINT = 'https://www.googleapis.com/youtube/v3'

function fetchFromYouTube(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (response) => {
      let data = ''
      response.on('data', (chunk) => (data += chunk))
      response.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    })
    req.on('error', reject)
  })
}

export async function POST(request) {
  try {
    const { channelIds } = await request.json()

    if (!channelIds || channelIds.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // Fetch videos from each channel
    // Limit to 10 channels, 5 videos each = 50 total (API max)
    const videoPromises = channelIds.slice(0, 10).map(channelId =>
      fetchFromYouTube(
        `${ENDPOINT}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=5&key=${process.env.YOUTUBE_API_KEY}`
      )
    )

    const results = await Promise.all(videoPromises)

    // Combine all videos and sort by published date (most recent first)
    const allVideos = results
      .flatMap(result => result.items || [])
      .sort((a, b) => {
        const dateA = new Date(a.snippet.publishedAt)
        const dateB = new Date(b.snippet.publishedAt)
        return dateB - dateA
      })
      .slice(0, 50) // Limit to 50 videos total (YouTube API max)

    console.log('First video date:', allVideos[0]?.snippet?.publishedAt)
    console.log('Last video date:', allVideos[allVideos.length - 1]?.snippet?.publishedAt)

    return NextResponse.json({ items: allVideos })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
