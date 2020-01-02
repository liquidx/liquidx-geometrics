/* eslint-disable no-undef */
import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'

import { Properties } from '../parts/props.js'
import Capturer from '../parts/capturer.js'

import { onePolyParallelogram } from '../parts/polys.js'
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
  
    let patternWidth = (_props.width - 2 * _props.marginX)
    let patternHeight = (_props.height - 2 * _props.marginY)

    const transform = (context, cell, seq) => {
      context.t = s.map(_props.frameNumber, 0, _props.numberOfFrames, 0, 1)
      let timeShiftX = s.sin(s.TWO_PI * context.t)
      let timeShiftY = s.sin(s.TWO_PI * context.t)
      context.shiftX = context.cellVaryMag * seq.percentX * context.cellVaryX * timeShiftX
      context.shiftY = context.cellVaryMag * seq.percentY * context.cellVaryY * timeShiftY

      context.widthMultiplier = 2 + s.cos(s.TWO_PI * context.t)
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

      onePolyParallelogram,
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
    _props = new Properties({
      countX: 12,
      countY: 12,
      cellVaryX: 1,
      cellVaryY: 3,

      cellVaryMag: 2,
      cellInset: 2,
    })

    let gui = _props.registerDat((props, gui) => {
      gui.add(_props, 'cellVaryMag', 0, 10).step(1)
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
    
    s.pixelDensity(_props.pixelDensity);
    s.smooth(8);
    s.fill(_props.background);
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
