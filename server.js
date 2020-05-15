require('dotenv').config()
var hash = require('hash.js')
const express = require('express')
const bodyParser = require('body-parser')
const getStream = require('into-stream');
const cors = require('cors')
const { Aborter,BlobURL,BlockBlobURL,ContainerURL,BlobServiceClient,StorageSharedKeyCredential,uploadStreamToBlockBlob, newPipeline } = require('@azure/storage-blob');
var fileupload = require("express-fileupload");
const mongo = require("mongodb")
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const MongoClient = mongo.MongoClient;

const uri = process.env.DBURI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);

const pipeline = newPipeline(sharedKeyCredential);
const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);

const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

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

app.post('/profiles', async (req, res) => {
    const data = JSON.parse(req.body.data);
    try{
        var files = req.files.profPic
        const blobName = hash.sha256().update(data.name).digest('hex')+files.name;
        const stream = getStream(files.data);
        const containerClient = blobServiceClient.getContainerClient('profileimages');;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadStream(stream,uploadOptions.bufferSize, uploadOptions.maxBuffers, { blobHTTPHeaders: { blobContentType: "image/*" } })
            .catch(err => console.log(err))

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
                        data.img = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/profileimages/${blobName}` 
                        dbo.collection("users").insertOne(data)
                        .then(result => res.json({UID: result.insertedId}));
                    }
                });    
            } 
            catch(err){
                res.sendStatus(500);
            }
        });
    }
    catch(err){
        console.log(err)
    }
})

app.get('/profiles/:id', function (req, res) {
    const id = req.params.id;

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");
            var o_id = new mongo.ObjectID(id);

            dbo.collection("users").findOne({_id: o_id})
                .then(result => {
                    delete result.pswd
                    res.json(result)
                })
        }
        catch(err){
            res.sendStatus(500);
        }
    });
})

app.put('/profiles-password/:id', function (req, res) {
    const id = req.params.id;
    const document = req.body
    console.log(req.body)

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");
            var o_id = new mongo.ObjectID(id);

            dbo.collection("users").updateOne({_id:o_id}, 
                { $set: { pswd: document.password }}
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

app.put('/profiles-details/:id', async (req, res) => {

    const id = req.params.id;
    const document = JSON.parse(req.body.data);
    try{
        var files = req.files.profPic
        const blobName = hash.sha256().update(files.name).digest('hex')+files.name;
        const stream = getStream(files.data);
        const containerClient = blobServiceClient.getContainerClient('profileimages');;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadStream(stream,uploadOptions.bufferSize, uploadOptions.maxBuffers, { blobHTTPHeaders: { blobContentType: "image/*" } })
            .catch(err => console.log(err))

        document.img=`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/profileimages/${blobName}`

        client.connect(function(err, db) {
            try{
                if (err) throw err;
                var dbo = db.db("whisky-swap");
                var o_id = new mongo.ObjectID(id);
    
                dbo.collection("users").updateOne({_id:o_id}, 
                    { $set: { name: document.name, email: document.email, phone:document.phone, img: document.img}}
                    ,{upsert:true})
                    .then(cb => cb.modifiedCount >= 1 ? res.sendStatus(200) : res.sendStatus(304))
                      
            }
            catch(err){
                console.log(JSON.stringify(document))
                console.log(err)
                res.sendStatus(500);
            }
        });
    }
    catch(err){
        console.log(err)
    }
})

app.put('/profiles-delivery/:id', function (req, res) {
    const id = req.params.id;
    const document = req.body

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");
            var o_id = new mongo.ObjectID(id);

            dbo.collection("users").updateOne({_id:o_id}, 
                { $set: { delivery: document.delivery, address1: document.address1,address2: document.address2,address3: document.address3, postcode: document.postcode }}
                )
                .then(cb => cb.modifiedCount >= 1 ? res.sendStatus(200) : res.sendStatus(500))
                  
        }
        catch(err){
            console.log(JSON.stringify(document))
            console.log(err)
            res.sendStatus(500);
        }
    });
})

app.get('/send-email-verify/:email', (req,res)=>{
    const email = req.params.email

    const confirmEmail = {
        to: email,
        from: 'hi@doorstepdrams.com',
        subject: 'Confirm your email address',
        html: `<!DOCTYPE html><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"> <meta http-equiv="X-UA-Compatible" content="IE=Edge"> <style type="text/css"> body, p, div{font-family: arial,helvetica,sans-serif; font-size: 14px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 100% !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}.social-icon-column{display: inline-block !important;}}</style> </head> <body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF"> <tr> <td valign="top" bgcolor="#FFFFFF" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="fb2f1c9e-af85-4863-945f-f962d127e1c1"> <tbody> <tr> <td height="100%" valign="top" role="module-content"><center><h1 style="">Doorstep Drams</h1></center></td></tr></tbody> </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="27d5ca9c-81b3-4f96-9bbd-5a5abf22bcc5"> <tbody> <tr> <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:30% !important; width:30%; height:auto !important;" width="180" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/93db217a74ab3458/b4117fa3-6322-472c-b08c-0d164f00a8a3/1000x1000.jpg"> </td></tr></tbody> </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9a1c701d-6673-436a-a18d-8f2e803b6edb" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit">In order to register drams for trading and place offers on drams, you will have to verify your email address.&nbsp;</div><div></div></div></td></tr></tbody> </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="4caabc41-5a22-4358-8545-85f1075737e7"> <tbody> <tr> <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;"> <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;"> <tbody> <tr> <td align="center" bgcolor="#fc9403" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"> <a href="https://whisky-swap-api.azurewebsites.net/confirm-verify/`+ email +`" style="background-color:#fc9403; border:1px solid #; border-color:#; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Click to verify</a> </td></tr></tbody> </table> </td></tr></tbody> </table><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="999e967e-1e51-4c06-a448-f83214cebc88"> <tbody> <tr> <td height="100%" valign="top" role="module-content"><div style="font-family: inherit; text-align: center"><span style="font-size: 10px">This email was sent on behalf of Doorstep Drams and adheres to <a title="Privacy policy" href="https://github.com/tomMisson/brand/blob/master/privacy-policy.md">Tom Misson's privacy policy</a></span></div></td></tr></tbody> </table></td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table> </div></center> </body> </html>`
    }
    
    sgMail.send(confirmEmail)
        .then(res.sendStatus(200))
})

