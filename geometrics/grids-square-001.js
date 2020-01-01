
import p5 from 'p5'
import dat from 'dat.gui'

import { squareGrid, squareGridLines } from '../parts/grids.js'

// The canvas.
let p5canvas = null
let canvas = null

// Animation
var t = 0
let props = {}
let _gui = null

let sketch = new p5(s => {

  s.draw = () => {
    s.startFrame()
    props.frameNumber += 1
    t = s.map(props.frameNumber, 0, props.numberOfFrames, 0, 1)
  
    let patternWidth = (props.width - 2 * props.marginX)
    let patternHeight = (props.height - 2 * props.marginY)
    let mutateWidth = props.mutateWidth + s.sin(s.TWO_PI * t) * 0.5

    squareGrid(s, {mutateWidth: mutateWidth},
      props.marginX, 
      props.marginY,
      patternWidth,
      patternHeight,
      props.count,
      props.count,
      drawOne
    )
  
    if (props.drawGrid) {
      squareGridLines(s, {},
        props.marginX, 
        props.marginY,
        patternWidth,
        patternHeight,
        props.count,
        props.count,
        props.grid
      )
    }
    s.endFrame();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const drawOne = (s, options, originX, originY, cellWidth, cellHeight, seqX, seqY, percentX, percentY) => {
    s.push();
    let squareWidth = (cellWidth - ((seqX + seqY) * options.mutateWidth)) * props.widthScale
    s.translate(originX + cellWidth / 2, originY + cellHeight / 2);
    s.fill(props.foreground);

    s.square(0, 0, squareWidth, props.corner);
    s.pop();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const setupProperties = () => {
    var Properties = function() {
      this.width = 480
      this.height = 360
  
      this.count = 10;
      this.widthScale = 0.8
  
      this.marginX = 68
      this.marginY = 8
  
      this.mutateWidth = 1
      this.shiftX = 0
      this.shiftY = 0
  
      this.corner = 4
      this.foreground = '#a9a9a9'
      this.background = '#202020'
      this.animate = true
  
      this.samplesPerFrame = 1
      this.numberOfFrames = 120
      this.frameRate = 30
      this.frameNumber = 0
    };
    
    props = new Properties();
  
    _gui = new dat.GUI({closed: true, autoPlace: false, width: 320})
    _gui.closed = false;
  
    _gui.add(props, 'count', 1, 16).step(1);
    _gui.add(props, 'widthScale', 0.5, 1.5).step(0.05);
  
    _gui.add(props, 'mutateWidth', -10, 10).step(0.5);
    _gui.add(props, 'shiftX', -10, 10).step(1);
    _gui.add(props, 'shiftY', -10, 10).step(1);
  
    _gui.add(props, 'marginX',  0, 200).step(1);
    _gui.add(props, 'marginY',  0, 200).step(1);
  
    _gui.add(props, 'corner', 0, 10).step(0.5);
    _gui.addColor(props, 'foreground')
    _gui.addColor(props, 'background')
    _gui.add(props, 'animate')
  
    let sampling = _gui.addFolder('Recording')
    sampling.add(props, 'samplesPerFrame', 1, 4).step(1);
    sampling.add(props, 'numberOfFrames', 1, 180).step(1);
    sampling.add(props, 'frameRate', 1, 60).step(1);
  
    document.querySelector('#controls').appendChild(_gui.domElement);
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

    CAPTURER.init(canvas, 
      canvas.width, canvas.height, 
      props.frameRate, 
      props.numberOfFrames, 
      'animation')

    document.querySelector('#capture').addEventListener('click', e => {
      props.frameNumber = 1
      CAPTURER.enableCapture()
      CAPTURER.start()
      e.stopPropagation()
      return false;
    })
  }

  s.startFrame = () => {
    s.clear();
    s.background(props.background);
  }

  s.endFrame = () => {
    CAPTURER.captureFrame(canvas);
  }
})
