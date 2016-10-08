
var log = console.log.bind(console);

window.onload = init;

var canvas, ctx;

var canvasWidth, canvasHeight, originXOffset, originYOffset, tickLength;

var gridSpacing, xMin, xMax, xScale, yMin, yMax, yScale;

function init() {
  log("Loaded!");

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext('2d');
  log(ctx);

  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  originXOffset = 100;
  originYOffset = 300;
  gridSpacing = 1;
  tickLength = 0.2;
  xMin = -5;
  xMax = 30;
  yMin = -10;
  yMax = 10;

  xScale = canvasWidth / (xMax - xMin);
  yScale = canvasHeight / (yMax - yMin);

  // print_line(5, 5, 20, 20);
  // print_dot(30, 30);


  // for (var x = xMin; x < xMax; x+= 0.1) {
  //   print_dot(x, x * x);
  // }

  // Cantilever

  draw_frame();


}


function draw_frame(timestamp) {

  // log(timestamp);

  ctx.clearRect(0,0,canvasWidth, canvasHeight);

  print_x_axis();
  print_y_axis();
  print_beam(timestamp);

  // print_line_angle(5,5, 5, radians(-45));

  window.requestAnimationFrame(draw_frame);

}

function radians(degrees) {
  return Math.PI / 180 * degrees;
}

function print_arrow(x1, y1, x2, y2) {
  print_line(x1, y1, x2, y2);
  var theta = Math.atan2(y1 - y2, x1 - x2);
  print_line_angle(x2, y2, 1, theta - radians(45));
  print_line_angle(x2, y2, 1, theta + radians(45));
}

function print_line_angle(x, y, length, angle) {
  var x2 = length * Math.cos(angle) + x;
  var y2 = length * Math.sin(angle) + y;
  print_line(x, y, x2, y2);
}

function print_beam(timestamp) {
  var P = -0.3;
  var l = 20;
  var E = 30;

  var b = 10;
  var h = 2;
  var I = b * h * h * h / 12;

  var duration = 1000;

  var P_interp = interp(0, duration, 0, P, timestamp);
  // log(P_interp);

  var x_i, y_i;
  for (var x = 0; x < l; x+=0.1 ) {
    var y = P_interp*x*x / (6*E*I) * (3*l - x);
    print_dot(x,  y);
    x_i = x;
    y_i = y;

    // log(y);
  }

  print_arrow(x_i, y_i + 5, x_i, y_i + 0.2);



}

function interp(x_start, x_end, y_start, y_end, x) {
  if (x < x_end) {
    return (y_end - y_start) / (x_end - x_start) * x + y_start;
  } else {
    return y_end;
  }


}

function print_x_axis() {
  print_line(xMin, 0, xMax, 0);

  for (var x = 0; x > xMin; x -= gridSpacing) {
    print_line(x, tickLength, x, -tickLength);
  }

  for (var x = 0; x < xMax; x += gridSpacing) {
    print_line(x, tickLength, x, -tickLength);
  }

}

function print_y_axis() {
  print_line(0, yMin, 0, yMax);

  for (var y = 0; y > yMin; y -= gridSpacing) {
    print_line(tickLength, y, -tickLength, y);
  }

  for (var y = 0; y < yMax; y += gridSpacing) {
    print_line(tickLength, y, -tickLength, y);
  }

}

// Transform x coordinate.
function tx(x) {
  return (x - xMin) * xScale;
}

// Transform y coordinate.
function ty(y) {
  return canvasHeight - (y - yMin) * yScale;
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
