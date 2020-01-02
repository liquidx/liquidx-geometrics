/* eslint-disable no-undef */
import p5 from '../node_modules/p5/lib/p5.min.js' //import p5 from 'p5'
import dat from 'dat.gui'
import { squareGrid, squareGridLines } from '../parts/grids.js'
import Capturer from '../parts/capturer.js'


// The canvas.
let p5canvas = null
let canvas = null
let _capturer = null

// Animation
let props = {}
let _shiftControllers = []

// eslint-disable-next-line no-unused-vars
let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    if (props.animate) {
      props.frameNumber += 1
    }
    let t = s.map(props.frameNumber, 0, props.numberOfFrames, 0, 1)
  
    let patternWidth = (props.width - 2 * props.marginX)
    let patternHeight = (props.height - 2 * props.marginY)
  
    if (props.animate) {
      props.shiftX =  props.magX * s.sin(s.TWO_PI  * t)
      //props.shiftY = 1 + cos(TWO_PI * 2 * t)
      //props.shiftZ = 1 + sin(TWO_PI * 2 * t)
      _shiftControllers.map(o => { o.updateDisplay() })
    }

    squareGrid(s, {},
      props.marginX, 
      props.marginY,
      patternWidth,
      patternHeight,
      props.countX,
      props.countY,
      drawOne
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
  const drawOne = (s, options, originX, originY, cellWidth, cellHeight, seqX, seqY, percentX, percentY) => {
    s.push();
    s.translate(originX, originY)
    if (props.stroke) {
      s.strokeWeight(2)
      s.stroke(props.foreground)
      s.noFill()
    } else {
      s.fill(props.foreground)
      s.noStroke()
    }
     if (props.quad == 'mountain') {
      let unitWidth = cellWidth - 2 * props.unitInset
      s.quad(
        props.unitInset + unitWidth / 3  + percentX * props.shiftX, props.unitInset,
        props.unitInset + unitWidth * 2 / 3  + percentY * props.shiftX, props.unitInset,
        props.unitInset + unitWidth, cellHeight - props.unitInset  - seqY * props.shiftY,
        0, cellHeight - props.unitInset - seqY * props.shiftY
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
    
    props = new Properties();
  
    let gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    gui.closed = false;
  
  
    gui.add(props, 'countX', 1, 32).step(1)
    gui.add(props, 'countY', 1, 32).step(1)
  
    gui.add(props, 'marginX', 0, 200).step(1)
    gui.add(props, 'marginY', 0, 200).step(1)
  
    gui.add(props, 'magX', 0, 10).step(1)
  
    let xc = gui.add(props, 'shiftX', -10, 10).step(1)
    let yc = gui.add(props, 'shiftY', -10, 10).step(1)
    let zc = gui.add(props, 'shiftZ', -10, 10).step(1)
    _shiftControllers.push(xc)
    _shiftControllers.push(yc)
    _shiftControllers.push(zc)
  
    gui.add(props, 'unitInset', 0, 10).step(1)
  
    gui.add(props, 'quad', ['mountain'])
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
