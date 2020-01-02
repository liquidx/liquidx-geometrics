/* eslint-disable no-undef */
import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import { squareGrid, squareGridLines } from '../parts/grids.js'
import Capturer from '../parts/capturer.js'


// The canvas.
let _p5canvas = null
let _canvas = null
let _capturer = null

// Animation
let _props = {}
let _shiftControllers = []

// eslint-disable-next-line no-unused-vars
let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    if (_props.animate) {
      _props.frameNumber += 1
    }
    let t = s.map(_props.frameNumber, 0, _props.numberOfFrames, 0, 1)
  
    let patternWidth = (_props.width - 2 * _props.marginX)
    let patternHeight = (_props.height - 2 * _props.marginY)
  
    if (_props.animate) {
      _props.shiftX =  _props.magX * s.sin(s.TWO_PI  * t)
      //props.shiftY = 1 + cos(TWO_PI * 2 * t)
      //props.shiftZ = 1 + sin(TWO_PI * 2 * t)
      _shiftControllers.map(o => { o.updateDisplay() })
    }

    squareGrid(
      s, _props,
      _props.marginX, 
      _props.marginY,
      patternWidth,
      patternHeight,
      _props.countX,
      _props.countY,
      drawOne
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
  const drawOne = (s, cellContext, cell, seq) => {
    s.push();
    s.translate(cell.x, cell.y)
    if (cellContext.stroke) {
      s.strokeWeight(2)
      s.stroke(cellContext.foreground)
      s.noFill()
    } else {
      s.fill(cellContext.foreground)
      s.noStroke()
    }
     if (cellContext.quad == 'mountain') {
      let unitWidth = cell.w - 2 * cellContext.unitInset
      s.quad(
        cellContext.unitInset + unitWidth / 3  + seq.percentX * cellContext.shiftX, cellContext.unitInset,
        cellContext.unitInset + unitWidth * 2 / 3  + seq.percentY * cellContext.shiftX, cellContext.unitInset,
        cellContext.unitInset + unitWidth, cell.h - cellContext.unitInset  - seq.y * cellContext.shiftY,
        0, cell.h - cellContext.unitInset - seq.y * cellContext.shiftY
      )
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
  
      this.countX = 9
      this.countY = 9
  
      this.magX = 5
  
      this.shiftX = 0
      this.shiftY = 0
      this.shiftZ = 0
      this.unitInset = 2
  
      this.quad = 'mountain'
      this.stroke = false
      this.drawGrid = false
      this.foreground = '#a9a9a9'
      this.background = '#202020'
      this.grid = '#990000'
  
      this.animate = true
      this.frameNumber = 0

      this.numberOfFrames = 120
      this.frameRate = 30
    };
    
    _props = new Properties();
  
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false;
  
  
    gui.add(_props, 'countX', 1, 32).step(1)
    gui.add(_props, 'countY', 1, 32).step(1)
  
    gui.add(_props, 'marginX', 0, 200).step(1)
    gui.add(_props, 'marginY', 0, 200).step(1)
  
    gui.add(_props, 'magX', 0, 10).step(1)
  
    let xc = gui.add(_props, 'shiftX', -10, 10).step(1)
    let yc = gui.add(_props, 'shiftY', -10, 10).step(1)
    let zc = gui.add(_props, 'shiftZ', -10, 10).step(1)
    _shiftControllers.push(xc)
    _shiftControllers.push(yc)
    _shiftControllers.push(zc)
  
    gui.add(_props, 'unitInset', 0, 10).step(1)
  
    gui.add(_props, 'quad', ['mountain'])
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
