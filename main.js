
var log = console.log.bind(console);

window.onload = init;

var canvas, ctx;

var canvasWidth, canvasHeight, originXOffset, originYOffset;

function init() {
  log("Loaded!");

  canvas = document.getElementById("myCanvas");
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  originXOffset = 20;
  originYOffset = 20;
  ctx = canvas.getContext('2d');
  log(ctx);

  print_line(5, 5, 20, 20);
  print_dot(30, 30);

}

// Transform x coordinate.
function tx(x) {
  return x + originXOffset;
}

// Transform y coordinate.
function ty(y) {
  return canvasHeight-y - originYOffset;
}

function print_dot(x, y) {
  ctx.fillRect(tx(x), ty(y), 1, 1);
}

function print_line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(tx(x1), ty(y1));
  ctx.lineTo(tx(x2), ty(y2));
  ctx.stroke();

}
