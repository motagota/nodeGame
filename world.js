exports.World = function()
{
   this.lastUpdated=Date().getTime();
   this.update();
   
   function update(){
      dt =Date().getTime() - lastUpdated;
      console.write("Update word - " + dt);
   }
}


