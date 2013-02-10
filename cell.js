function cell(_x,_y){ 
  this.x=_x;
  this.y=_y;

  this.energy =0;
  this.threshold = 100;
  this.gotGrass = false;


  this.gotRabbit=false;
  this.rabbitEnergy=100;
  this.rabbitThreshold =200;

    
  this.update = update;
  function update(){
     if(this.gotRabbit){
        if(this.rabbitEnergy>this.rabbitThreshold){
           this.rabbitEnergy /=2;
           reproduce(this.x,this.y);
        }
        else{
           this.rabbitEnergy--;
           if(this.energy<=25) {
              if(( Math.floor(Math.random()*10 ) % 10) ==1){
                 this.rabbitEnergy -= 5;
                  hop(this.x,this.y);
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
           this.newX=((Math.floor(Math.random() * 3))-1)
           this.newY=((Math.floor(Math.random() * 3))-1)
         ///  console.log("multiply " + i + " , " + j  );
           spreadTo(this.x,this.y,this.newX,this.newY);
       }       
       else{
          this.energy++;
        }
        if(this.energy<=0) {this.energy=0; this.gotGrass=false;}
     }
  }
var numCells =10;
function spreadTo(x,y,newX,newY){  

   if(x+newX >= numCells) return;
   if(x+newX <= 0) return;
   
   if(y+newY >= numCells) return;
   if(y+newY <= 0) return;
                               
   cells[x+newX][y+newY].gotGrass=true;
   cells[x+newX][y+newY].energy=35;
}

function hop(x,y){
   var newX=(Math.floor(Math.random() * 4))-2;
   var newY=(Math.floor(Math.random() * 4))-2;
//console.log(newX +" "  + newY + " "+x + " "+y);
   if(x+newX >= numCells) return;
   if(x+newX <= 0) return;
   
   if(y+newY >= numCells) return;
   if(y+newY <=0) return;

   cells[x][y].gotRabbit = false;
   cells[x+newX][y+newY].gotRabbit=true;
}

function reproduce(x,y){
  newX=((Math.floor(Math.random() * 3))-1)
  newY=((Math.floor(Math.random() * 3))-1)

  if(x+newX >=numCells) return;
  if(x+newX <= 0) return;
   
   if(y+newY >= numCells) return;
   if(y+newY <=0) return;

   cells[x+newX][y+newY].gotRabbit=true;
   cells[x+newX][y+newY].rabbitEnergy=50;
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

Field.prototype.init = function(_cells){   
this.cells=_cells;
this.cells[2][2].gotGrass =  true;
this.cells[2][2].energy = 100;
this.cells[2][9].gotGrass  = true;
this.cells[2][9].energy = 100;
this.cells[5][5].gotGrass  = true;
this.cells[6][5].energy = 100;
this.cells[6][5].gotGrass  = true;
this.cells[5][6].energy = 100;
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
      for(j=0;this.j<this.numCells;j++){
         this.cells[i][j].update();
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

//var fields =  new Field();
//fields.init(this.cells);
//setInterval(function(){ fields.update(); }, 100 );	
