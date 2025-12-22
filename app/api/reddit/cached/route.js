import { NextResponse } from 'next/server'
import { getStore } from '@netlify/blobs'

export async function GET() {
  try {
    // Check if we're in a Netlify environment
    if (!process.env.NETLIFY) {
      return NextResponse.json(
        { error: 'Cache only available in production' },
        { status: 503 }
      )
    }

    const store = getStore('reddit-cache')
    const cachedData = await store.get('homepage-feeds')

    if (!cachedData) {
      return NextResponse.json(
        { error: 'No cached data available' },
        { status: 404 }
      )
    }

    const parsedData = JSON.parse(cachedData)

    return NextResponse.json({
      success: true,
      ...parsedData
    })
  } catch (error) {
    console.error('Error reading from cache:', error)
    return NextResponse.json(
      { error: 'Failed to read cached data' },
      { status: 500 }
    )
  }
}
