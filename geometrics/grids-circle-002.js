import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import Capturer from '../parts/capturer.js'

import { squareGrid, squareGridLines } from '../parts/grids.js'
import { onePolyConcentricCircle } from '../parts/polys.js'

// The canvas.
let p5canvas = null
let canvas = null
let _capturer = null

// Animation
let props = {}

// eslint-disable-next-line no-unused-vars
let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    props.frameNumber += 1
  
    let patternWidth = (props.width - 2 * props.marginX)
    let patternHeight = (props.height - 2 * props.marginY)

    const transform = (context, cell, seq) => {
      context.t = s.map(context.frameNumber, 0, context.numberOfFrames, 0, 1)
      context.strokeCount = (seq.y * context.countX + seq.x) * context.strokesMultiplier + 1 + context.initialStrokes
      context.circleRadius = ((Math.min(cell.w, cell.h) - context.spacing) / 2) * context.radiusMultiplier
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

      onePolyConcentricCircle,
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
  
      this.countX = 2
      this.countY = 2
  
      this.spacing = 16
      this.radiusMultiplier = 1.0
      this.initialStrokes = 0
      this.strokesMultiplier = 1
  
      this.inset = 8
      this.stroke = true
      this.drawGrid = false
      this.foreground = '#a9a9a9'
      this.background = '#202020'
      this.grid = '#990000'
  
      this.animate = false
      this.frameNumber = 0

      this.numberOfFrames = 120
      this.frameRate = 30
    };
    
    props = new Properties();
  
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false
    gui.remember(props)
  
    gui.add(props, 'countX', 1, 16).step(1);
    gui.add(props, 'countY', 1, 16).step(1);
  
    gui.add(props, 'spacing', 0, 64).step(1);
    gui.add(props, 'radiusMultiplier', 0, 4);
    gui.add(props, 'initialStrokes', 0, 10).step(1)
    gui.add(props, 'strokesMultiplier', 0, 10).step(1)
  
    gui.add(props, 'marginX',  0, 200).step(1);
    gui.add(props, 'marginY',  0, 200).step(1);
  
    gui.add(props, 'stroke')
    
    gui.add(props, 'drawGrid')
    gui.addColor(props, 'grid')
  
    gui.addColor(props, 'foreground')
    gui.addColor(props, 'background')
  
    gui.add(props, 'animate')
    gui.add(props, 'frameNumber', 0, props.numberOfFrames).step(1)
  
    let sampling = gui.addFolder('Recording')
    sampling.add(props, 'numberOfFrames', 1, 180).step(1);
    sampling.add(props, 'frameRate', 1, 60).step(1);
  
    document.querySelector('#controls').appendChild(gui.domElement);
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
