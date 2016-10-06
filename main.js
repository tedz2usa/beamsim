
var log = console.log.bind(console);

window.onload = init;

var canvas, ctx;

var canvasWidth, canvasHeight, originXOffset, originYOffset;

var gridSpacing, xMin, xMax, yMin, yMax;

function init() {
  log("Loaded!");

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext('2d');
  log(ctx);

  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  originXOffset = 100;
  originYOffset = 300;
  gridSpacing = 25;
  xMin = -50;
  xMax = 600;
  yMin = -200;
  yMax = 400;

  print_line(5, 5, 20, 20);
  print_dot(30, 30);

  print_x_axis();
  print_y_axis();

  for (var x = xMin; x < xMax; x+= 0.1) {
    print_dot(x, x * x);
  }

}

function print_x_axis() {
  print_line(xMin, 0, xMax, 0);

  for (var x = 0; x > xMin; x -= gridSpacing) {
    print_line(x, 5, x, -5);
  }

  for (var x = 0; x < xMax; x += gridSpacing) {
    print_line(x, 5, x, -5);
  }

}

function print_y_axis() {
  print_line(0, yMin, 0, yMax);

  for (var y = 0; y > yMin; y -= gridSpacing) {
    print_line(5, y, -5, y);
  }

  for (var y = 0; y < yMax; y += gridSpacing) {
    print_line(5, y, -5, y);
  }

}

// Transform x coordinate.
function tx(x) {
  return x + originXOffset;
}

// Transform y coordinate.
function ty(y) {
  return canvasHeight-y - originYOffset;
}

// Print a dot.
function print_dot(x, y) {
  ctx.fillRect(tx(x), ty(y), 1, 1);
}

// Print a line.
function print_line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(tx(x1), ty(y1));
  ctx.lineTo(tx(x2), ty(y2));
  ctx.stroke();

}
