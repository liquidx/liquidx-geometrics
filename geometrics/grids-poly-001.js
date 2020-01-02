import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import _ from 'lodash'
import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyCircle, onePolyConcentricCircle } from '../parts/polys.js'
import Capturer from '../parts/capturer.js'

// The canvas.
let _p5canvas = null
let _canvas = null
let _capturer = null

// Animation
let _props = {}
let _gui = null
let _shiftControllers = []

  // eslint-disable-next-line no-unused-vars
  let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    if (_props.animate) {
      _props.frameNumber += 1
    }
  
    let patternWidth = (_props.width - 2 * _props.marginX)
    let patternHeight = (_props.height - 2 * _props.marginY)

    const contextTransform = (context) => {
      context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1)
      return context
    }

    squareGrid(
      // basic drawing
      s, _props,

      // cell information
      _props.marginX, 
      _props.marginY,
      patternWidth,
      patternHeight,
      _props.countX,
      _props.countY,

      // drawing methods
      onePolyCircle,
      contextTransform
    )
  
    if (_props.drawGrid) {
      squareGridLines(s, context,
        _props.marginX, 
        _props.marginY,
        patternWidth,
        patternHeight,
        _props.countX,
        _props.countY,
        _props.grid
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
    s.rotate(s.TWO_PI * _props.shiftX * percentX)
    s.rotate(s.TWO_PI * _props.shiftY * percentY)

    if (_props.stroke) {
      s.strokeWeight(2)
      s.stroke(_props.foreground)
      s.noFill()
    } else {
      s.fill(_props.foreground)
      s.noStroke()
    }

    s.beginShape()
    let radius = Math.min(cellWidth / 2, cellHeight / 2) - _props.unitInset
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
    
    _props = new Properties();
  
    _gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    _gui.closed = false;
  

    _gui.add(_props, 'countX', 1, 32).step(1)
    _gui.add(_props, 'countY', 1, 32).step(1)
  
    _gui.add(_props, 'marginX', 0, 200).step(1)
    _gui.add(_props, 'marginY', 0, 200).step(1)
  
    let xc = _gui.add(_props, 'shiftX', -3, 3).step(0.01)
    let yc = _gui.add(_props, 'shiftY', -3, 3).step(0.01)
    let zc = _gui.add(_props, 'shiftZ', -3, 3).step(0.01)
    _shiftControllers.push(xc)
    _shiftControllers.push(yc)
    _shiftControllers.push(zc)
  
    _gui.add(_props, 'unitInset', -10, 10).step(1)
  
    _gui.add(_props, 'stroke')
    
    _gui.add(_props, 'drawGrid')
    _gui.addColor(_props, 'grid')
  
    _gui.addColor(_props, 'foreground')
    _gui.addColor(_props, 'background')
  
    _gui.add(_props, 'animate')
    _gui.add(_props, 'frameNumber', 0, _props.numberOfFrames).step(1)
  
    let sampling = _gui.addFolder('Recording')
    sampling.add(_props, 'numberOfFrames', 1, 180).step(1);
    sampling.add(_props, 'frameRate', 1, 60).step(1);
  
    document.querySelector('#controls').appendChild(_gui.domElement);
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////

  s.setup = () => {
    setupProperties()

    _p5canvas = s.createCanvas(_props.width, _props.height);
    _p5canvas.parent("container");
    _canvas = document.querySelector('#' + _p5canvas.id())
    s.frameRate(_props.frameRate);
    
    s.pixelDensity(2);
    s.smooth(8);
    s.fill(32);
    s.rectMode(s.CENTER);
    s.blendMode(s.ADD);
    s.noStroke();

    _capturer = new Capturer(_canvas, _canvas.width, _canvas.height, _props.frameRate, _props.numberOfFrames, 'animation')

    document.querySelector('#capture').addEventListener('click', e => {
      _props.frameNumber = 0
      _capturer.enableCapture()
      _capturer.start()
      e.preventDefault()
      return false;
    })
  }

  s.startFrame = () => {
    s.clear();
    s.background(_props.background);
  }

  s.endFrame = () => {
    _capturer.captureFrame()
  }
})