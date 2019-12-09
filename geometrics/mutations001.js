/* eslint-disable no-undef */

// The canvas.
var canvas = null;

// Animation
var t = 0;
var targetFrameRate = 30;
var loopDuration = 3;
let props = {}

function _setupProperties() {
  var Properties = function() {
    this.count = 8;
    this.widthScale = 0.95;
    this.heightScale = 0.95;
    this.mutateX = 4
    this.mutateY = 5
    this.foreground = '#ffffff'
    this.background = '#202020'

    this.samplesPerFrame = 1;
    this.numberOfFrames = 120;
    this.shutterAngle = 0.6;
  };
  
  props = new Properties();

  var gui = new dat.GUI({closed: true, autoPlace: false, width: 320});
  gui.add(props, 'count', 1, 16).step(1);
  gui.add(props, 'widthScale', 0.5, 1.5).step(0.1);
  gui.add(props, 'heightScale', 0.5, 1.5).step(0.1);
  gui.add(props, 'mutateX', -10, 10).step(0.5);
  gui.add(props, 'mutateY', -10, 10).step(0.5);
  let sampling = gui.addFolder('Recording')
  sampling.add(props, 'samplesPerFrame', 1, 4).step(1);
  sampling.add(props, 'numberOfFrames', 1, 180).step(1);
  sampling.add(props, 'shutterAngle', 0.1, 1.0).step(0.1);
  gui.closed = false;
  document.querySelector('#controls').appendChild(gui.domElement);
}

// setup, start and end frame functions

function setup() {
  canvas = createCanvas(CANVAS.width, CANVAS.height);
  canvas.parent("container");
  frameRate(targetFrameRate);
  CAPTURER.init(canvas, targetFrameRate, loopDuration); 

  _setupProperties()
  
  pixelDensity(2);
  smooth(8);
  fill(32);
  rectMode(CENTER);
  blendMode(ADD);
  noStroke();
}

function startFrame() {
  clear();
  background(props.background);
}

function endFrame() {
  CAPTURER.captureFrame();
  t = t + 1;  // increment frame.
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// DRAW


function drawOne(x, y, width, height) {
  push();
  translate(x + width / 2, y + height / 2);
  fill(props.foreground);
  ellipse(0, 0, width * props.widthScale, height * props.heightScale);
  pop();
}

function draw() {
  
  startFrame();
  let oneWidth = CANVAS.width / props.count
  let oneHeight = CANVAS.height / props.count
  for (let x = 0; x < props.count; x++) {
    for (let y = 0; y < props.count; y++) {
      drawOne(x * oneWidth, y * oneHeight, oneWidth - (x * props.mutateX), oneHeight - (y * props.mutateY))
    }
  }
  endFrame();
}


