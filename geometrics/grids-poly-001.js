import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import _ from 'lodash'
import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyCircle, onePolyConcentricCircle } from '../parts/polys.js'
import Capturer from '../parts/capturer.js'

// The canvas.
let p5canvas = null
let canvas = null
let _capturer = null

// Animation
let props = {}
let _gui = null
let _shiftControllers = []

  // eslint-disable-next-line no-unused-vars
  let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    if (props.animate) {
      props.frameNumber += 1
    }
  
    let patternWidth = (props.width - 2 * props.marginX)
    let patternHeight = (props.height - 2 * props.marginY)

    const contextTransform = (context) => {
      context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1)
      return context
    }

    squareGrid(
      // basic drawing
      s, props,

      // cell information
      props.marginX, 
      props.marginY,
      patternWidth,
      patternHeight,
      props.countX,
      props.countY,

      // drawing methods
      onePolyCircle,
      contextTransform
    )
  
    if (props.drawGrid) {
      squareGridLines(s, context,
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

  // eslint-disable-next-line no-unused-vars
  const drawOne = (s, context, originX, originY, cellWidth, cellHeight, seqX, seqY, percentX, percentY) => {
    s.push()
    s.translate(originX + cellWidth / 2, originY + cellHeight / 2)
    s.rotate(s.TWO_PI * context.t)
    s.rotate(s.TWO_PI * props.shiftX * percentX)
    s.rotate(s.TWO_PI * props.shiftY * percentY)

    if (props.stroke) {
      s.strokeWeight(2)
      s.stroke(props.foreground)
      s.noFill()
    } else {
      s.fill(props.foreground)
      s.noStroke()
    }

    s.beginShape()
    let radius = Math.min(cellWidth / 2, cellHeight / 2) - props.unitInset
    let ax = 0
    let ay = -radius
    let bx = (ax * s.cos(s.TWO_PI / 3)) - (ay * s.sin(s.TWO_PI / 3))
    let by = (ax * s.sin(s.TWO_PI / 3)) + (ay * s.cos(s.TWO_PI / 3))
    let cx = (ax * s.cos(s.TWO_PI * 2 / 3)) - (ay * s.sin(s.TWO_PI * 2 / 3))
    let cy = (ax * s.sin(s.TWO_PI * 2 / 3)) + (ay * s.cos(s.TWO_PI * 2 / 3))
    s.vertex(ax, ay)
    s.vertex(bx, by)
    s.vertex(cx, cy)
    s.endShape(s.CLOSE)
    
    s.pop()
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = () => {
    var Properties = function() {
      this.width = 640
      this.height = 360
      this.marginX = 148
      this.marginY = 8
  
      // this.width = 360
      // this.height = 360
      // this.marginX = 8
      // this.marginY = 8    
  
      this.countX = 10
      this.countY = 10
  
      this.shiftX = 0.1
      this.shiftY = 0.2
      this.shiftZ = 0
      this.unitInset = -1
  
      this.stroke = false
      this.foreground = '#a9a9a9'
      this.background = '#202020'

      this.drawGrid = false
      this.grid = '#990000'

      this.animate = true
      this.frameNumber = 0

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
    _gui.add(props, 'frameNumber', 0, props.numberOfFrames).step(1)
  
    let sampling = _gui.addFolder('Recording')
    sampling.add(props, 'numberOfFrames', 1, 180).step(1);
    sampling.add(props, 'frameRate', 1, 60).step(1);
  
    document.querySelector('#controls').appendChild(_gui.domElement);
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
