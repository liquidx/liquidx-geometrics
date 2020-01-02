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

    // TODO: duplicated here and in transform.
    let t = s.map(props.frameNumber, 0, props.numberOfFrames, 0, 1)
    props.shiftX = 2 + s.sin(s.TWO_PI  * t)
    props.shiftY = 1 + s.cos(s.TWO_PI * 2 * t)
    props.shiftZ = 1 + s.sin(s.TWO_PI * 2 * t)
    _shiftControllers.map(o => { o.updateDisplay() })

    const transform = (context, cell, seq) => {
      context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1)
      return context
    }
  
    squareGrid(
      s, props,
      props.marginX, 
      props.marginY,
      patternWidth,
      patternHeight,
      props.countX,
      props.countY,
      onePolyTriangleSimple,
      transform
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
    
    props = new Properties();
  
    _gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    _gui.closed = false;
  
  
    _gui.add(props, 'countX', 1, 32).step(1)
    _gui.add(props, 'countY', 1, 32).step(1)
  
    _gui.add(props, 'marginX', 0, 200).step(1)
    _gui.add(props, 'marginY', 0, 200).step(1)
  
    let xc = _gui.add(props, 'shiftX', -10, 10).step(0.01)
    let yc = _gui.add(props, 'shiftY', -10, 10).step(0.01)
    let zc = _gui.add(props, 'shiftZ', -10, 10).step(0.01)
    _shiftControllers.push(xc)
    _shiftControllers.push(yc)
    _shiftControllers.push(zc)
  
    _gui.add(props, 'triangleType', ['tl-tr-bl', 'tm-br-bl'])
    _gui.add(props, 'stroke')
    
    _gui.add(props, 'drawGrid')
    _gui.addColor(props, 'grid')
  
    _gui.addColor(props, 'foreground')
    _gui.addColor(props, 'background')
  
    _gui.add(props, 'animate')
    _gui.add(props, 'frameNumber', 0, props.numberOfFrames).step(1)
  
    let sampling = _gui.addFolder('Recording')
    sampling.add(props, 'samplesPerFrame', 1, 4).step(1);
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
