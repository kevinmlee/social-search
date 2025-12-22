import { NextResponse } from 'next/server'

const endpoint = 'https://www.googleapis.com/youtube'

export async function POST(request) {
  const { searchQuery, order } = await request.json()
  const url = `${endpoint}/v3/search?q=${searchQuery}&maxResults=15&part=snippet&order=${order}&key=${process.env.YOUTUBE_API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
