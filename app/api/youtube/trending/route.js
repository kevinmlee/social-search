import { NextResponse } from 'next/server'

const endpoint = 'https://www.googleapis.com/youtube'

export async function POST(request) {
  const { countryCode } = await request.json()
  const url =
    `${endpoint}/v3/videos?part=snippet&chart=mostPopular&maxResults=15&key=${process.env.YOUTUBE_API_KEY}` +
    (countryCode ? `&regionCode=${countryCode}` : '')

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
