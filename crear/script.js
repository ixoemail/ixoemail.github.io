var image=null;
var greenimage=null;

function upload() {
  var canvas = document.getElementById("original");
  var input = document.getElementById("userinput");
  image = new SimpleImage(input);
  image.drawTo(canvas);
}

function upload2() {
  var canvas = document.getElementById("greenscreen");
  var input = document.getElementById("userinput2");
  greenimage = new SimpleImage(input);
  greenimage.drawTo(canvas);
}



function greenscreen() {
  //
  if(image==null || ! image.complete()){
    alert("Imagen de fondo no subida");
    return;
  }
  //
  else if(greenimage==null || ! greenimage.complete()){
    //
    alert("Imagen de fondo no subida");
    return;
  }else{
    //
    var combine = new SimpleImage(greenimage.getWidth(),greenimage.getHeight());
  for (var pixel of combine.values()) {
   var x=pixel.getX();
   var y=pixel.getY(); 
    var treshold = 240;
    if(pixel.getGreen()>treshold){
      var newpixel= greenimage.getPixel(x,y);
     combine.setPixel(x,y,newpixel);
    }
    else{
      combine.setPixel(x,y,pixel)
    }
  }
  var canvas = document.getElementById("combine");
  combine.drawTo(canvas);
  }
}

function clearCanvas () {
  var canvas = document.getElementById("greenscreen");
  var canvas2 = document.getElementById("original");
  var canvas3 = document.getElementById("combine");
  var context = canvas.getContext("2d");
 var context2 = canvas2.getContext("2d");
  var context3 = canvas3.getContext("2d");
context.clearRect(0,0,canvas.width,canvas.height);
  context2.clearRect(0,0,canvas2.width,canvas2.height);
  context3.clearRect(0,0,canvas3.width,canvas2.height);
}