'use strict';

var express = require('express');
var app = express();

//look for static files in html folder and allow access without .html extension
app.use(express.static('html', {
    extensions: ['html', 'htm'],
}));

//send index.html as homepage 
app.get('/', function(req, res) {
  //  res.sendFile(__dirname + '/index.html');
  res.send("Hello World.......!");
});

//route for user login/register
var auth = require('./server/auth.js');
app.use('/auth', auth);

//start the server
app.listen(8080,function(){
    console.log('Server started on port 8080');
});

