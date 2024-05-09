const { MongoClient } = require('mongodb')
const bcrypt = require("bcrypt")
const saltRounds = 10

exports.handler = async (event, context) => {
  const { username, userUpdates } = JSON.parse(event.body)
  const usernameLowercase = username ? username.toLowerCase() : ""
  const client = new MongoClient(process.env.MONGODB)

  if (userUpdates?.password) {
    userUpdates.password = await bcrypt.hash(userUpdates.password, saltRounds);
  }

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('users');

    // Retrieve the document to update
    const filter = { username: usernameLowercase };
    const update = { $set: userUpdates }; // Specify the update operation
    const options = { returnOriginal: false }; // Set options, if needed

    // Perform findOneAndUpdate operation
    const updatedDocument = await collection.findOneAndUpdate(filter, update, options);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedDocument),
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