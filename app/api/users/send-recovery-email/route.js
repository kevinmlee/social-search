import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

const saltRounds = 10

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function POST(request) {
  const { username } = await request.json()
  const usernameLowercase = username ? username.toLowerCase() : ''
  const client = new MongoClient(process.env.MONGODB)
  const newVerificationToken = bcrypt
    .hashSync(username + Date.now(), saltRounds)
    .replace(/\//g, '_')

  const mailOptions = {
    from: 'no-reply@getcurrently.com',
    to: usernameLowercase,
    subject: 'Currently: Account Verification',
    text:
      'This email was sent because someone is attempting to recover this account.\n\n' +
      'If this was you, please verify your account by clicking the link below: \n' +
      `${process.env.NEXT_PUBLIC_APP_URL}/new-password/${newVerificationToken}` +
      ".\n\nIf this wasn't initiated by you, you can ignore this email.",
  }

  try {
    await transporter.sendMail(mailOptions)

    await client.connect()
    const database = client.db('test')
    const collection = database.collection('users')

    const filter = { username: usernameLowercase }
    const update = { $set: { verificationToken: newVerificationToken } }
    const options = { returnDocument: 'after' }

    const updatedDocument = await collection.findOneAndUpdate(filter, update, options)

    return NextResponse.json({ updatedDocument })
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
