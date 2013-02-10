
var app = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io').listen(app);
var port = process.env.PORT || 5000;
app.listen(port);

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

function cell(_x,_y){ 
  this.x=_x;
  this.y=_y;

  this.energy =0;
  this.threshold = 100;
  this.gotGrass = false;
  this.spreadTo =false;


  this.gotRabbit=false;
  this.rabbitEnergy=100;
  this.rabbitThreshold =200;
  this.reporduce=false;
  this.hop=false

    
  this.update = update;
  function update(){
     if(this.gotRabbit){
        if(this.rabbitEnergy>this.rabbitThreshold){
           this.rabbitEnergy /=2;
           reproduce=true;
        }
        else{
           this.rabbitEnergy--;
           if(this.energy<=25) {
              if(( Math.floor(Math.random()*10 ) % 10) ==1){
                 this.rabbitEnergy -= 5;
                  hop=true;
              }
           }
           if(this.energy >0)
           {
             this.rabbitEnergy+=5;
             this.energy -=2;
           }
        }
       if(this.rabbitEnergy<=0) this.gotRabbit=false;
      }
    
     if(this.gotGrass){
        if (this.energy > this.threshold) {
	   //choose random cell
           //add to cell
           this.energy /=2;
           this.spreadTo=true;
         
       }       
       else{
          this.energy++;
        }
        if(this.energy<=0) {this.energy=0; this.gotGrass=false;}
     }
  }
}

var Forest = function(){
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

var Field = function(){
   this.cells = {};
   this.numCells = 10;
};


Field.prototype.speadTo = function(x,y){  
  newX=((Math.floor(Math.random() * 3))-1)
  newY=((Math.floor(Math.random() * 3))-1)
  console.log("multiply " + i + " , " + j  );
  
   if(x+newX >= numCells) return;
   if(x+newX <= 0) return;
   
   if(y+newY >= numCells) return;
   if(y+newY <= 0) return;
                               
   this.cells[x+newX][y+newY].gotGrass=true;
   this.cells[x+newX][y+newY].energy=35;
}
/*
function hop(x,y){
   var newX=(Math.floor(Math.random() * 4))-2;
   var newY=(Math.floor(Math.random() * 4))-2;
//console.log(newX +" "  + newY + " "+x + " "+y);
   if(x+newX >= numCells) return;
   if(x+newX <= 0) return;
   
   if(y+newY >= numCells) return;
   if(y+newY <=0) return;

   this.cells[x][y].gotRabbit = false;
   this.cells[x+newX][y+newY].gotRabbit=true;
}

function reproduce(x,y){
  newX=((Math.floor(Math.random() * 3))-1)
  newY=((Math.floor(Math.random() * 3))-1)

  if(x+newX >=numCells) return;
  if(x+newX <= 0) return;
   
   if(y+newY >= numCells) return;
   if(y+newY <=0) return;

   this.cells[x+newX][y+newY].gotRabbit=true;
   this.cells[x+newX][y+newY].rabbitEnergy=50;
}

*/

Field.prototype.init = function(_cells){   
this.cells=_cells;
this.cells[2][2].gotGrass =  true;
this.cells[2][2].energy = 100;
this.cells[2][9].gotGrass  = true;
this.cells[2][9].energy = 100;
this.cells[5][5].gotGrass  = true;
this.cells[5][5].energy = 100;
this.cells[6][5].gotGrass  = true;
this.cells[6][5].energy = 100;
this.cells[5][4].gotGrass  = true;
this.cells[5][4].energy = 100;
this.cells[4][4].gotGrass  = true;
this.cells[4][4].energy = 100;

this.cells[9][2].gotGrass  = true;
this.cells[9][2].energy = 100;
this.cells[9][9].gotGrass  = true;
this.cells[9][9].energy = 100;

this.cells[5][5].gotRabbit = true;
this.cells[2][2].gotRabbit = true;
this.cells[9][9].gotRabbit = true;
this.cells[5][5].gotRabbit = true;
}



Field.prototype.update = function(){    
   for (i=0;i<this.numCells;i++){
      for(j=0;j<this.numCells;j++){
         this.cells[i][j].update();
         if(this.cells[i][j].spreadtTo){ 
            console.log("tye spread");
            this.spreadTo(i,j);
            this.cells[i][j].spreadTo=false;
         }
      }
   }
};

this.cells={};
numCells=10;

for (i=0;i<numCells;i++){
       cellsRow = {};
       for (j=0;j<numCells;j++){
         cellsRow[j] = new cell(i,j);
       }
   this.cells[i]= cellsRow;
}

var fields =  new Field();
fields.init(this.cells);
setInterval(function(){ fields.update(); }, 100 );	

var dt=new Date().getTime();
var lastUpdate = dt;
var count=0
setInterval(sendTime, 1000);
function sendTime(){
   io.sockets.emit('updateTime', new Date());
   dt = new Date().getTime()-lastUpdate;
   lastUpdate = new Date().getTime();
  
   
   io.sockets.emit('refresh',1);
   io.sockets.emit('cells',fields.cells);
   
}

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {


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

