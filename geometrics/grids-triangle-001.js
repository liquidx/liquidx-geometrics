/* eslint-disable no-undef */


// The canvas.
let p5canvas = null
let canvas = null

// Animation
var t = 0;
let props = {}
let _gui = null
let _shiftControllers = []

function _setupProperties() {
  var Properties = function() {
    this.count = 10
    this.widthScale = 1

    this.mutateWidth = 1
    this.shiftX = 0
    this.shiftY = 0
    this.shiftZ = 0
    this.inset = 8
    this.stroke = false
    this.animate = true
    this.drawGrid = false
    this.foreground = '#a9a9a9'
    this.background = '#202020'
    this.grid = '#990000'

    this.samplesPerFrame = 1
    this.numberOfFrames = 120
    this.frameRate = 30
  };
  
  props = new Properties();

  _gui = new dat.GUI({closed: true, autoPlace: false, width: 360})
  _gui.closed = false;

  _gui.add(props, 'count', 1, 16).step(1);
  _gui.add(props, 'widthScale', 0.5, 1.5).step(0.05);

  _gui.add(props, 'mutateWidth', -10, 10).step(0.5);
  let xc = _gui.add(props, 'shiftX', -10, 10).step(1)
  let yc = _gui.add(props, 'shiftY', -10, 10).step(1)
  let zc = _gui.add(props, 'shiftZ', -10, 10).step(1)
  _shiftControllers.push(xc)
  _shiftControllers.push(yc)
  _shiftControllers.push(zc)

  _gui.add(props, 'inset',  0, 10).step(1)
  _gui.add(props, 'stroke')
  
  _gui.add(props, 'drawGrid')
  _gui.addColor(props, 'grid')

  _gui.addColor(props, 'foreground')
  _gui.addColor(props, 'background')

  _gui.add(props, 'animate')

  let sampling = _gui.addFolder('Recording')
  sampling.add(props, 'samplesPerFrame', 1, 4).step(1);
  sampling.add(props, 'numberOfFrames', 1, 180).step(1);
  sampling.add(props, 'frameRate', 1, 60).step(1);

  document.querySelector('#controls').appendChild(_gui.domElement);
}

// setup, start and end frame functions

// eslint-disable-next-line no-unused-vars
function setup() {
  _setupProperties()

  p5canvas = createCanvas(CANVAS.width, CANVAS.height);
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


function drawOne(x, y, gridWidth, gridHeight, seqX, seqY, totalX, totalY) {
  push();
  translate(x, y)
  if (props.stroke) {
    strokeWeight(2)
    stroke(props.foreground)
    noFill()
  } else {
    fill(props.foreground)
    noStroke()
  }
  triangle(
    seqX * props.shiftX, 0, 
    gridWidth, seqY * props.shiftY, 
    seqY * props.shiftZ, gridHeight)
  pop();
}

// eslint-disable-next-line no-unused-vars
function draw() {  
  CAPTURER.start()
  startFrame()
  t = map(frameCount - 1, 0, props.numberOfFrames, 0, 1)

  if (props.animate) {
    props.shiftX = 2 + sin(TWO_PI  * t)
    props.shiftY = 1 + cos(TWO_PI * 2 * t)
    props.shiftZ = 1 + sin(TWO_PI * 2 * t)
    _shiftControllers.map(o => { o.updateDisplay() })
  }

  let patternWidth = (CANVAS.width - 2 * props.inset)
  let patternHeight = (CANVAS.height - 2 * props.inset)
  let oneWidth = patternWidth / props.count
  let oneHeight = patternHeight / props.count
  for (let x = 0; x < props.count; x++) {
    for (let y = 0; y < props.count; y++) {
      drawOne(
        props.inset + x * oneWidth, 
        props.inset + y * oneHeight, 
        oneWidth,  
        oneHeight, 
        x, y, props.count, props.count)
    }
  }

  if (props.drawGrid) {
    stroke(props.grid)
    strokeWeight(1)
    for (let x = 1; x < props.count; x++) {
      line(
        x * oneWidth  + props.inset, 
        props.inset, 
        x * oneWidth + props.inset, 
        patternHeight)
    }
    for (let y = 1; y < props.count; y++) {
      line(
        props.inset, 
        y * oneHeight  + props.inset, 
        patternWidth, 
        y * oneHeight + props.inset)
    }    
  }
  endFrame();
}


