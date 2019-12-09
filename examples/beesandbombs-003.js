// Inspired by this:
// https://mobile.twitter.com/beesandbombs/status/991649953327058944
// https://gist.github.com/beesandbombs/991534bb07e1cad66a438a66bb8711e8

// The canvas.
var canvas = null;

// Animation
var t = 0;
var a = 0;
var max_t = 1800;
var targetFrameRate = 30;
var loopDuration = 3;
var period = targetFrameRate * loopDuration;
let props = {}

function _setupProperties() {
  var Properties = function() {
    this.numberOfFrames = 120;
    this.shutterAngle = 0.7;
  
    this.N = 18;
    this.pad = 20;
    this.maxDist = 120;
    this.minDiameter = 4;
    this.maxDiameter = 7;
    this.maxOffset = 10;
    this.wavelength = 44;
    this.mn = 0.5 * Math.sqrt(3);
    this.amp = 1;
  };
  props = new Properties();
  let gui = new dat.GUI({autoPlace: false, width: 360})
  gui.closed = false;
   
  gui.add(props, 'N', 0, 50).step(1);
  gui.add(props, 'pad', 1, 50).step(1);
  gui.add(props, 'maxDist', 1, 500).step(1);
  gui.add(props, 'minDiameter', 1, 8).step(1);
  gui.add(props, 'maxDiameter', 1, 16).step(1);
  gui.add(props, 'maxOffset', 0, 50).step(1);
  gui.add(props, 'wavelength', 1, 50).step(1);
  gui.add(props, 'mn', 0, 3);
  gui.add(props, 'amp', 0, 1);

  let sampling = gui.addFolder('Recording')
  sampling.add(props, 'numberOfFrames', 1, 180).step(1);
  sampling.add(props, 'shutterAngle', 0.1, 1.0).step(0.1);

  document.querySelector('#controls').appendChild(gui.domElement);
}

// setup, start and end frame functions

function setup() {
  canvas = createCanvas(CANVAS.width, CANVAS.height);
  canvas.parent("container");
  frameRate(targetFrameRate);
  CAPTURER.init(canvas, targetFrameRate, loopDuration); 

  _setupProperties()

  //pixelDensity(2);
  smooth(8);
  rectMode(CENTER);
  stroke(250);
}

function startFrame() {
  clear();
  background(32);  
  strokeWeight(1);
  strokeCap(SQUARE);
}

function endFrame() {
  CAPTURER.captureFrame();
  t = t + 1;  // increment frame.
}

// visual effects

function rgb_fringe(drawFn) {
  blendMode(SCREEN);
  // red
  push();
  scale(1.003, 1.006);
  stroke(color(250, 0, 0, 200));
  drawFn();
  pop();
  
  // green
  push();
  scale(1.006, 1.003);
  stroke(color(0, 250, 0, 200));
  drawFn();
  pop();
  
  // blue
  push();
  scale(1.012, 1.006);
  stroke(color(0, 0, 250, 200));
  drawFn();
  pop();  
  
  // white
  //blendMode(BLEND);
  stroke(color(250, 250, 250, 255));
  drawFn();
}

function rgb_fringe2(drawFn, width, height) {
  // red
  push();
  scale(1.003, 1.006);
  background(0, 0, 0);
  stroke(color(250, 0, 0, 200));
  drawFn();
  pop();
  var f1 = get();
  
  // green
  push();
  scale(1.006, 1.003);
  background(0, 0, 0);
  stroke(color(0, 250, 0, 200));
  drawFn();
  pop();
  var f2 = get();
  
  // blue
  push();
  scale(1.012, 1.006);
  background(0, 0, 0);
  stroke(color(0, 0, 250, 200));
  drawFn();
  pop();  
  var f3 = get();
  
  var sx = 0, sy = 0, dx = -width / 2, dy = -width / 2, w = width, h = height;
  background(0, 0, 0);
  blend(f1, sx, sy, w, h, dx, dy, w, h, ADD);
  blend(f2, sx, sy, w, h, dx, dy, w, h, ADD);
  blend(f3, sx, sy, w, h, dx, dy, w, h, ADD);
}

// tickers

function _percentage(offset) {
  if (typeof offset == 'undefined') {
    offset = 0;
  }
  return ((t + offset) % period) / period;
}

function _deg(offset) {
  return _percentage(offset) * TWO_PI;
}

function _up_down(offset) {
  var p = _percentage(offset);
  if (p < 0.5) {
    return p * 2;
  } else {
    return (1 - p) * 2;
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////
// DRAW

function constrain0to1(v) { return constrain(v, 0, 1); }
function ease(v) { return 3*v*v - 2*v*v*v; }
function easeSin(v) { return lerp(sin(v), lerp(1, -1, ease(map(sin(v), 1, -1, 0, 1))), 0.25); }

function dots() {
  for (var i = -props.N; i <= props.N; i++) {
    for (var j = -props.N; j <= props.N; j++) {
      var x = i * props.pad;
      var y = j * props.mn * props.pad;
      
      if (j % 2) {
        x += 0.5 * props.pad;
      }
      
      var dist = max(abs(y), 
                  max(abs(0.5 * y + props.mn * x), abs(0.5 * y - props.mn * x)))
      
      if (dist < props.maxDist) {
        var amp = constrain0to1(map(dist, 0, props.maxDist - props.pad, 1, 0));
        amp = 1 - sq(1 - amp);
        
        var offset = props.maxOffset * easeSin(TWO_PI * t - dist/props.wavelength) * amp;
        x += offset;

        ellipse(x, y, 3, 3);

        var diameter = lerp(props.minDiameter, props.maxDiameter, amp);
        ellipse(x, y, diameter, diameter);
      }
    }
  }
}

function drawOne(width, height) {
  push();
  {
    translate(width / 2, height / 2);
    scale(1.2);
    fill(255, 255, 255);
    dots();
    //drawLine();
    //rgb_fringe(drawLine, width, height);
    //rgb_fringe2(drawLine, width, height);
  }
  pop();

}

function draw() {
  startFrame();
  t = map(frameCount - 1 + props.shutterAngle, 0, props.numberOfFrames, 0, 1);
  drawOne(CANVAS.width, CANVAS.height);
  endFrame();
}


