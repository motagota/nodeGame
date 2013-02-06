var app = require('http').createServer(handler);

var fs = require('fs');
var io = require('socket.io').listen(app);

var port = process.env.PORT || 5000;
	app.listen(port);


//var world = require("./world.js");


// websockets not supported yet
io.configure(function () { 
 io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


function Forest(){
   this.maxTrees = 1000;
   this.growthRate = 1;
   this.trees =0;
   this.updateForest = updateForest;
   this.setLevel =setLevel;
   this.level =1;
   this.wood =0;
   this.deathRate=0.001;
   this.maxWood=500;
   
   function setLevel(level){
       this.level =level;
       this.growthRate *=level;
       this.maxTrees *= level;
       
       this.maxWood *=level;
   }

   function updateForest(dt){
      this.trees +=  (this.growthRate *dt);

      if(this.trees > this.maxTrees) this.trees = this.maxTrees;

      this.wood += this.trees * (this.deathRate* dt);
      this.trees -= this.deathRate*dt;

      if(this.wood > this.maxWood) this.wood = this.maxWood;
      if(this.trees<0) this.trees=0;
   }  
}

var f1 = {};
for(i=0; i<10;i++){  f1[i] = new Forest(); f1[i].setLevel(i);}
var dt=new Date().getTime();
var lastUpdate = dt;
var count=0
setInterval(sendTime, 1000);
function sendTime(){
   io.sockets.emit('updateTime', new Date());
   dt = new Date().getTime()-lastUpdate;
   lastUpdate = new Date().getTime();
   for( i=0;i<10;i++) f1[i].updateForest(dt/1000);
   count++;
   count = count %10;
   io.sockets.emit('updateForest', count, f1[count]);
   
}

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {

   socket.on('updateForest',function(index){
io.sockets.emit('updateForest', index, f1[index]);
});

   // when the client emits 'sendchat', this listens and executes
   socket.on('sendchat', function (data) {

   // we tell the client to execute 'updatechat' ith 2 parameters
   io.sockets.emit('updatechat', socket.username, data);
});

   // when the client emits 'adduser', this listens and executes
socket.on('adduser', function(username){
   // we store the username in the socket session for this client

   socket.username = username;

   // add the client's username to the global list
   usernames[username] = username;

  // echo to client they've connected
   socket.emit('updatechat', 'SERVER', 'you have connected');

   // echo globally (all clients) that a person has connected
   socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
   
 // update the list of users in chat, client-side
   io.sockets.emit('updateusers', usernames);

});



// when the user disconnects.. perform this

socket.on('disconnect', function(){

   // remove the username from global usernames list

  delete usernames[socket.username];

   // update list of users in chat, client-side

   io.sockets.emit('updateusers', usernames);

   // echo globally that this client has left

   socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');

});

});

