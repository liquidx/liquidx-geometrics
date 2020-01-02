import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import Capturer from '../parts/capturer.js'

import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyTriangleSimple } from '../parts/polys.js'

// The canvas.
let p5canvas = null
let canvas = null
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

    // TODO: duplicated here and in transform.
    let t = s.map(_props.frameNumber, 0, _props.numberOfFrames, 0, 1)
    _props.shiftX = 2 + s.sin(s.TWO_PI  * t)
    _props.shiftY = 1 + s.cos(s.TWO_PI * 2 * t)
    _props.shiftZ = 1 + s.sin(s.TWO_PI * 2 * t)
    _shiftControllers.map(o => { o.updateDisplay() })

    const transform = (context, cell, seq) => {
      context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1)
      return context
    }
  
    squareGrid(
      s, _props,
      _props.marginX, 
      _props.marginY,
      patternWidth,
      patternHeight,
      _props.countX,
      _props.countY,
      onePolyTriangleSimple,
      transform
    )
  
    if (_props.drawGrid) {
      squareGridLines(s, {},
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
  const setupProperties = () => {
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
  
      this.triangleType = 'tl-tr-bl'
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
    
    _props = new Properties();
  
    _gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    _gui.closed = false;
  
  
    _gui.add(_props, 'countX', 1, 32).step(1)
    _gui.add(_props, 'countY', 1, 32).step(1)
  
    _gui.add(_props, 'marginX', 0, 200).step(1)
    _gui.add(_props, 'marginY', 0, 200).step(1)
  
    let xc = _gui.add(_props, 'shiftX', -10, 10).step(0.01)
    let yc = _gui.add(_props, 'shiftY', -10, 10).step(0.01)
    let zc = _gui.add(_props, 'shiftZ', -10, 10).step(0.01)
    _shiftControllers.push(xc)
    _shiftControllers.push(yc)
    _shiftControllers.push(zc)
  
    _gui.add(_props, 'triangleType', ['tl-tr-bl', 'tm-br-bl'])
    _gui.add(_props, 'stroke')
    
    _gui.add(_props, 'drawGrid')
    _gui.addColor(_props, 'grid')
  
    _gui.addColor(_props, 'foreground')
    _gui.addColor(_props, 'background')
  
    _gui.add(_props, 'animate')
    _gui.add(_props, 'frameNumber', 0, _props.numberOfFrames).step(1)
  
    let sampling = _gui.addFolder('Recording')
    sampling.add(_props, 'samplesPerFrame', 1, 4).step(1);
    sampling.add(_props, 'numberOfFrames', 1, 180).step(1);
    sampling.add(_props, 'frameRate', 1, 60).step(1);
  
    document.querySelector('#controls').appendChild(_gui.domElement);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  s.setup = () => {
    setupProperties()

    p5canvas = s.createCanvas(_props.width, _props.height);
    p5canvas.parent("container");
    canvas = document.querySelector('#' + p5canvas.id())
    s.frameRate(_props.frameRate);
    
    s.pixelDensity(2);
    s.smooth(8);
    s.fill(32);
    s.rectMode(s.CENTER);
    s.blendMode(s.ADD);
    s.noStroke();


    _capturer = new Capturer(canvas, canvas.width, canvas.height, _props.frameRate, _props.numberOfFrames, 'animation')

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
