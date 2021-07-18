// Setting up the server and importing dependencies
const express = require('express');
const sharp = require('sharp');
const db = require('./firebase')
const request = require('request');
const fs = require('fs');
const app = express();
var path = require('path');

const port = process.env.PORT || 5000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Linking our static files (css, javascript)
app.use(express.static(path.join(__dirname, 'public')));

//GET REQUESTS
app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/public/index.html')
})

// Post requests
app.post('/submitRoute', (req, res)=>{

    // Getting Form Values
    var height = Number(req.body.height)
    var width = Number(req.body.width)
    var picUrl = req.body.picUrl

    // Function to download a pic from URL
    var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
            myEvent = `Downloading Image from uri ${uri}`
            myEvent += (`content-type: ${res.headers['content-type']}\n`);
            myEvent += (`content-length: ${res.headers['content-length']}`);

            db.collection('events').add({
                event: myEvent,
            })

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    // Calling Download Function here
    download(picUrl, 'myPic.png', function(){
        // This is a callback function that will be triggered after the file has been downloaded

        myEvent = 'Image is Downloaded'
        db.collection('events').add({
            event: myEvent,
        })

        sharp('myPic.png')
        .resize(width, height)
        .toFile(__dirname+'/public/output.webp')
        .then((data)=>{
            console.log(data);
            db.collection('events').add({
                event: 
                `Image conversion Data:\n
                format: ${data.format}\n
                width: ${data.width}\n
                height: ${data.height}\n
                channels: ${data.channels}\n
                premultiplied: ${data.premultiplied}\n
                size: ${data.size}\n
                `
            })
            res.send();
        })
        .catch(err => db.collection('errors').add({
            error: err,
        }))
    });
})


//Listening on port
app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
    db.collection('events').add({
        event: `Listening on port: ${port}`,
    })
});