require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

app.get('/', (req,res) => {
    res.sendStatus(200);
})

app.post('/login', (req,res) => {
    const usrname = req.body.email;
    const password = req.body.pswd;

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");

            dbo.collection("users").findOne({email: usrname, pswd:password})
                .then(result => {
                    if(result!=null)
                        res.json({UID: result._id});
                    else
                        res.sendStatus(404);
                });            
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})

app.post('/profiles', function (req, res) {
    const data = req.body;

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");

            dbo.collection("users").insertOne(data)
                .then(result => res.json({UID: result.insertedId}));            
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})

app.post('/offers', function (req, res) {
    const data = req.body;

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");

            dbo.collection("offers").insertOne(data)
                .then(res.sendStatus(200));            
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})

app.get('/offers', function (req, res) {
    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");
            dbo.collection("offers").find({}).toArray()
                    .then(docs => res.json(docs))
                  
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})
  
app.listen(3001)
