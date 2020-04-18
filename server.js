require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/profiles', function (req, res) {
    const data = req.body

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");

            dbo.collection("users").insertOne(data, function(err, res) {
            if (err) throw err;
            db.close();
            });
            res.sendStatus(200);
        }
        catch{
            res.sendStatus(500);
        }
    });
})
  
app.listen(3001)
