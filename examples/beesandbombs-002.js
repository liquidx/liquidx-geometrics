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

    this.size = 200;
    this.vcount = 24;
    this.pad = 20;
    this.amp = 24;
    this.hcount = 9;
    this.stroke = 2;
  };

  props = new Properties();
  var gui = new dat.GUI({autoPlace: false, width: 360});
  gui.closed = false;

  gui.add(props, 'size', 0, 720).step(10);
  gui.add(props, 'vcount', 1, 48).step(1);
  gui.add(props, 'amp', 1, 100).step(1);
  gui.add(props, 'pad', 1, 50).step(1);
  gui.add(props, 'stroke', 1, 5).step(1);
  gui.add(props, 'hcount', 1, 50).step(1);

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
  strokeWeight(props.stroke);
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

//////////////////////////////////////////////////////////////////////////////////////////////////
// DRAW

function strip(q) {
  for (var i = 0; i < props.vcount; i++) {
    qq = i / (props.vcount - 1);
    h = sin(PI * qq) * props.amp;
    y = map(i, 0, props.vcount - 1, -props.size / 2, props.size / 2) + h * sin(TWO_PI * q - TWO_PI * qq);
    line(-props.pad / 2, y, props.pad / 2, y);
  }
}

function drawLine() {
  for (var i = 0; i < props.hcount; i++) {
    push();    
    translate(map(i, 
                  0, props.hcount - 1, 
                  -props.size / 2 + props.pad / 2 - 1,
                  props.size / 2 - props.pad / 2 + 1), 0);

    strip(t - i / props.hcount);
    pop();
  }
}

function drawOne(width, height) {
  push();
  {
    translate(width / 2, height / 2);
    scale(1.2);
    //drawLine();
    //rgb_fringe(drawLine, width, height);
    rgb_fringe2(drawLine, width, height);
  }
  pop();

}

function draw() {
  startFrame();
  t = map(frameCount - 1 + props.shutterAngle, 0, props.numberOfFrames, 0, 1);
  drawOne(CANVAS.width, CANVAS.height);
  endFrame();
}


