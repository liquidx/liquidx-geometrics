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

    this.countX = 9
    this.countY = 9

    this.magX = 5

    this.shiftX = 0
    this.shiftY = 0
    this.shiftZ = 0
    this.unitInset = 2

    this.quad = 'mountain'
    this.stroke = false
    this.animate = true
    this.drawGrid = false
    this.foreground = '#a9a9a9'
    this.background = '#202020'
    this.grid = '#990000'

    this.samplesPerFrame = 1
    this.numberOfFrames = 120
    this.frameRate = 30
    this.frameNumber = 0
  };
  
  props = new Properties();

  _gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
  _gui.closed = false;


  _gui.add(props, 'countX', 1, 32).step(1)
  _gui.add(props, 'countY', 1, 32).step(1)

  _gui.add(props, 'marginX', 0, 200).step(1)
  _gui.add(props, 'marginY', 0, 200).step(1)

  _gui.add(props, 'magX', 0, 10).step(1)

  let xc = _gui.add(props, 'shiftX', -10, 10).step(1)
  let yc = _gui.add(props, 'shiftY', -10, 10).step(1)
  let zc = _gui.add(props, 'shiftZ', -10, 10).step(1)
  _shiftControllers.push(xc)
  _shiftControllers.push(yc)
  _shiftControllers.push(zc)

  _gui.add(props, 'unitInset', 0, 10).step(1)

  _gui.add(props, 'quad', ['mountain'])
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
   if (props.quad == 'mountain') {
    let unitWidth = gridWidth - 2 * props.unitInset
    let unitHeight = gridHeight - 2 * props.unitInset
    quad(
      props.unitInset + unitWidth / 3  + (seqX - totalX/2) * props.shiftX, props.unitInset,
      props.unitInset + unitWidth * 2 / 3  + (seqX - totalX/2) * props.shiftX, props.unitInset,
      props.unitInset + unitWidth, gridHeight - props.unitInset  - seqY * props.shiftY,
      0, gridHeight - props.unitInset - seqY * props.shiftY
    )
  }
  pop();
}

// eslint-disable-next-line no-unused-vars
function draw() {  
  CAPTURER.start()
  startFrame()
  props.frameNumber += 1
  t = map(props.frameNumber - 1, 0, props.numberOfFrames, 0, 1)

  if (props.animate) {
    props.shiftX =  props.magX * sin(TWO_PI  * t)
    //props.shiftY = 1 + cos(TWO_PI * 2 * t)
    //props.shiftZ = 1 + sin(TWO_PI * 2 * t)
    _shiftControllers.map(o => { o.updateDisplay() })
  }

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



//////////////////////////////////////////////////////////////////////////////////////////////////

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

  CAPTURER.init(canvas, canvas.width, canvas.height, props.frameRate, props.numberOfFrames, 'grids-quad-001'); 

}

function startFrame() {
  clear();
  background(props.background);
}

function endFrame() {
  CAPTURER.captureFrame(canvas);
}
