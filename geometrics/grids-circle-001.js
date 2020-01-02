import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyCircle } from '../parts/polys.js'

import Capturer from '../parts/capturer.js'

// The canvas.
let p5canvas = null
let canvas = null
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
      context.cellWidthTransform = seq.x * context.mutateX
      context.cellHeightTransform = seq.y * context.mutateY
      return context
    }

    squareGrid(s, _props,
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
        s,
        {},
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
  
      this.countX = 8;
      this.countY = 8;
      this.scaleWidth = 0.8;
      this.scaleHeight = 0.8;
      this.mutateX = -3
      this.mutateY = -3
      this.foreground = '#ffffff'
      this.background = '#202020'
  
      this.animate = true
      this.frameNumber = 0

      this.numberOfFrames = 120;
    };
    
    _props = new Properties();
  
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false;
  
    gui.add(_props, 'marginX',  0, 200).step(1);
    gui.add(_props, 'marginY',  0, 200).step(1);
  
    gui.add(_props, 'countX', 1, 16).step(1);
    gui.add(_props, 'countY', 1, 16).step(1);
  
    gui.add(_props, 'scaleWidth', 0.5, 1.5).step(0.1);
    gui.add(_props, 'scaleHeight', 0.5, 1.5).step(0.1);
    gui.add(_props, 'mutateX', -10, 10).step(0.5);
    gui.add(_props, 'mutateY', -10, 10).step(0.5);

    gui.add(_props, 'animate')
    gui.add(_props, 'frameNumber', 0, _props.numberOfFrames).step(1)

    let sampling = gui.addFolder('Recording')
    sampling.add(_props, 'numberOfFrames', 1, 180).step(1);
  
    document.querySelector('#controls').appendChild(gui.domElement);
  }
  


  //////////////////////////////////////////////////////////////////////////////////////////////////

  s.setup = () => {
    setupProperties()

    p5canvas = s.createCanvas(_props.width, _props.height);
    p5canvas.parent("container");
    canvas = document.querySelector('#' + p5canvas.id())
    s.frameRate(_props.frameRate);
    
    s.pixelDensity(2);
    s.smooth(8);
    s.fill(32);
    s.rectMode(s.CENTER);
    s.blendMode(s.ADD);
    s.noStroke();

    _capturer = new Capturer(canvas, canvas.width, canvas.height, _props.frameRate, _props.numberOfFrames, 'animation')

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



