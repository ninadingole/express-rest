var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
var db;
// Connect to the libraryApp_test mongodb database if running in Test mode
if (process.env.ENV == 'test') {
    var db = mongoose.connect('mongodb://localhost:27017/libraryApp_test');
} else {
    var db = mongoose.connect('mongodb://localhost:27017/libraryApp');
}
// import BookModel
var Book = require('./models/bookModel');
// import bookRouter from routes folder and inject Book model
var bookRouter = require('./routes/bookRouter.js')(Book);
// create new express app
var app = express();
// get the port from enviorment variable or otherwise use 3000 port
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



// tell express to use bookrouter when any request is recieved for /api/**
app.use('/api/Books', bookRouter);
// send a welcome message when a request arrives at the root level
app.get('/', function (req, res) {
    res.send('Hello, Welcome to library rest API.');
});

// listen on the port for any request, this is the start point of the application.
app.listen(port, function () {
    console.log('App started on port ' + port);
});

module.exports = app;