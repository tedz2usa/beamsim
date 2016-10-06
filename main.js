
var log = console.log.bind(console);

window.onload = init;

var canvas, ctx;


function init() {
  log("Loaded!");

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext('2d');
  log(ctx);

}
