import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'

const saltRounds = 10

export async function POST(request) {
  const { username, password, firstName, lastName, avatar, accountType } = await request.json()
  const usernameLowercase = username ? username.toLowerCase() : ''
  const client = new MongoClient(process.env.MONGODB)
  const hashedPassword = await bcrypt.hash(password || usernameLowercase, saltRounds)
  const verificationToken = bcrypt
    .hashSync(usernameLowercase + Date.now(), saltRounds)
    .replace(/\//g, '_')

  try {
    await client.connect()
    const database = client.db('test')
    const collection = database.collection('users')

    const count = await collection.countDocuments()

    const result = await collection.insertOne({
      userId: count + 1,
      username: usernameLowercase,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
      accountType: accountType,
      verificationToken: verificationToken,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
