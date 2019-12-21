/* eslint-disable no-undef */


// The canvas.
let p5canvas = null
let canvas = null

// Animation
var t = 0;
let props = {}
let _gui = null

function _setupProperties() {
  var Properties = function() {
    this.width = 480
    this.height = 360
    this.marginX = 68
    this.marginY = 8

    this.countX = 2
    this.countY = 2

    this.spacing = 16
    this.radiusMultiplier = 1.0

    this.inset = 8
    this.stroke = true
    this.animate = false
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

  _gui.add(props, 'countX', 1, 16).step(1);
  _gui.add(props, 'countY', 1, 16).step(1);

  _gui.add(props, 'spacing', 0, 64).step(1);
  _gui.add(props, 'radiusMultiplier', 0, 4);

  _gui.add(props, 'marginX',  0, 200).step(1);
  _gui.add(props, 'marginY',  0, 200).step(1);

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


function drawOne(x, y, gridWidth, gridHeight, strokeCount) {
  push();
  translate(x, y)

  let circleRadius = ((Math.min(gridWidth, gridHeight) - props.spacing) / 2) * props.radiusMultiplier
  let ringRadiusIncrement = circleRadius / strokeCount / 2
  let strokeWidth = circleRadius / (strokeCount) / 2

  if (props.stroke) {
    strokeWeight(strokeWidth)
    stroke(props.foreground)
    noFill()
  } else {
    fill(props.foreground)
    noStroke()
  }

  let radiusShift = 0
  if (props.animate) {
    radiusShift = (sin(TWO_PI * t) + 1) * -(ringRadiusIncrement)
  }

  for (let i = 1; i <= strokeCount; i++) {
    // Strokes are outer strokes, to make circles appear the same size, subtract
    // the stroke width from the radius to use.
    circle(gridWidth / 2,  gridWidth / 2, 
      radiusShift + ringRadiusIncrement * (i * 4) - (strokeWidth))
  }
  pop();
}

// eslint-disable-next-line no-unused-vars
function draw() {  
  CAPTURER.start()
  startFrame()
  t = ((frameCount - 1) % props.numberOfFrames) / props.numberOfFrames

  let patternWidth = (props.width - 2 * props.marginX)
  let patternHeight = (props.height - 2 * props.marginY)
  let oneWidth = (patternWidth / props.countX)
  let oneHeight = (patternHeight / props.countY)
  for (let x = 0; x < props.countX; x++) {
    for (let y = 0; y < props.countY; y++) {
      drawOne(
        props.marginX + x * (oneWidth), 
        props.marginY + y * (oneHeight), 
        oneWidth,  
        oneHeight, 
        y * props.countX + x + 1)
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


