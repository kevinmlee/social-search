const { MongoClient } = require('mongodb')

exports.handler = async (event, context) => {
  const { username } = JSON.parse(event.body)
  const usernameLowercase = username ? username.toLowerCase() : ""
  const client = new MongoClient(process.env.MONGODB)

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('users');

    const document = await collection.findOne({ username: usernameLowercase });

    return {
      statusCode: 200,
      body: JSON.stringify(document),
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