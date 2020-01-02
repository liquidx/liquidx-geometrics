import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import { squareGrid, squareGridLines } from '../parts/grids.js'
import Capturer from '../parts/capturer.js'

// The canvas.
let p5canvas = null
let canvas = null
let _capturer = null

// Animation
var t = 0;
let props = {}

let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    props.frameNumber += 1
    t = s.map(props.frameNumber, 0, props.numberOfFrames, 0, 1)
  
    let patternWidth = (props.width - 2 * props.marginX)
    let patternHeight = (props.height - 2 * props.marginY)

    squareGrid(s, {},
      props.marginX, 
      props.marginY,
      patternWidth,
      patternHeight,
      props.countX,
      props.countY,
      drawOne
    )
  
    if (props.drawGrid) {
      squareGridLines(s, {},
        props.marginX, 
        props.marginY,
        patternWidth,
        patternHeight,
        props.countX,
        props.countY,
        props.grid
      )
    }
    s.endFrame();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const drawOne = (s, options, originX, originY, cellWidth, cellHeight, seqX, seqY, percentX, percentY) => {
    s.push()
    s.translate(originX, originY)
  
    let strokeCount =  (seqY * props.countX + seqX) * props.strokesMultiplier + 1 + props.initialStrokes
    let circleRadius = ((Math.min(cellWidth, cellHeight) - props.spacing) / 2) * props.radiusMultiplier
    let ringRadiusIncrement = circleRadius / strokeCount / 2
    let strokeWidth = circleRadius / (strokeCount) / 2
  
    if (props.stroke) {
      s.strokeWeight(strokeWidth)
      s.stroke(props.foreground)
      s.noFill()
    } else {
      s.fill(props.foreground)
      s.noStroke()
    }
  
    let radiusShift = 0
    if (props.animate) {
      radiusShift = (s.sin(s.TWO_PI * t) + 1) * -(ringRadiusIncrement)
    }
  
    for (let i = 1; i <= strokeCount; i++) {
      // Strokes are outer strokes, to make circles appear the same size, subtract
      // the stroke width from the radius to use.
      s.circle(cellWidth / 2,  cellWidth / 2, 
        radiusShift + ringRadiusIncrement * (i * 4) - (strokeWidth))
    }
    s.pop();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = () => {
    var Properties = function() {
      this.width = 480
      this.height = 360
      this.marginX = 68
      this.marginY = 8
  
      this.countX = 2
      this.countY = 2
  
      this.spacing = 16
      this.radiusMultiplier = 1.0
      this.initialStrokes = 0
      this.strokesMultiplier = 1
  
      this.inset = 8
      this.stroke = true
      this.drawGrid = false
      this.foreground = '#a9a9a9'
      this.background = '#202020'
      this.grid = '#990000'
  
      this.animate = false
      this.frameNumber = 0

      this.numberOfFrames = 120
      this.frameRate = 30
    };
    
    props = new Properties();
  
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false
    gui.remember(props)
  
    gui.add(props, 'countX', 1, 16).step(1);
    gui.add(props, 'countY', 1, 16).step(1);
  
    gui.add(props, 'spacing', 0, 64).step(1);
    gui.add(props, 'radiusMultiplier', 0, 4);
    gui.add(props, 'initialStrokes', 0, 10).step(1)
    gui.add(props, 'strokesMultiplier', 0, 10).step(1)
  
    gui.add(props, 'marginX',  0, 200).step(1);
    gui.add(props, 'marginY',  0, 200).step(1);
  
    gui.add(props, 'stroke')
    
    gui.add(props, 'drawGrid')
    gui.addColor(props, 'grid')
  
    gui.addColor(props, 'foreground')
    gui.addColor(props, 'background')
  
    gui.add(props, 'animate')
    gui.add(props, 'frameNumber', 0, props.numberOfFrames).step(1)
  
    let sampling = gui.addFolder('Recording')
    sampling.add(props, 'numberOfFrames', 1, 180).step(1);
    sampling.add(props, 'frameRate', 1, 60).step(1);
  
    document.querySelector('#controls').appendChild(gui.domElement);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  s.setup = () => {
    setupProperties()

    p5canvas = s.createCanvas(props.width, props.height);
    p5canvas.parent("container");
    canvas = document.querySelector('#' + p5canvas.id())
    s.frameRate(props.frameRate);
    
    s.pixelDensity(2);
    s.smooth(8);
    s.fill(32);
    s.rectMode(s.CENTER);
    s.blendMode(s.ADD);
    s.noStroke();

    _capturer = new Capturer(canvas, canvas.width, canvas.height, props.frameRate, props.numberOfFrames, 'animation')

    document.querySelector('#capture').addEventListener('click', e => {
      props.frameNumber = 0
      _capturer.enableCapture()
      _capturer.start()
      e.preventDefault()
      return false;
    })
  }

  s.startFrame = () => {
    s.clear();
    s.background(props.background);
  }

  s.endFrame = () => {
    _capturer.captureFrame()
  }
})
