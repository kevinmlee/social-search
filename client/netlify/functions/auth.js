const { MongoClient } = require('mongodb')
const bcrypt = require("bcrypt")

exports.handler = async (event, context) => {
  const { username, password } = JSON.parse(event.body)
  const usernameLowercase = username ? username.toLowerCase() : ""
  const client = new MongoClient(process.env.MONGODB)

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('users');

    const document = await collection.findOne({ username: usernameLowercase });

    if (document) {
      const passwordMatch = bcrypt.compare(password, document.password)

      if (passwordMatch) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: "Success. Passwords match.",
            data: document,
          })
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({
            success: false,
            message: "Passwords do not match. Please try again.",
          })
        };
      }
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  } finally {
    await client.close();
  }
};