app.get('/confirm-verify/:email', (req,res)=>{
    const emailAddr = req.params.email;

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");

            dbo.collection("users").updateOne({email:emailAddr}, 
                { $set: { verifiedEmail:true}}
                ,{upsert:true})
                .then(res.redirect('https://doorstepdrams.com/account'))
                    
        }
        catch(err){
            res.json({debug:err});
        }
    })
})

app.get('/send-email-pswd/:email', async (req,res)=>{

    const email = req.params.email;

    client.connect(function(err, db) {
        try{
            if (err) throw err;
            var dbo = db.db("whisky-swap");

            dbo.collection("users").findOne({email: email})
                .then(result => {
                    if(result!==null)
                    {
                        const confirmEmail = {
                            to: email,
                            from: 'hi@doorstepdrams.com',
                            subject: 'Password reset',
                            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"> <meta http-equiv="X-UA-Compatible" content="IE=Edge"> <style type="text/css"> body, p, div{font-family: arial,helvetica,sans-serif; font-size: 14px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 100% !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}.social-icon-column{display: inline-block !important;}}</style> </head> <body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF"> <tr> <td valign="top" bgcolor="#FFFFFF" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="fb2f1c9e-af85-4863-945f-f962d127e1c1"> <tbody> <tr> <td height="100%" valign="top" role="module-content"><center><h1 style="">Doorstep Drams</h1></center></td></tr></tbody> </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="27d5ca9c-81b3-4f96-9bbd-5a5abf22bcc5"> <tbody> <tr> <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:30% !important; width:30%; height:auto !important;" width="180" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/93db217a74ab3458/b4117fa3-6322-472c-b08c-0d164f00a8a3/1000x1000.jpg"> </td></tr></tbody> </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9a1c701d-6673-436a-a18d-8f2e803b6edb" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit">You have requested to change your password. To rest your password, please click the button below and you will be transferred to a page that will reset your password.&nbsp;</div><div></div></div></td></tr></tbody> </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9a1c701d-6673-436a-a18d-8f2e803b6edb.1"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit">If you believe you have received this in error, or suspect your account may be compromised, reset your password and contact <a href="mailto:hi@doorstepdrams.com?subject=Account is compromised&amp;body=">hi@doorstepdrams.com</a></div><div></div></div></td></tr></tbody> </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="4caabc41-5a22-4358-8545-85f1075737e7"> <tbody> <tr> <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;"> <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;"> <tbody> <tr> <td align="center" bgcolor="#fc9403" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"> <a href="https://doorstepdrams.com/forgot/${result._id}" style="background-color:#fc9403; border:1px solid #; border-color:#; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Click to change password</a> </td></tr></tbody> </table> </td></tr></tbody> </table><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="999e967e-1e51-4c06-a448-f83214cebc88"> <tbody> <tr> <td height="100%" valign="top" role="module-content"><div style="font-family: inherit; text-align: center"><span style="font-size: 10px">This email was sent on behalf of Doorstep Drams and adheres to <a title="Privacy policy" href="https://github.com/tomMisson/brand/blob/master/privacy-policy.md">Tom Misson's privacy policy</a></span></div></td></tr></tbody> </table></td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table> </div></center> </body> </html>`
                        }
                        
                        sgMail.send(confirmEmail)
                            .then(res.sendStatus(200))
                            .catch(err => null)
                    }
                    else 
                        res.sendStatus(404)
                })
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

            dbo.collection("offers").updateOne({_id:o_id}, 
                { $set: { name: document.name, distillery: document.distillery, abv: document.abv, details: document.details, type: document.type, region: document.region, size: document.size} }
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
