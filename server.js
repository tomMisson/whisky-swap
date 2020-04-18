require('dotenv').config()
const express = require('express')
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express()

app.get('/sign-up', function (req, res) {
    client.connect(err => {
        console.log("Connected");
      
    });
})
  
app.listen(3001)
