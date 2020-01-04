import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import Capturer from '../parts/capturer.js'
import { Properties } from '../parts/props.js'

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

  const setupProperties = (s) => {
    _props = new Properties(s, {
      countX: 2,
      countY: 2,
      animate: false,
      stroke: true,

      spacing: 10,
      radiusMultiplier: 1.0,
      initialStrokes: 1,
      strokesMultiplier: 1
    })

    let gui = _props.registerDat((props, gui) => {
      gui.add(_props, 'spacing', 0, 64).step(1);
      gui.add(_props, 'radiusMultiplier', 0, 4);
      gui.add(_props, 'initialStrokes', 0, 10).step(1)
      gui.add(_props, 'strokesMultiplier', 0, 10).step(1)
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
