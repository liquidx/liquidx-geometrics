import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import _ from 'lodash'
import Capturer from '../parts/capturer.js'
import { Properties } from '../parts/props.js'

import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyCircle, onePolyConcentricCircle } from '../parts/polys.js'

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

    const contextTransform = (context) => {
      context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1)
      return context
    }

    squareGrid(
      // basic drawing
      s, _props,

      // cell information
      _props.marginX, 
      _props.marginY,
      patternWidth,
      patternHeight,
      _props.countX,
      _props.countY,

      // drawing methods
      onePolyCircle,
      contextTransform
    )
  
    if (_props.drawGrid) {
      squareGridLines(s, context,
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

  // eslint-disable-next-line no-unused-vars
  const drawOne = (s, context, originX, originY, cellWidth, cellHeight, seqX, seqY, percentX, percentY) => {
    s.push()
    s.translate(originX + cellWidth / 2, originY + cellHeight / 2)
    s.rotate(s.TWO_PI * context.t)
    s.rotate(s.TWO_PI * context.cellVaryX * percentX)
    s.rotate(s.TWO_PI * context.cellVaryY * percentY)

    if (_props.stroke) {
      s.strokeWeight(2)
      s.stroke(_props.foreground)
      s.noFill()
    } else {
      s.fill(_props.foreground)
      s.noStroke()
    }

    s.beginShape()
    let radius = Math.min(cellWidth / 2, cellHeight / 2) - context.cellInset
    let ax = 0
    let ay = -radius
    let bx = (ax * s.cos(s.TWO_PI / 3)) - (ay * s.sin(s.TWO_PI / 3))
    let by = (ax * s.sin(s.TWO_PI / 3)) + (ay * s.cos(s.TWO_PI / 3))
    let cx = (ax * s.cos(s.TWO_PI * 2 / 3)) - (ay * s.sin(s.TWO_PI * 2 / 3))
    let cy = (ax * s.sin(s.TWO_PI * 2 / 3)) + (ay * s.cos(s.TWO_PI * 2 / 3))
    s.vertex(ax, ay)
    s.vertex(bx, by)
    s.vertex(cx, cy)
    s.endShape(s.CLOSE)
    
    s.pop()
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = () => {
    _props = new Properties()
    let gui = _props.registerDat()
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
