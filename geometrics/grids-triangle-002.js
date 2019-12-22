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
    this.width = 480
    this.height = 360
    this.marginX = 68
    this.marginY = 8

    this.countX = 10
    this.countY = 10

    this.shiftX = 0
    this.shiftY = 0
    this.shiftZ = 0
    this.unitInset = -1

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

  _gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
  _gui.closed = false;


  _gui.add(props, 'countX', 1, 32).step(1)
  _gui.add(props, 'countY', 1, 32).step(1)

  _gui.add(props, 'marginX', 0, 200).step(1)
  _gui.add(props, 'marginY', 0, 200).step(1)

  let xc = _gui.add(props, 'shiftX', -3, 3).step(0.01)
  let yc = _gui.add(props, 'shiftY', -3, 3).step(0.01)
  let zc = _gui.add(props, 'shiftZ', -3, 3).step(0.01)
  _shiftControllers.push(xc)
  _shiftControllers.push(yc)
  _shiftControllers.push(zc)

  _gui.add(props, 'unitInset', -10, 10).step(1)

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


function drawOne(x, y, gridWidth, gridHeight, seqX, seqY, totalX, totalY) {
  push()
  translate(x + gridWidth / 2, y + gridHeight / 2)
  if (props.animate) {
    rotate(TWO_PI * t)
    rotate(TWO_PI * seqX * props.shiftX / totalX)
    rotate(TWO_PI * seqY * props.shiftY / totalY)
  }
  if (props.stroke) {
    strokeWeight(2)
    stroke(props.foreground)
    noFill()
  } else {
    fill(props.foreground)
    noStroke()
  }

  beginShape()
  let radius = Math.min(gridWidth / 2, gridHeight / 2) - props.unitInset
  let ax = 0
  let ay = -radius
  let bx = (ax * cos(TWO_PI / 3)) - (ay * sin(TWO_PI / 3))
  let by = (ax * sin(TWO_PI / 3)) + (ay * cos(TWO_PI / 3))
  let cx = (ax * cos(TWO_PI * 2 / 3)) - (ay * sin(TWO_PI * 2 / 3))
  let cy = (ax * sin(TWO_PI * 2 / 3)) + (ay * cos(TWO_PI * 2 / 3))
  vertex(ax, ay)
  vertex(bx, by)
  vertex(cx, cy)
  endShape(CLOSE)
  
  pop()
}

// eslint-disable-next-line no-unused-vars
function draw() {  
  CAPTURER.start()
  startFrame()
  t = map(frameCount - 1, 0, props.numberOfFrames, 0, 1)

  let patternWidth = (props.width - 2 * props.marginX)
  let patternHeight = (props.height - 2 * props.marginY)
  let oneWidth = patternWidth / props.countX
  let oneHeight = patternHeight / props.countY
  for (let x = 0; x < props.countX; x++) {
    for (let y = 0; y < props.countY; y++) {
      drawOne(
        props.marginX + x * oneWidth, 
        props.marginY + y * oneHeight, 
        oneWidth,  
        oneHeight, 
        x, y, props.countX, props.countY)
    }
  }

  if (props.drawGrid) {
    stroke(props.grid)
    strokeWeight(1)
    for (let x = 1; x < props.countX; x++) {
      line(
        x * oneWidth  + props.marginX, 
        props.marginY, 
        x * oneWidth + props.marginX, 
        props.height - props.marginY)
    }
    for (let y = 1; y < props.countY; y++) {
      line(
        props.marginX, 
        y * oneHeight  + props.marginY, 
        props.width - props.marginX, 
        y * oneHeight + props.marginY)
    }    
  }
  endFrame();
}


