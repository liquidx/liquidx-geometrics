import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import Capturer from '../parts/capturer.js'

import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyConcentricCircle } from '../parts/polys.js'

// The canvas.
let _p5canvas = null
let _canvas = null
let _capturer = null

// Animation
let _props = {}

// eslint-disable-next-line no-unused-vars
let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    _props.frameNumber += 1
  
    let patternWidth = (_props.width - 2 * _props.marginX)
    let patternHeight = (_props.height - 2 * _props.marginY)

    const transform = (context, cell, seq) => {
      context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1)
      context.strokeCount = (seq.y * context.countX + seq.x) * context.strokesMultiplier + 1 + context.initialStrokes
      context.circleRadius = ((Math.min(cell.w, cell.h) - context.spacing) / 2) * context.radiusMultiplier
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

      onePolyConcentricCircle,
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
    
    _props = new Properties();
  
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false
    gui.remember(_props)
  
    gui.add(_props, 'countX', 1, 16).step(1);
    gui.add(_props, 'countY', 1, 16).step(1);
  
    gui.add(_props, 'spacing', 0, 64).step(1);
    gui.add(_props, 'radiusMultiplier', 0, 4);
    gui.add(_props, 'initialStrokes', 0, 10).step(1)
    gui.add(_props, 'strokesMultiplier', 0, 10).step(1)
  
    gui.add(_props, 'marginX',  0, 200).step(1);
    gui.add(_props, 'marginY',  0, 200).step(1);
  
    gui.add(_props, 'stroke')
    
    gui.add(_props, 'drawGrid')
    gui.addColor(_props, 'grid')
  
    gui.addColor(_props, 'foreground')
    gui.addColor(_props, 'background')
  
    gui.add(_props, 'animate')
    gui.add(_props, 'frameNumber', 0, _props.numberOfFrames).step(1)
  
    let sampling = gui.addFolder('Recording')
    sampling.add(_props, 'numberOfFrames', 1, 180).step(1);
    sampling.add(_props, 'frameRate', 1, 60).step(1);
  
    document.querySelector('#controls').appendChild(gui.domElement);
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
