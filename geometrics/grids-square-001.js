import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'

import { Properties } from '../parts/props.js'
import Capturer from '../parts/capturer.js'

import { squareGrid, squareGridLines } from '../parts/grids.js'
import {onePolySquare } from '../parts/polys.js'

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
      let t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1)
      let timeBasedWidthScale = context.animatedScaleWidth + s.sin(s.TWO_PI * t) * 0.5
      context.cellWidth = (cell.w - ((seq.x + seq.y) * timeBasedWidthScale)) * context.scaleWidth
      return context
    }

    squareGrid(
      s, _props,

      _props.marginX, 
      _props.marginY,
      patternWidth,
      patternHeight,
      _props.count,
      _props.count,

      onePolySquare,
      transform
    )
  
    if (_props.drawGrid) {
      squareGridLines(
        s, _props,
        _props.marginX, 
        _props.marginY,
        patternWidth,
        patternHeight,
        _props.count,
        _props.count,
        _props.grid
      )
    }
    s.endFrame();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = () => {
    _props = new Properties({
      count: 10,
      animatedScaleWidth: 1,
      scaleWidth: 0.8,
      corner: 4
    })

    let gui = _props.registerDat((props, gui) => {
      gui.add(_props, 'count', 1, 32).step(1);
      gui.add(_props, 'scaleWidth', 0.5, 1.5).step(0.05);    
      gui.add(_props, 'animatedScaleWidth', -10, 10).step(0.5);
      gui.add(_props, 'corner', 0, 10).step(0.5);

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
