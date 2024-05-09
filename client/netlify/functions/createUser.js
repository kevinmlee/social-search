const { MongoClient } = require('mongodb')
const bcrypt = require("bcrypt")
const saltRounds = 10

exports.handler = async (event, context) => {
  const { username, password, firstName, lastName, avatar, accountType } = JSON.parse(event.body)
  const usernameLowercase = username ? username.toLowerCase() : ""
  const client = new MongoClient(process.env.MONGODB)
  const hashedPassword = await bcrypt.hash(password || usernameLowercase, saltRounds);
  const verificationToken = bcrypt
      .hashSync(usernameLowercase + Date.now(), saltRounds)
      .replace(/\//g, "_");

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('users');

    const count = await collection.countDocuments();

    const result = await collection.insertOne({ 
      userId: count + 1,
      username: usernameLowercase,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      avator: avatar,
      accountType: accountType,
      verificationToken: verificationToken
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  } finally {
    await client.close();
  }
};
