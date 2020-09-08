var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var JSONFILE = require('./models/jsonFile.js');
var app = express();
require('dotenv').config() // console.log(process.env)

setServer()

// prends en charge les requetes du type ("Content-type", "application/x-www-form-urlencoded")
app.use(bodyParser.urlencoded({
    extended: true
}));

// prends en charge les requetes du type ("Content-type", "application/json")
app.use(bodyParser.json());

// Add headers to allow CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.AUTHORIZED_ROOT_URL + ':' + process.env.AUTHORIZED_PORT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


/*
 * HTML
 */


// GET send index.html
app.get('/', function(req, res) {
    return res.sendFile(__dirname + '/client/index.html')
});

// GET send jsonFile.html
app.get('/json-file', function(req, res) {
    return res.sendFile(__dirname + '/client/json-file.html')
});

// GET send 404.html
app.get('/404', function(req, res) {
    return res.status(404).sendFile(__dirname + '/client/404.html')
});

/*
 * API
 */

/*
 * Json file
 */

// GET list json file
app.get('/api/json-file/json', function(req, res) {
    console.log("JSONFILE", JSONFILE);

    // result sent
    return res.status(200).send(JSONFILE);
       
});

// GET index by _id in json file
app.get('/api/json-file/index/:id', function(req, res) {

    console.log("id: ", req.params.id);
    
    var result = JSONFILE.find( (plant) => plant._id == req.params.id)

    if(!result) {
        // result sent
        return res.status(500).json({error: 'plant id ' + req.params.id + ' not found - status 500'});
    }
    else {
        console.log("result: ", result);

        // result sent
        return res.status(200).json(result);
    }
});

// POST send post test
app.post('/api/json-file/post/test', function(req, res) {
    console.log("body", req.body);
    res.status(200).json(req.body);
});

// POST add in json file
app.post('/api/json-file/add', function(req, res) {

    console.log("body", req.body);

    JSONFILE.push(req.body)

    console.log("JSONFILE", JSONFILE);
    // result sent
    res.status(200).json(JSONFILE);
    
});

// PUT update by _id in json file
app.put('/api/json-file/update/:id', function(req, res) {

    console.log("id", req.params.id);
    console.log("body", req.body);

    var index = JSONFILE.findIndex( (plant) => plant._id == req.params.id);

    console.log("index", index);

    if(index == -1) {
        // result sent
        return res.status(404).json({error: 'plant id ' + req.params.id + ' not found - status 404'});
    }
    else {

        JSONFILE[index] = req.body;

        // result sent
        return res.status(200).json(JSONFILE);
    }
    
    
});

// DELETE delete by _id in json file
app.delete('/api/json-file/delete/:id', function(req, res) {
    
    console.log("id", req.params.id);
    
    var index = JSONFILE.findIndex( (plant) => plant._id == req.params.id);

    console.log("index", index);

    if(index == -1) {
        // result sent
        return res.status(401).json({error: 'plant id ' + req.params.id + ' not found - status 401'});
    }
    else {

        JSONFILE.splice(index, 1);

        // result sent
        res.status(200).json(JSONFILE);

    }
});



// FUNCTION
function setServer() {
  
    var promise = mongoose.connect(process.env.MONGO_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    promise.then(
      () => {
          console.log("");
          console.log('DATABASE is connected on this url: ' + process.env.MONGO_HOST);
  
          app.listen(process.env.SERVER_PORT, () => {
            console.log('SERVER is listening on port: ' + process.env.ROOT_URL + ':' + process.env.SERVER_PORT);
            
            console.log('SERVER ENV: ');
            console.log(' - ROOT_URL:' + process.env.ROOT_URL);
            console.log(' - SERVER_PORT:' + process.env.SERVER_PORT);
            console.log(" ");
            console.log("------- ");
            console.log(" ");
            console.log('AUTHORIZED: ');
            console.log(' - AUTHORIZED_ROOT_URL:' + process.env.AUTHORIZED_ROOT_URL);
            console.log(' - AUTHORIZED_PORT:' + process.env.AUTHORIZED_PORT);
            console.log(" ");
  
            // SERVER PARAAMETERS
            // app.use(bodyParser.urlencoded({
            //   extended: true
            // }));
            // app.use(bodyParser());
            // // "Content-type", "application/json"
            // app.use(bodyParser.json());
          });
          
          
      },
      err => {
          console.log('ERROR DATABASE: NOT CONNECTED on this url: ' + process.env.MONGO_HOST);
          // console.log(err);
      }
    )
    .catch(
        () => {
            console.log('ERROR DATABASE: NOT CONNECTED on this url: ' + process.env.MONGO_HOST);
        }
    )
}

