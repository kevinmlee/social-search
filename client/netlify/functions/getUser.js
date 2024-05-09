const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  const client = new MongoClient(process.env.MONGODB);

  try {
    await client.connect();

    const database = client.db('<database>');
    const collection = database.collection('<collection>');

    // Example: Insert a document
    await collection.insertOne({ name: 'John Doe' });

    // Example: Query documents
    const documents = await collection.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(documents),
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