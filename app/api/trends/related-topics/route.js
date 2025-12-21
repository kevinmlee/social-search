import { NextResponse } from 'next/server'
import googleTrends from 'google-trends-api'

export async function POST(request) {
  const { searchQuery, startTime, endTime } = await request.json()

  try {
    const results = await googleTrends.relatedTopics({
      keyword: searchQuery,
      startTime: startTime,
      endTime: endTime,
    })

    return NextResponse.json(JSON.parse(results))
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
