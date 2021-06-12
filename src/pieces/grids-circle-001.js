import p5 from 'p5'
import Capturer from '../parts/capturer.js'
import { Properties } from '../parts/props.js'

import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyCircle } from '../parts/polys.js'


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

    if (_props.animate) {
      _props.frameNumber += 1
    }
  
    let patternWidth = (_props.width - 2 * _props.marginX)
    let patternHeight = (_props.height - 2 * _props.marginY)

    const transform = (context, cell, seq) => {
      context.cellWidthTransform = seq.x * context.cellVaryX
      context.cellHeightTransform = seq.y * context.cellVaryY
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

      onePolyCircle,
      transform
    )
  
    if (_props.drawGrid) {
      squareGridLines(
        s, _props,
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
      cellVaryX: -3,
      cellVaryY: -3,

      scaleWidth: 0.8,
      scaleHeight: 0.8,
    })
    let gui = _props.registerDat((props, gui) => {
      gui.add(props, 'scaleWidth', 0.5, 1.5).step(0.1);
      gui.add(props, 'scaleHeight', 0.5, 1.5).step(0.1);
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



