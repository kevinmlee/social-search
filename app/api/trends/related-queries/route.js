import { NextResponse } from 'next/server'
import googleTrends from 'google-trends-api'

export async function POST(request) {
  const { searchQuery } = await request.json()

  try {
    const results = await googleTrends.relatedQueries({
      keyword: searchQuery,
    })

    return NextResponse.json(JSON.parse(results))
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
