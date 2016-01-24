var express = require("express");
var app = require('express')();
var http = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(http);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
   res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  socket.on('gyro', function(coords){
    io.emit('gyro', coords);
    console.log(coords);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});