import { NextResponse } from 'next/server'
import googleTrends from 'google-trends-api'

export async function POST(request) {
  const { searchQuery, startTime, endTime, granularTimeResolution } = await request.json()

  try {
    const results = await googleTrends.interestOverTime({
      keyword: searchQuery,
      startTime: startTime,
      endTime: endTime,
      granularTimeResolution: granularTimeResolution,
    })

    return NextResponse.json(JSON.parse(results))
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
