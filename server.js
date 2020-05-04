require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
var fileupload = require("express-fileupload");
const mongo = require("mongodb")
const MongoClient = mongo.MongoClient;

const uri = process.env.DBURI

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express()

const account = "doorstepdramsassets";


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileupload());
app.use(cors());

app.get('/', (req,res) => {
    res.sendStatus(200);
})

/// AUTHENTICATE

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

/// PROFILES

app.post('/profiles', function (req, res) {
    const data = req.body;

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");

            dbo.collection("users").findOne({email: data.email})
            .then(result => {
                if(result!=null)
                    res.json(409);
                else
                {
                    dbo.collection("users").insertOne(data)
                    .then(result => res.json({UID: result.insertedId}));
                }
            });    
        } 
        catch(err){
            res.sendStatus(500);
        }
    });
})

app.get('/profiles/:id', function (req, res) {
    const id = req.params.id;

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");
            var o_id = new mongo.ObjectID(id);

            dbo.collection("users").findOne({_id: o_id})
                .then(result => res.json(result));          
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})

/// OFFERS

app.post('/offers', function (req, res) {
    var obj = req.body.data
    try{var files = req.files.image}
    catch{}
    console.log(obj)

    client.connect(function(err, db) {
        //data.image = <URL from azure>
        if (err) throw err;
        var dbo = db.db("whisky-swap");

        dbo.collection("offers").insertOne(JSON.parse(obj))
            .then(res.sendStatus(200))
            .catch(err => res.json({"debug":err}));      
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

app.get('/offers/:offerId', function (req, res) {
    client.connect(function(err, db) {
        try{
            if (err) throw err;
            const id = req.params.offerId;
            var dbo = db.db("whisky-swap");
            var o_id = new mongo.ObjectID(id);

            dbo.collection("offers").find({_id: o_id}).toArray()
                .then(docs => res.json(docs))
                  
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})

app.get('/user-offers/:uid', function (req, res) {
    const id = req.params.uid;
    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");

            dbo.collection("offers").find({UID: id}).toArray()
                .then(docs => res.json(docs))
                  
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})

app.delete('/offers/:id', function (req, res) {
    const id = req.params.id;
    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");
            var o_id = new mongo.ObjectID(id);
-
            dbo.collection("offers").deleteOne({_id:o_id})
                .then(cb => cb.deletedCount === 1 ? res.sendStatus(200) : res.sendStatus(404))
                  
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})

app.put('/offers/:id', function (req, res) {
    const id = req.params.id;
    const document = req.body
    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");
            var o_id = new mongo.ObjectID(id);
-
            dbo.collection("offers").updateOne({_id:o_id}, 
                { $set: { name: document.name, distillery: document.distillery, abv: document.abv, details: document.details, type: document.type} }
                )
                .then(cb => cb.modifiedCount >= 1 ? res.sendStatus(200) : res.sendStatus(304))
                  
        }
        catch(err){
            console.log(JSON.stringify(document))
            console.log(err)
            res.sendStatus(500);
        }
    });
})
  
app.listen(process.env.PORT)
