/* eslint-disable no-undef */

// The canvas.
let p5canvas = null
let canvas = null

// Animation
var t = 0;
let props = {}

function _setupProperties() {
  var Properties = function() {
    this.width = 480
    this.height = 360

    this.count = 10;
    this.widthScale = 0.8

    this.marginX = 68
    this.marginY = 8

    this.mutateWidth = 1
    this.shiftX = 0
    this.shiftY = 0

    this.corner = 4
    this.foreground = '#a9a9a9'
    this.background = '#202020'
    this.animate = true

    this.samplesPerFrame = 1
    this.numberOfFrames = 120
    this.frameRate = 30
  };
  
  props = new Properties();

  let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
  gui.closed = false;

  gui.add(props, 'count', 1, 16).step(1);
  gui.add(props, 'widthScale', 0.5, 1.5).step(0.05);

  gui.add(props, 'mutateWidth', -10, 10).step(0.5);
  gui.add(props, 'shiftX', -10, 10).step(1);
  gui.add(props, 'shiftY', -10, 10).step(1);

  gui.add(props, 'marginX',  0, 200).step(1);
  gui.add(props, 'marginY',  0, 200).step(1);

  gui.add(props, 'corner', 0, 10).step(0.5);
  gui.addColor(props, 'foreground')
  gui.addColor(props, 'background')
  gui.add(props, 'animate')

  let sampling = gui.addFolder('Recording')
  sampling.add(props, 'samplesPerFrame', 1, 4).step(1);
  sampling.add(props, 'numberOfFrames', 1, 180).step(1);
  sampling.add(props, 'frameRate', 1, 60).step(1);

  document.querySelector('#controls').appendChild(gui.domElement);
}

// setup, start and end frame functions

// eslint-disable-next-line no-unused-vars
function setup() {
  _setupProperties()

  p5canvas = createCanvas(props.width, props.height);
  p5canvas.parent("container");
  canvas = document.querySelector('#' + p5canvas.id())
  frameRate(props.frameRate);
  
  pixelDensity(2);
  smooth(8);
  fill(32);
  rectMode(CENTER);
  blendMode(ADD);
  noStroke();

  CAPTURER.init(canvas, canvas.width, canvas.height, props.frameRate, props.numberOfFrames / props.frameRate); 

}

function startFrame() {
  clear();
  background(props.background);
}

function endFrame() {
  CAPTURER.captureFrame(canvas);
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

// eslint-disable-next-line no-unused-vars
function draw() {  
  CAPTURER.start()
  startFrame()
  t = 0
  if (props.animate) {
    t = ((frameCount - 1) % props.numberOfFrames) / props.numberOfFrames
  }

  let mutateWidth = props.mutateWidth + sin(TWO_PI * t) * 0.5
  let patternWidth = (props.width - 2 * props.marginX)
  let patternHeight = (props.height - 2 * props.marginY)
  let oneWidth =  patternWidth / props.count
  let oneHeight = patternHeight / props.count
  for (let x = 0; x < props.count; x++) {
    for (let y = 0; y < props.count; y++) {
      drawOne(
        props.marginX + (Math.abs(x + props.shiftX) % props.count) * oneWidth, 
        props.marginY + (Math.abs(y + props.shiftY) % props.count) * oneHeight, 
        oneWidth,  
        (oneWidth - ((x + y) * mutateWidth)) * props.widthScale, 
        props.corner)
    }
  }
  endFrame();
}


