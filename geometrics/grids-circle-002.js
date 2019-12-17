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
    this.count = 2
    this.spacing = 16

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

  _gui = new dat.GUI({closed: true, autoPlace: false, width: 360})
  _gui.closed = false;

  _gui.add(props, 'count', 1, 16).step(1);
  _gui.add(props, 'spacing', 0, 64).step(1);

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
  blendMode(NORMAL);
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

  let circleRadius = (gridWidth - props.spacing) / 2
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

  let patternWidth = (CANVAS.width - 2 * props.inset)
  let patternHeight = (CANVAS.height - 2 * props.inset)
  let oneWidth = (patternWidth / props.count)
  let oneHeight = (patternHeight / props.count)
  for (let x = 0; x < props.count; x++) {
    for (let y = 0; y < props.count; y++) {
      drawOne(
        props.inset + x * (oneWidth), 
        props.inset + y * (oneHeight), 
        oneHeight,  
        oneHeight, 
        y * props.count + x + 1)
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


