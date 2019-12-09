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
    this.count = 10;
    this.widthScale = 0.9

    this.mutateWidth = 1
    this.shiftX = 0
    this.shiftY = 0
    this.corner = 4
    this.foreground = '#a9a9a9'
    this.background = '#202020'

    this.samplesPerFrame = 1;
    this.numberOfFrames = 120;
  };
  
  props = new Properties();

  let gui = new dat.GUI({closed: true, autoPlace: false, width: 360})
  gui.closed = false;

  gui.add(props, 'count', 1, 16).step(1);
  gui.add(props, 'widthScale', 0.5, 1.5).step(0.1);

  gui.add(props, 'mutateWidth', -10, 10).step(0.5);
  gui.add(props, 'shiftX', -10, 10).step(1);
  gui.add(props, 'shiftY', -10, 10).step(1);

  gui.add(props, 'corner', 0, 10).step(0.5);
  gui.addColor(props, 'foreground')
  gui.addColor(props, 'background')

  let sampling = gui.addFolder('Recording')
  sampling.add(props, 'samplesPerFrame', 1, 4).step(1);
  sampling.add(props, 'numberOfFrames', 1, 180).step(1);

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


function drawOne(x, y, gridWidth, squareWidth, corner) {
  push();
  translate(x + gridWidth / 2, y + gridWidth / 2);
  fill(props.foreground);

  square(0, 0, squareWidth, corner);
  pop();
}

function draw() {  
  startFrame()
  t = map(frameCount - 1, 0, props.numberOfFrames, 0, 1)

  let mutateWidth = props.mutateWidth + sin(TWO_PI * t) * 0.5
  let oneWidth = CANVAS.width / props.count
  let oneHeight = CANVAS.height / props.count
  for (let x = 0; x < props.count; x++) {
    for (let y = 0; y < props.count; y++) {
      drawOne(
        x * oneWidth + (x * props.shiftX), 
        y * oneHeight + (y * props.shiftY), 
        oneWidth,  
        (oneWidth - (x * mutateWidth)) * props.widthScale, 
        props.corner)
    }
  }
  endFrame();
}


