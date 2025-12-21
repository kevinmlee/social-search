import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

export async function POST(request) {
  const { subreddit } = await request.json()

  try {
    const feed = await parser.parseURL(`https://www.reddit.com/r/${subreddit}.rss`)

    return NextResponse.json(feed)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Reddit posts' },
      { status: 500 }
    )
  }
}
