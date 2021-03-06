import p5 from 'p5'
import Capturer from '../parts/capturer.js'
import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyTriangleEqualiteral } from '../parts/polys.js'
import { Properties } from '../parts/props.js'

// The canvas.
let _p5canvas = null
let _canvas = null
let _capturer = null

// Animation
let _props = null
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

      onePolyTriangleEqualiteral,
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
  const setupProperties = (s) => {
    _props = new Properties(s, {
      cellVaryX: 0.1,
      cellVaryY: 0.2
    }) 
    let gui = _props.registerDat((props, gui) => {
    })
    document.querySelector('#controls').appendChild(gui.domElement);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  s.setup = () => {
    setupProperties(s)

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
    _capturer.activateLink( document.querySelector('#capture'), () => {
      _props.frameNumber = 0
    })

    _props.activateLink(document.querySelector('#share'), () => {
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
