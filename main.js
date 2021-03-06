
var log = console.log.bind(console);

window.onload = init;

var canvas, ctx;

var canvasWidth, canvasHeight, originXOffset, originYOffset, tickLength;

var gridSpacing, xMin, xMax, xScale, yMin, yMax, yScale;

var inputForce, inputLength, inputElasticity, inputBeamWidth, inputBeamHeight;
var selectLoadLocationOption, inputLoadLocation, selectBeamSupport;
var inputXMin, inputXMax, inputYMin, inputYMax;

var animationStart, animationDuration, animationReset = true;

var P, L, E, B, H, I, A, max_deflection;


function init() {

  log("Loaded!");

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext('2d');

  inputForce = document.getElementById("inputForce");
  inputLength = document.getElementById("inputLength");
  inputElasticity = document.getElementById("inputElasticity");
  inputBeamWidth = document.getElementById("inputBeamWidth");
  inputBeamHeight = document.getElementById("inputBeamHeight");

  selectLoadLocationOption = document.getElementById("selectLoadLocationOption");
  inputLoadLocation = document.getElementById("inputLoadLocation");
  selectBeamSupport = document.getElementById("selectBeamSupport");

  inputXMin = document.getElementById("inputXMin");
  inputXMax = document.getElementById("inputXMax");
  inputYMin = document.getElementById("inputYMin");
  inputYMax = document.getElementById("inputYMax");

  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  originXOffset = 100;
  originYOffset = 300;
  xTickLength = 0.5;
  yTickLength = 0.04;
  tickLength = 4;

  // Cantilever
  // 3.35 * 10^-4 m.


  draw_frame();

  get_input_settings();



}

function beam_support_change() {
  if (selectBeamSupport.value == "both_ends") {
    selectLoadLocationOption.value = "middle";
  }

  get_input_settings();
}

function get_input_settings() {
  log("Click!");

  P = - parseFloat(inputForce.value);
  L = parseFloat(inputLength.value);
  E = parseFloat(inputElasticity.value) * 1e9;

  B = parseFloat(inputBeamWidth.value);
  H = parseFloat(inputBeamHeight.value);
  I = B * H * H * H / 12;


  animationReset = true;


  xGridSpacing = parseFloat(inputXGrid.value);
  yGridSpacing = parseFloat(inputYGrid.value);;
  xMin = parseFloat(inputXMin.value) - xGridSpacing / 2;
  xMax = parseFloat(inputXMax.value) + xGridSpacing / 2;
  yMin = parseFloat(inputYMin.value) - yGridSpacing / 2;
  yMax = parseFloat(inputYMax.value) + yGridSpacing / 2;
  xScale = canvasWidth / (xMax - xMin);
  yScale = canvasHeight / (yMax - yMin);


  if (selectLoadLocationOption.value == "end") {
    inputLoadLocation.value = parseFloat(inputLength.value);
    inputLoadLocation.disabled = "disabled";
  } else if (selectLoadLocationOption.value == "middle") {
    inputLoadLocation.value = (parseFloat(inputLength.value) / 2).toFixed(2);
    inputLoadLocation.disabled = "disabled";
  } else if (selectLoadLocationOption.value == "custom") {
    inputLoadLocation.disabled = false;
  }

  A = parseFloat(inputLoadLocation.value);

}

function draw_frame(timestamp) {

  if (animationReset == true) {
    max_deflection = 0;
    log("Reset!!");
    animationStart = timestamp;
    animationReset = false;
  }

  ctx.clearRect(0,0,canvasWidth, canvasHeight);

  print_x_axis();
  print_y_axis();
  print_beam(timestamp);

  window.requestAnimationFrame(draw_frame);

}

function radians(degrees) {
  return Math.PI / 180 * degrees;
}

function print_arrow(x, y, length, angle) {
  print_line_angle(x, y, length, angle);
  // var theta = Math.atan2(y1 - y2, x1 - x2);
  print_line_angle(x, y, 10, angle - radians(45));
  print_line_angle(x, y, 10, angle + radians(45));
}

function print_line_angle(x, y, length, angle) {
  var x2 = length * Math.cos(angle) + x;
  var y2 = length * Math.sin(angle) + y;
  print_line(x, y, x2, y2);
}

function print_beam(timestamp) {

  var duration = 1000;

  var P_interp = interp(0, duration, 0, P, timestamp - animationStart);

  var x_i, y_i;
  var increment = 1 / xScale;
  for (var x = 0; x < L; x+=increment ) {
    //var y = P_interp*x*x / (6*E*I) * (3*L - x);
    var y = get_deflection(P_interp, x);
    print_dot(tx(x),  ty(y));
    x_i = x;
    y_i = y;
    if (Math.abs(y) > max_deflection) {
      max_deflection = Math.abs(y);
    }

  }

  print_arrow(tx(A), ty(get_deflection(P_interp, A)) - 0, 20, radians(270));

  ctx.font = "18px Arial";
  ctx.textAlign = "right";
  ctx.fillText("Max Deflection:  " + max_deflection.toFixed(4) + " m", canvasWidth - 20, 35);

}

function get_deflection(P_interp, x) {

  if (selectBeamSupport.value == "cantilever") { // Cantilever

    if (x < A) {
      return P_interp * x * x / (6 * E * I) * (3 * A - x);
    } else {
      return P_interp * A * A / (6 * E * I) * (3 * x - A);
    }

  } else if (selectBeamSupport.value == "both_ends") {
    var A_B = L - A;
    if (x < A) {
      return P_interp * A_B * x / (6 * L * E * I) * (L*L - x*x - A_B*A_B);
    } else {
      if (L == A) {
        return 0;
      } else {
        return P_interp * A_B / (6 * L * E * I) * ( (L/A_B) * Math.pow(x - A, 3) + (L*L - A_B*A_B)*x - Math.pow(x, 3) );
      }
    }
  }

}

function interp(x_start, x_end, y_start, y_end, x) {
  if (x < x_end) {
    return (y_end - y_start) / (x_end - x_start) * x + y_start;
  } else {
    return y_end;
  }
}

function print_x_axis() {
  print_line(tx(xMin), ty(0), tx(xMax), ty(0));

  for (var x = 0; x > xMin; x -=xGridSpacing) {
    print_x_tick(x);
  }

  for (var x = 0; x < xMax; x += xGridSpacing) {
    print_x_tick(x);
  }

}

function print_y_axis() {
  print_line(tx(0), ty(yMin), tx(0), ty(yMax));

  for (var y = 0; y > yMin; y -= yGridSpacing) {
    print_y_tick(y);

  }
  for (var y = 0; y < yMax; y += yGridSpacing) {
    print_y_tick(y);
  }

}

function print_x_tick(x) {
  if (x != 0) {
    print_line(tx(x), ty(0)-tickLength, tx(x), ty(0)+tickLength);
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(x.toFixed(1), tx(x), ty(0)-15);
  }
}

function print_y_tick(y) {
  if (y != 0) {
    print_line(tx(0) + tickLength, ty(y), tx(0)-tickLength, ty(y));
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(y.toFixed(1), tx(0)-12, ty(y));
    ctx.textBaseline = "alphabetic";
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
  ctx.fillRect(x, y, 1, 1);
}

// Print a line.
function print_line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

}
