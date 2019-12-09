/* eslint-disable no-undef */

// Inspired by this:
// https://mobile.twitter.com/beesandbombs/status/997074373960925185
// https://gist.github.com/beesandbombs/fabd893bae92cb012268856f71ca70e5

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
    this.sw = 0.2;
    this.N = 6;
    this.radius = 120;
    this.n = 120;
    this.m = 120;
    this.wh = 16;
    
    this.samplesPerFrame = 1;
    this.numberOfFrames = 120;
    this.shutterAngle = 0.6;
  };
  
  props = new Properties();
  var gui = new dat.GUI({autoPlace: false, width: 360})
  gui.closed = false;

  gui.add(props, 'sw', 0, 1.0).step(0.1);
  gui.add(props, 'N', 1, 16).step(1);
  gui.add(props, 'radius', 100, 500).step(1);
  gui.add(props, 'n', 0, 360).step(1);
  gui.add(props, 'm', 100, 500).step(1);
  gui.add(props, 'wh', 2, 16).step(1);
  let sampling = gui.addFolder('Recording')
  sampling.add(props, 'samplesPerFrame', 1, 4).step(1);
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
  fill(32);
  rectMode(CENTER);
  blendMode(MULTIPLY);
  noStroke();
}

function startFrame() {
  clear();
  background(255);
  //noFill();
  
}

function endFrame() {
  CAPTURER.captureFrame();
  t = t + 1;  // increment frame.
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// DRAW

function waveVertex(x_, y_, q) {
  vertex(x_, y_ + props.wh * sin(.02 * x_ + TWO_PI * t + q));
}

function circ(q) {
  for (var i = 0; i < props.N; i++) {
    slice(map(i + 0.5 - props.sw, 0, props.N, -props.radius, props.radius),
    map(i + 0.5 + props.sw, 0, props.N, -props.radius, props.radius),
          q);
  }
}

function slice(y1, y2, q) {
  var qq, x, y;
  var r = props.radius;
  
  beginShape();
  for (var i = 0; i < props.n; i++) {
    qq = i / props.n;
    y = lerp(y1, y2, qq);
    x = -sqrt(r * r - y * y);
    waveVertex(x, y, q);
  }
  
  for (var i = 0; i < props.m; i++) {
    qq = i / props.m;
    y = y2
    x = lerp(-sqrt(r * r - y * y), sqrt(r * r- y * y), qq);
    waveVertex(x, y, q);
  }
  
  for (var i = 0; i < props.n; i++) {
    qq = i/float(props.n-1);
    y = lerp(y2, y1, qq);
    x = sqrt(r * r - y * y);
    waveVertex(x, y, q);
  }
  
  for (var i = 0; i < props.m; i++) {
    qq = i / props.m;
    y = y1;
    x = lerp(sqrt(r * r - y * y), -sqrt(r * r- y * y), qq);
    waveVertex(x, y, q);
  }
    
  endShape();
}

function drawOne(width, height) {
  push();
  translate(width / 2, height / 2);
  fill('#30E0FF');
  circ(0);
  fill('#FD22F3');
  circ(TWO_PI/3);
  fill('#FFE210');
  circ(2*TWO_PI/3);
  pop();
}

function draw() {
  
  startFrame();
  
  for (var s = 0; s < props.samplesPerFrame; s++) {
    t = map(frameCount - 1 + s * props.shutterAngle / props.samplesPerFrame, 0, props.numberOfFrames, 0, 1);
    drawOne(CANVAS.width, CANVAS.height);
  }
  
  //var deg = (t % period) / period * TWO_PI;
  
  endFrame();
}


