const { MongoClient } = require('mongodb');

let cachedClient = null;

async function getClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Connect the client
  await client.connect();

  // Cache the client and return it
  cachedClient = client;
  return client;
}

module.exports = {
  getClient,
};