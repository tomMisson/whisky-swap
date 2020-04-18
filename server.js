require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI
const client = new MongoClient(uri, { useNewUrlParser: true });


client.connect(err => {
  const collection = client.db("test").collection("devices");
  client.close();
});