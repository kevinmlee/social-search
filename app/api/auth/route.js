import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'

export async function POST(request) {
  const { username, password } = await request.json()
  const usernameLowercase = username ? username.toLowerCase() : ''
  const client = new MongoClient(process.env.MONGODB)

  try {
    await client.connect()
    const database = client.db('test')
    const collection = database.collection('users')
    const document = await collection.findOne({ username: usernameLowercase })

    if (document) {
      const passwordMatch = await bcrypt.compare(password, document.password)

      if (passwordMatch) {
        return NextResponse.json(
          {
            success: true,
            message: 'Success. Passwords match.',
            data: document,
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'Passwords do not match. Please try again.',
          },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'User not found.',
      },
      { status: 404 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
