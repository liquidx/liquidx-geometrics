/* eslint-disable no-undef */
import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'

import { Properties } from '../parts/props.js'
import Capturer from '../parts/capturer.js'

import { squareGrid, squareGridLines } from '../parts/grids.js'


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
      let unitWidth = cell.w - 2 * cellContext.cellInset
      s.quad(
        cellContext.cellInset + unitWidth / 3  + seq.percentX * cellContext.shiftX, cellContext.cellInset,
        cellContext.cellInset + unitWidth * 2 / 3  + seq.percentY * cellContext.shiftX, cellContext.cellInset,
        cellContext.cellInset + unitWidth, cell.h - cellContext.cellInset  - seq.y * cellContext.shiftY,
        0, cell.h - cellContext.cellInset - seq.y * cellContext.shiftY
      )
    }
    s.pop();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = () => {
    _props = new Properties({
      countX: 9,
      countY: 9,

      magX: 5,
      cellInset: 2,
      quad: 'mountain'
    })

    let gui = _props.registerDat((props, gui) => {
      gui.add(_props, 'magX', 0, 10).step(1)
      gui.add(_props, 'quad', ['mountain'])
      gui.add(_props, 'cellInset', 0, 10).step(1)
    })
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
