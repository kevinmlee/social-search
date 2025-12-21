import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'

const saltRounds = 10

export async function POST(request) {
  const { username, userUpdates } = await request.json()
  const usernameLowercase = username ? username.toLowerCase() : ''
  const client = new MongoClient(process.env.MONGODB)

  if (userUpdates?.password) {
    userUpdates.password = await bcrypt.hash(userUpdates.password, saltRounds)
  }

  try {
    await client.connect()
    const database = client.db('test')
    const collection = database.collection('users')

    const filter = { username: usernameLowercase }
    const update = { $set: userUpdates }
    const options = { returnDocument: 'after' }

    const updatedDocument = await collection.findOneAndUpdate(filter, update, options)

    return NextResponse.json(updatedDocument)
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
