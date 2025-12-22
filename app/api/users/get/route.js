import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function POST(request) {
  const { username } = await request.json()
  const usernameLowercase = username ? username.toLowerCase() : ''
  const client = new MongoClient(process.env.MONGODB)

  try {
    await client.connect()
    const database = client.db('test')
    const collection = database.collection('users')

    const document = await collection.findOne({ username: usernameLowercase })

    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
